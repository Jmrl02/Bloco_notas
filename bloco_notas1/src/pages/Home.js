import { signOut } from "firebase/auth";
import { database } from '../firebase';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

function HomeScreen() {
    const history = useNavigate();
    const [notes, setNotes] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTitulo, setNewTitulo] = useState('');
    const [newConteudo, setNewConteudo] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editedTitulo, setEditedTitulo] = useState('');
    const [editedConteudo, setEditedConteudo] = useState('');

    useEffect(() => {
        fetch('https://api.sheety.co/3c3661bd08795b26c99998297f39c730/blocoDeNotas/notas')
            .then(response => response.json())
            .then(data => {
                if (data && data.notas && Array.isArray(data.notas)) {
                    setNotes(data.notas);
                } else {
                    console.error('Dados recebidos não estão no formato esperado:', data);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar notas:', error);
            });
    }, []);

    const handleAddModalClose = () => {
        setShowAddModal(false);
        setNewTitulo('');
        setNewConteudo('');
        setEditingNoteId(null);
        setEditedTitulo('');
        setEditedConteudo('');
    };

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
                setNotes([...notes, addedNote]);
                handleAddModalClose();
            } else {
                console.error('Erro ao adicionar nota:', response.status);
            }
        } catch (error) {
            console.error('Erro ao adicionar nota:', error);
        }
    };


    const handleDeleteNote = async (noteId) => {
        const url = `https://api.sheety.co/3c3661bd08795b26c99998297f39c730/blocoDeNotas/notas/${noteId}`;
    
        try {
            const response = await fetch(url, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                const updatedNotes = notes.filter(note => note.id !== noteId);
                setNotes(updatedNotes);
            } else {
                console.error('Erro ao deletar nota:', response.status);
            }
        } catch (error) {
            console.error('Erro ao deletar nota:', error);
        }
    };



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
                method: 'PUT', // ou 'PATCH' dependendo do que a API Sheety espera
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

    const handleClick = () => {
        signOut(database).then(val => {
            console.log(val, "val")
            history('/')
        })
    };

    const handleEditNote = (noteId) => {
        const noteToEdit = notes.find(note => note.id === noteId);
        setEditingNoteId(noteId);
        setEditedTitulo(noteToEdit.titulo);
        setEditedConteudo(noteToEdit.conteudo);
        setShowAddModal(true);
    };

    return (
        <div className="container mt-4">
            <h1>Notas</h1>
            <ul className="list-group mt-3">
                {notes.map(note => (
                    <li
                        key={note.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <h4>{note.titulo}</h4>
                            <p>{note.conteudo}</p>
                        </div>
                        <div>
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
            <Button variant="success" onClick={() => setShowAddModal(true)}>
                Adicionar Nota
            </Button>
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
                        <Button variant="primary" onClick={editingNoteId !== null ? handleSaveEditedNote : handleAddNote}>
                            {editingNoteId !== null ? 'Salvar Nota Editada' : 'Adicionar Nota'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <div>
                <Button variant="primary" onClick={handleClick}>
                    Sign Out
                </Button>
            </div>
        </div>
    );
}

export default HomeScreen;
