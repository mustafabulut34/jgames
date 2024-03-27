import React, {useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import LoginForm from '../components/LoginForm';
import {useNavigate, Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setAuth} from "../actions/tokenActions";
import { auth } from '../api';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const token = useSelector(state => state.auth.token);

    const handleLogin = async (username, password) => {
        try {
            const response = await auth(username, password);

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('isAdmin', data.is_admin);
                dispatch(setAuth({token: data.token, isAdmin:data.is_admin}));
                navigate('/');
            } else {
                const errorData = await response.json();
                if (Array.isArray(errorData)) {
                    setErrors(errorData);
                } else if (typeof errorData === 'object') {
                    const fieldErrors = Object.values(errorData).flat();
                    setErrors(fieldErrors);
                } else {
                    setErrors(['An unknown error occurred.']);
                }
                return false;
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    <h2 className="mb-4">Login</h2>
                    {token ?
                        <Navigate to='/'/> :
                        <LoginForm onSubmit={handleLogin} errors={errors}/>
                    }
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
