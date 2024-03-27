import React from "react";
import {useLocation} from 'react-router-dom';

import {Container} from "react-bootstrap";
import RoomAvailableForm from "../components/RoomAvailableForm";
import requireAuth from "../components/RequireAuth";

const HomePage = () => {
    const location = useLocation();
    let capacity, startDate, endDate;

    if (location.state) {
        capacity = location.state.capacity
        startDate = location.state.startDate
        endDate = location.state.endDate
    } else {
        capacity = 1
        const today = new Date();
        startDate = today.toISOString().split('T')[0];

        today.setDate(today.getDate() + 1);
        endDate = today.toISOString().split('T')[0];
    }

    return (
        <Container>
            <h1>Rooms</h1>
            <RoomAvailableForm capacity={capacity} startDate={startDate} endDate={endDate}/>
        </Container>
    );
}

export default requireAuth(HomePage);