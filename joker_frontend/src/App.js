import React from 'react';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import {Navbar, Container, Nav, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import RoomPage from './pages/RoomPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";
import {useDispatch, useSelector} from "react-redux";

function App() {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch({type: "CLEAR_AUTH"});
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
    };
    return (
        <Router>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">Book Room</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            {
                                token && (
                                    <>
                                        <Nav.Link as={Link} to="/bookings">Bookings</Nav.Link>
                                        <Nav.Link as={Link} to="/rooms">Rooms</Nav.Link>
                                    </>
                                )
                            }
                            {token && <Button onClick={handleLogout}>Logout</Button>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/rooms" element={<RoomPage/>}/>
                <Route path="/bookings" element={<BookingPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
