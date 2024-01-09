import React, { useState } from "react";
import { database } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormControl } from 'react-bootstrap';

function RegisterAndLogin() {
  // Estado para controlar se exibir o formulário de registro ou login
  const [login, setLogin] = useState(false);
  const history = useNavigate();

  // Função para lidar com o envio do formulário de registro ou login
  const handleSubmit = (e, type) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // Verifica o tipo de ação (registro ou login)
    if (type === "signup") {
      // Cria um novo usuário com o Firebase Auth
      createUserWithEmailAndPassword(database, email, password)
        .then((data) => {
          console.log(data, "authData");
          history("/home"); // Redireciona para a página inicial após registro
        })
        .catch((err) => {
          alert(err.code);
          setLogin(true);
        });
    } else {
      // Autentica o usuário com o Firebase Auth
      signInWithEmailAndPassword(database, email, password)
        .then((data) => {
          console.log(data, "authData");
          history("/home"); // Redireciona para a página inicial após login
        })
        .catch((err) => {
          alert(err.code);
        });
    }
  };


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Barra de navegação entre registro e login */}
          <ul className="nav nav-tabs">
            <li className="nav-item">
              {/* Botão para exibir o formulário de registro */}
              <span
                className={login === false ? "nav-link active" : "nav-link"}
                onClick={() => setLogin(false)}
              >
                Register
              </span>
            </li>
            <li className="nav-item">
              {/* Botão para exibir o formulário de login */}
              <span
                className={login === true ? "nav-link active" : "nav-link"}
                onClick={() => setLogin(true)}
              >
                Login
              </span>
            </li>
          </ul>
          {/* Título do formulário baseado no estado 'login' */}
          <h1 className="mt-3">{login ? "Login" : "Register"}</h1>
          {/* Formulário para registro ou login */}
          <Form onSubmit={(e) => handleSubmit(e, login ? "Login" : "Register")}>
            <Form.Group className="mb-3">
              {/* Campo de entrada para email */}
              <FormControl
                name="email"
                type="email"
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              {/* Campo de entrada para senha */}
              <FormControl
                name="password"
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <div className="mb-3">
              {/* Botão para enviar o formulário de registro ou login */}
              <Button type="submit" variant="primary">
                {login ? "Login" : "Register"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegisterAndLogin;
