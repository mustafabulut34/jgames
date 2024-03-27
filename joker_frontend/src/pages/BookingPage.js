import React, {useState, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Container, Button, ButtonGroup, Form} from 'react-bootstrap';

import BookingList from '../components/BookingList';
import requireAuth from "../components/RequireAuth";
import { fetchBookings } from '../api';

const BookingPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [prevPage, setPrevPage] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [count, setCount] = useState(null);

    const [sortBy, setSortBy] = useState("");
    const [limit, setLimit] = useState(20);


    useEffect(() => {
        const getBookings = async () => {
            try {
                const response = await fetchBookings(currentPage, sortBy, limit);
                if (response.ok) {
                    const data = await response.json();
                    setBookings(data.results);
                    setPrevPage(data.previous);
                    setNextPage(data.next);
                    setCount(data.count);
                } else {
                    if (response.status === 401) {
                        dispatch({type: "CLEAR_AUTH"});
                        localStorage.removeItem('token');
                        localStorage.removeItem('isAdmin');
                        navigate("/login");
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        getBookings();
    }, [currentPage, sortBy, limit]);

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };
    const handleFirstPage = () => {
        setCurrentPage(1);
    };
    const handleLastPage = () => {
        setCurrentPage(Math.round(count / limit));
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    return (
        <Container>
            <h1>Bookings</h1>
            <Form className="d-flex justify-content-end">
                <Form.Group controlId="sortBy">
                    <Form.Label>Sort By:</Form.Label>
                    <Form.Control as="select" value={sortBy} onChange={handleSortChange}>
                        <option value="">-- Select --</option>
                        <option value="start_date">Start Date Ascending</option>
                        <option value="-start_date">Start Date Descending</option>
                        <option value="end_date">End Date Ascending</option>
                        <option value="-end_date">End Date Descending</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="limit">
                    <Form.Label>Limit:</Form.Label>
                    <Form.Control as="select" value={limit} onChange={handleLimitChange}>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </Form.Control>
                </Form.Group>
            </Form>
            <BookingList bookings={bookings} currentPage={currentPage} limit={limit}/>
            <div style={{float: 'right'}}>
                <ButtonGroup>
                    <Button disabled={currentPage === 1} onClick={handleFirstPage}>First</Button>
                    <Button disabled={!prevPage || currentPage <= 1} onClick={handlePrevPage}>Previous</Button>
                    <Button disabled={!nextPage} onClick={handleNextPage}>Next</Button>
                    <Button disabled={limit > count || Math.round(count / limit) === currentPage}
                            onClick={handleLastPage}>Last</Button>
                </ButtonGroup>
            </div>
        </Container>
    );
};

export default requireAuth(BookingPage);
