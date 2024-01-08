import React, { useState } from "react";
import { database } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, FormControl } from 'react-bootstrap';


function RegisterAndLogin() {
  const [login, setLogin] = useState(false);
  const history = useNavigate();

  const handleSubmit = (e, type) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (type === "signup") {
      createUserWithEmailAndPassword(database, email, password)
        .then((data) => {
          console.log(data, "authData");
          history("/home");
        })
        .catch((err) => {
          alert(err.code);
          setLogin(true);
        });
    } else {
      signInWithEmailAndPassword(database, email, password)
        .then((data) => {
          console.log(data, "authData");
          history("/home");
        })
        .catch((err) => {
          alert(err.code);
        });
    }
  };

  const handleReset = () => {
    history("/reset");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <span
                className={login === false ? "nav-link active" : "nav-link"}
                onClick={() => setLogin(false)}
              >
                Register
              </span>
            </li>
            <li className="nav-item">
              <span
                className={login === true ? "nav-link active" : "nav-link"}
                onClick={() => setLogin(true)}
              >
                Login
              </span>
            </li>
          </ul>
          <h1 className="mt-3">{login ? "Login" : "Register"}</h1>
          <Form onSubmit={(e) => handleSubmit(e, login ? "Login" : "Register")}>
            <Form.Group className="mb-3">
              <FormControl
                name="email"
                type="email"
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <FormControl
                name="password"
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <div className="mb-3">
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
