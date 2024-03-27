import React, {useState} from 'react';
import {Form, Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import { fetchAvailableRooms } from '../api';


const RoomAvailableForm = ({
                               capacity = 1,
                               startDate = new Date().toISOString().split('T')[0],
                               endDate = new Date().toISOString().split('T')[0]
                           }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);


    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const capacity = formData.get('capacity');
        const startDate = formData.get('startDate');
        const endDate = formData.get('endDate');
        setErrors([])

        if (!validateForm(startDate, endDate, capacity)) {
            return;
        }
        fetchAvailableRooms(capacity, startDate, endDate)
            .then(response => {
                if (response.status === 401) {
                    dispatch({type: "CLEAR_AUTH"});
                    localStorage.removeItem('token');
                    localStorage.removeItem('isAdmin');
                    navigate("/login");
                }
                return response.json()
            })
            .then(data => {
                navigate('/rooms', {
                    state: {
                        rooms: data,
                        capacity: capacity,
                        startDate: startDate,
                        endDate: endDate,
                        search: true
                    }
                });
            })
            .catch(error => console.log(error));
    };
    const validateForm = (startDate, endDate, capacity) => {
        const today = new Date().toISOString().split('T')[0];

        if (!startDate || !endDate || !capacity) {
            setErrors(prevErrors => [...prevErrors, 'Fill out all form fields.']);
            return false;
        }
        if (capacity < 1) {
            setErrors(prevErrors => [...prevErrors, 'Capacity must be minimum 1.']);
            return false;
        }
        if (startDate < today) {
            setErrors(prevErrors => [...prevErrors, 'The start date cannot be earlier than today.']);
            return false;
        }
        if (endDate < startDate) {
            setErrors(prevErrors => [...prevErrors, 'The end date cannot be earlier than the start date.']);
            return false;
        }
        if (endDate === startDate) {
            setErrors(prevErrors => [...prevErrors, 'The end date cannot be equal the start date.']);
            return false;
        }
        return true;
    };

    return (
        <>
            {errors.length > 0 && (
                <div className="alert alert-danger" role="alert">
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCapacity">
                    <Form.Label>Capacity:</Form.Label>
                    <Form.Control type="number" placeholder="Enter capacity" name="capacity" defaultValue={capacity}/>
                </Form.Group>
                <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date:</Form.Label>
                    <Form.Control type="date" name="startDate" defaultValue={startDate}/>
                </Form.Group>
                <Form.Group controlId="formEndDate">
                    <Form.Label>End Date:</Form.Label>
                    <Form.Control type="date" name="endDate" defaultValue={endDate}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Search
                </Button>
            </Form>
        </>
    );
};

export default RoomAvailableForm;
