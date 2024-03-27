import React, {useState} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import { createBooking } from '../api';

const BookForm = ({show, room, startDate, endDate, onCancel}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedStartDate, setSelectedStartDate] = useState(startDate);
    const [selectedEndDate, setSelectedEndDate] = useState(endDate);
    const [errors, setErrors] = useState([]);

    const closeModal = () => {
        setErrors([]);
        onCancel();
    };
    const validateForm = () => {
        if (!room) {
            setErrors(prevErrors => [...prevErrors, 'Please select a room.']);
            return false;
        }
        if (!selectedStartDate || !selectedEndDate) {
            setErrors(prevErrors => [...prevErrors, 'Fill out all form fields.']);
            return false;
        }

        const today = new Date().toISOString().split('T')[0];
        if (selectedStartDate < today) {
            setErrors(prevErrors => [...prevErrors, 'The start date cannot be earlier than today.']);
            return false;
        }
        if (selectedEndDate < selectedStartDate) {
            setErrors(prevErrors => [...prevErrors, 'The end date cannot be earlier than the start date.']);
            return false;
        }
        if (selectedEndDate === selectedStartDate) {
            setErrors(prevErrors => [...prevErrors, 'The end date cannot be equal the start date.']);
            return false;
        }
        return true;
    };
    const handleSubmit = async () => {
        setErrors([]);
        if (!validateForm()) {
            return;
        }

        try {
            const response = await createBooking(room.id, selectedStartDate, selectedEndDate);

            if (response.ok) {
                closeModal();
                navigate('/bookings');
            } else {
                if (response.status === 401) {
                    dispatch({type: "CLEAR_AUTH"});
                    localStorage.removeItem('token');
                    localStorage.removeItem('isAdmin');
                    navigate("/login");
                }
                const errorData = await response.json();
                if (Array.isArray(errorData)) {
                    setErrors(errorData);
                } else if (typeof errorData === 'object') {
                    const fieldErrors = Object.values(errorData).flat();
                    setErrors(fieldErrors);
                } else {
                    setErrors(['An unknown error occurred.']);
                }
                return;
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <Modal show={show} onHide={closeModal} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{room.title} | Book Room</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errors.length > 0 && (
                    <div className="alert alert-danger" role="alert">
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <p><strong>Capacity:</strong> {room.capacity}</p>
                <Form>
                    <Form.Group controlId="startDate">
                        <Form.Label>Start Date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={selectedStartDate}
                            onChange={(e) => setSelectedStartDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="endDate">
                        <Form.Label>End Date:</Form.Label>
                        <Form.Control
                            type="date"
                            value={selectedEndDate}
                            onChange={(e) => setSelectedEndDate(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Book
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BookForm;
