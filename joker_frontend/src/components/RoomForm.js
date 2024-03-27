import React, {useState, useEffect} from 'react';
import {Form, Button} from 'react-bootstrap';

const RoomForm = ({room, onSubmit}) => {
    const [formData, setFormData] = useState({title: '', capacity: 1});
    const [errors, setErrors] = useState([]);


    useEffect(() => {
        if (room) {
            setFormData({
                id: room.id,
                title: room.title,
                capacity: room.capacity
            });
        }
    }, [room]);

    const validateForm = () => {
        if (!formData.title || !formData.capacity) {
            setErrors(prevErrors => [...prevErrors, 'Please fill out all fields']);
            return false;
        }
        if (formData.capacity < 1) {
            setErrors(prevErrors => [...prevErrors, 'Capacity must be minimum 1.']);
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        if (!validateForm()) {
            return;
        }
        onSubmit(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            {errors.length > 0 && (
                <div className="alert alert-danger" role="alert">
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <Form.Group controlId="title">
                <Form.Label>Title:</Form.Label>
                <Form.Control type="text" value={formData.title}
                              onChange={(e) => setFormData({...formData, title: e.target.value})}/>
            </Form.Group>
            <Form.Group controlId="capacity">
                <Form.Label>Capacity:</Form.Label>
                <Form.Control type="number" value={formData.capacity}
                              onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}/>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    );
};

export default RoomForm;
