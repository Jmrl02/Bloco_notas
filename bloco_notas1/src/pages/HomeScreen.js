// Importação dos módulos e dependências necessárias
import { signOut } from "firebase/auth";
import { database } from '../firebase';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function HomeScreen() {
    // Inicialização dos estados para armazenar as informações das notas e dos componentes do formulário
    const history = useNavigate();
    const [notes, setNotes] = useState([]); // Armazena as notas recuperadas da API
    const [showAddModal, setShowAddModal] = useState(false); // Controla a exibição do modal de adição/edição de notas
    const [newTitulo, setNewTitulo] = useState(''); // Armazena o título da nova nota
    const [newConteudo, setNewConteudo] = useState(''); // Armazena o conteúdo da nova nota
    const [editingNoteId, setEditingNoteId] = useState(null); // Armazena o ID da nota sendo editada
    const [editedTitulo, setEditedTitulo] = useState(''); // Armazena o título da nota em edição
    const [editedConteudo, setEditedConteudo] = useState(''); // Armazena o conteúdo da nota em edição
    const [searchTerm, setSearchTerm] = useState(''); // Armazena o termo de busca para filtrar as notas
    const [searchResults, setSearchResults] = useState([]); // Armazena os resultados da busca
    const navigate = useNavigate(); // Função para navegar entre rotas
    const [userLoggedIn, setUserLoggedIn] = useState(false); // Verifica se o usuário está logado

    // Recuperação das notas da API quando o componente é montado
    useEffect(() => {
        fetch('https://api.sheety.co/3c3661bd08795b26c99998297f39c730/blocoDeNotas/notas')
            .then(response => response.json())
            .then(data => {
                if (data && data.notas && Array.isArray(data.notas)) {
                    setNotes(data.notas); // Atualiza o estado com as notas recuperadas
                } else {
                    console.error('Dados recebidos não estão no formato esperado:', data);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar notas:', error);
            });
    }, []);

    // Verificação do estado de autenticação do usuário
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserLoggedIn(true); // Define como true se o usuário estiver logado
            } else {
                setUserLoggedIn(false); // Define como false se o usuário não estiver logado
            }
        });

        return () => unsubscribe(); // Limpa o evento de autenticação ao desmontar o componente
    }, []);

    // Função para lidar com o evento de login
    const handleLogin = () => {
        navigate('/'); // Navega para a rota de login
    };

    // Filtragem das notas com base no termo de busca
    useEffect(() => {
        const results = notes.filter(note =>
            note.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results); // Atualiza os resultados da busca com as notas filtradas
    }, [searchTerm, notes]);


    // Função para fechar o modal de adição/edição de notas
    const handleAddModalClose = () => {
        setShowAddModal(false);
        setNewTitulo('');
        setNewConteudo('');
        setEditingNoteId(null);
        setEditedTitulo('');
        setEditedConteudo('');
    };

    // Função para adicionar uma nova nota
    const handleAddNote = async () => {
        const newId = uuidv4();
        const url = 'https://api.sheety.co/3c3661bd08795b26c99998297f39c730/blocoDeNotas/notas';
        const body = {
            nota: {
                id: newId,
                titulo: newTitulo,
                conteudo: newConteudo,
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const data = await response.json();
                const addedNote = data.nota;
                setNotes([...notes, addedNote]); // Adiciona a nova nota ao estado das notas
                handleAddModalClose();
            } else {
                console.error('Erro ao adicionar nota:', response.status);
            }
        } catch (error) {
            console.error('Erro ao adicionar nota:', error);
        }
    };

    // Função para apagar uma nota existente
    const handleDeleteNote = async (noteId) => {
        const url = `https://api.sheety.co/3c3661bd08795b26c99998297f39c730/blocoDeNotas/notas/${noteId}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedNotes = notes.filter(note => note.id !== noteId);
                setNotes(updatedNotes); // Atualiza o estado removendo a nota deletada
            } else {
                console.error('Erro ao apagar nota:', response.status);
            }
        } catch (error) {
            console.error('Erro ao apagar nota:', error);
        }
    };

    // Função para salvar uma nota editada
    const handleSaveEditedNote = async () => {
        const editedNoteIndex = notes.findIndex(note => note.id === editingNoteId);
        const editedNote = {
            id: editingNoteId,
            titulo: editedTitulo,
            conteudo: editedConteudo,
        };

        const updatedNotes = [...notes];
        updatedNotes[editedNoteIndex] = editedNote;
        setNotes(updatedNotes);
        handleAddModalClose();

        const url = `https://api.sheety.co/3c3661bd08795b26c99998297f39c730/blocoDeNotas/notas/${editingNoteId}`;
        const body = {
            nota: {
                titulo: editedTitulo,
                conteudo: editedConteudo,
            }
        };

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                console.error('Erro ao editar nota na API:', response.status);
            }
        } catch (error) {
            console.error('Erro ao editar nota na API:', error);
        }
    };

    // Função para lidar com o evento de logout
    const handleClick = () => {
        signOut(database).then(val => {
            console.log(val, "val")
            history('/')
        })
    };

    // Função para editar uma nota existente
    const handleEditNote = (noteId) => {
        const noteToEdit = notes.find(note => note.id === noteId);
        setEditingNoteId(noteId);
        setEditedTitulo(noteToEdit.titulo);
        setEditedConteudo(noteToEdit.conteudo);
        setShowAddModal(true);
    };

    // Renderização condicional com base no estado do usuário logado
    return (
        <div className="container mt-4">
            {userLoggedIn ? (
                // Se o usuário estiver logado
                <div>
                    <h1>Notas</h1>
                    <input
                        type="text"
                        placeholder="Pesquisar por título"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                    <ul className="list-group mt-3">
                        {/* Mapeamento dos resultados da busca para exibição das notas */}
                        {searchResults.map(note => (
                            <li
                                key={note.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <h4>{note.titulo}</h4>
                                    <p>{note.conteudo}</p>
                                </div>
                                <div>
                                    {/* Botões para editar e apagar notas */}
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleEditNote(note.id)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteNote(note.id)}
                                    >
                                        Apagar
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/* Botão para adicionar uma nova nota */}
                    <Button variant="success" onClick={() => setShowAddModal(true)}>
                        Adicionar Nota
                    </Button>
                    {/* Modal para adição/edição de notas */}
                    <Modal show={showAddModal} onHide={handleAddModalClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{editingNoteId !== null ? 'Editar Nota' : 'Adicionar Nota'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="noteTitle">
                                    <Form.Label>Título</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Título da nota"
                                        value={editingNoteId !== null ? editedTitulo : newTitulo}
                                        onChange={(e) => {
                                            if (editingNoteId !== null) {
                                                setEditedTitulo(e.target.value);
                                            } else {
                                                setNewTitulo(e.target.value);
                                            }
                                        }}
                                    />
                                </Form.Group>
                                <Form.Group controlId="noteContent">
                                    <Form.Label>Conteúdo</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Conteúdo da nota"
                                        value={editingNoteId !== null ? editedConteudo : newConteudo}
                                        onChange={(e) => {
                                            if (editingNoteId !== null) {
                                                setEditedConteudo(e.target.value);
                                            } else {
                                                setNewConteudo(e.target.value);
                                            }
                                        }}
                                    />
                                </Form.Group>
                                {/* Botão para salvar a nota editada ou adicionar uma nova nota */}
                                <Button variant="primary" onClick={editingNoteId !== null ? handleSaveEditedNote : handleAddNote}>
                                    {editingNoteId !== null ? 'Salvar Nota Editada' : 'Adicionar Nota'}
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                    {/* Botão para realizar logout */}
                    <div>
                        <Button variant="primary" onClick={handleClick}>
                            Sign Out
                        </Button>
                    </div>
                </div>
            ) : (
                // Se o usuário não estiver logado, exibe uma mensagem de alerta e um botão para login
                <Alert variant="warning">
                    Você precisa fazer login para acessar esta página.
                    <Button variant="primary" onClick={handleLogin}>
                        Fazer Login
                    </Button>
                </Alert>
            )}
        </div>
    );
}

export default HomeScreen;