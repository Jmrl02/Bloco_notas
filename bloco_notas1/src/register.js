import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      // Aqui você faria uma requisição POST para o endpoint Sheety para criar um novo usuário
      const response = await axios.post('https://api.sheety.co/3c3661bd08795b26c99998297f39c730/blocoDeNotas/folha1', {
        username: username,
        password: password,
        email: email,
        // Outros campos do formulário, se houverem
      });

      // Lógica para tratamento da resposta da criação do usuário, se necessário

      console.log('Usuário registrado com sucesso');
    } catch (error) {
      setError('Erro ao tentar registrar');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <Link to="/login" className="btn btn-secondary me-3">Go to Login</Link>
      <button className="btn btn-primary" onClick={handleRegister}>
        Register
      </button>
      {error && <p className="mt-3 text-danger">{error}</p>}
    </div>
  );
}


export default Register;
