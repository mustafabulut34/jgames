import React from 'react';
import {Table} from 'react-bootstrap';
import {format} from "date-fns";

const BookingList = ({bookings, currentPage, limit}) => {
    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>#</th>
                <th>Booking Number</th>
                <th>User</th>
                <th>Room</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Booking Date</th>
            </tr>
            </thead>
            <tbody>

            {bookings && bookings.length > 0 ? bookings.map((booking, index) => (

                    <tr key={(currentPage - 1) * limit + index + 1}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{booking.booking_number}</td>
                        <td>{booking.user_username}</td>
                        <td>{booking.room_title}</td>
                        <td>{booking.start_date}</td>
                        <td>{booking.end_date}</td>
                        <td>{format(new Date(booking.booking_date), "dd MMMM yyyy HH:mm")}</td>
                    </tr>
                )) :
                <tr>
                    <td colSpan={7}><span className="d-flex justify-content-center">No booking.</span></td>
                </tr>
            }
            </tbody>
        </Table>
    );
};

export default BookingList;
