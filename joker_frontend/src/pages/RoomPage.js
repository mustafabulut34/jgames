import React, {useEffect, useState} from 'react';
import RoomList from '../components/RoomList';
import {Button, ButtonGroup, Container, Form} from 'react-bootstrap';
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import requireAuth from "../components/RequireAuth";
import { createRoom, deleteRoom, fetchRooms, updateRoom } from '../api';


const RoomPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [rooms, setRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [prevPage, setPrevPage] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [count, setCount] = useState(null);

    const [sortBy, setSortBy] = useState("");
    const [limit, setLimit] = useState(20);
    let startDate, endDate;
    const [isSearch, setIsSearch] = useState(location.state && location.state.search);
    if (isSearch && location.state) {
        startDate = location.state.startDate
        endDate = location.state.endDate
    }

    const getRooms = async () => {
        let params = "?page=" + currentPage
        if (sortBy) {
            params += '&sort=' + sortBy;
        }
        if (limit) {
            params += '&limit=' + limit;
        }

        try {
            const response = await fetchRooms(currentPage, sortBy, limit);
            if (response.ok) {
                const data = await response.json();
                setIsSearch(false);
                setRooms(data.results);
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

    useEffect(() => {
        if (isSearch && location.state) {
            setRooms(location.state.rooms);
        } else {
            getRooms().then(r => {});
        }
    }, [location, currentPage, sortBy, limit, isSearch]);

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
    const redirectHome = () => {
        navigate('/', isSearch && location.state ? {state: location.state} : undefined);
    };
    const onDelete = async (room) => {
        try {
            const response = await deleteRoom(room.id);

            if (!response.ok) {
                if (response.status === 401) {
                    dispatch({type: "CLEAR_AUTH"});
                    localStorage.removeItem('token');
                    localStorage.removeItem('isAdmin');
                    navigate("/login");
                }
                const errorData = await response.json();
                let errors;
                if (Array.isArray(errorData)) {
                    errors = errorData;
                } else if (typeof errorData === 'object') {
                    errors = Object.values(errorData).flat();
                } else {
                    errors = ['An unknown error occurred.'];
                }
                alert('Delete request failed: ' + errors);
                return;
            }
            alert('Room is deleted.');
            getRooms();
        } catch (error) {
            console.error('An error occurred while deleting:', error);
        }
    };
    const onEdit = async (room) => {
        try {
            const response = await updateRoom(room.id, room);

            if (!response.ok) {
                if (response.status === 401) {
                    dispatch({type: "CLEAR_AUTH"});
                    localStorage.removeItem('token');
                    localStorage.removeItem('isAdmin');
                    navigate("/login");
                }
                const errorData = await response.json();
                let errors;
                if (Array.isArray(errorData)) {
                    errors = errorData;
                } else if (typeof errorData === 'object') {
                    errors = Object.values(errorData).flat();
                } else {
                    errors = ['An unknown error occurred.'];
                }
                alert('Update request failed: ' + errors);
                return false;
            }
            alert('Room is updated.');
            getRooms();
        } catch (error) {
            console.error('An error occurred while updating:', error);
        }
    };
    const onCreate = async (room) => {
        try {
            const response = await createRoom(room);

            if (!response.ok) {
                if (response.status === 401) {
                    dispatch({type: "CLEAR_AUTH"});
                    localStorage.removeItem('token');
                    localStorage.removeItem('isAdmin');
                    navigate("/login");
                }
                const errorData = await response.json();
                let errors;
                if (Array.isArray(errorData)) {
                    errors = errorData;
                } else if (typeof errorData === 'object') {
                    errors = Object.values(errorData).flat();
                } else {
                    errors = ['An unknown error occurred.'];
                }
                alert('Create request failed: ' + errors);
                return false;
            }
            alert('Room is created.');
            getRooms();
        } catch (error) {
            console.error('An error occurred while creating:', error);
        }
    };
    return (
        <Container>
            <h1>Rooms</h1>
            {isSearch && location.state ?
                (
                    <div className="d-flex justify-content-between pb-2">
                        <div className="align-bottom">
                            {
                                location.state.rooms.length > 0 ?
                                    <span>Rooms with a capacity equal to or greater than {location.state.capacity} between dates {location.state.startDate} and {location.state.endDate} are listed.</span>
                                    :
                                    <span>No rooms with a capacity equal to or greater than {location.state.capacity} were found between {location.state.startDate} and {location.state.endDate}.</span>
                            }
                        </div>
                        <div>
                            <ButtonGroup className="d-flex justify-content-end">
                                <Button className="pe-1" onClick={redirectHome}>New Search</Button>
                                <Button onClick={getRooms}>All Rooms</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                ) :
                (
                    <Form className="d-flex justify-content-end">
                        <Form.Group controlId="sortBy">
                            <Form.Label>Sort By:</Form.Label>
                            <Form.Control as="select" value={sortBy} onChange={handleSortChange}>
                                <option value="">-- Select --</option>
                                <option value="title">Title Ascending</option>
                                <option value="-title">Title Descending</option>
                                <option value="capacity">Capacity Ascending</option>
                                <option value="-capacity">Capacity Descending</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="limit">
                            <Form.Label>Limit:</Form.Label>
                            <Form.Control as="select" value={limit} onChange={handleLimitChange}>
                                <option value="5">5</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                )
            }

            <RoomList rooms={rooms} currentPage={currentPage} limit={limit} startDate={startDate} endDate={endDate}
                      onDelete={onDelete} onEdit={onEdit} onCreate={onCreate}/>
            {!isSearch && rooms && rooms.length > 0 ? (
                    <div style={{float: 'right'}}>
                        <ButtonGroup>
                            <Button disabled={currentPage === 1} onClick={handleFirstPage}>First</Button>
                            <Button disabled={!prevPage || currentPage <= 1} onClick={handlePrevPage}>Previous</Button>
                            <Button disabled={!nextPage} onClick={handleNextPage}>Next</Button>
                            <Button disabled={limit > count || Math.round(count / limit) === currentPage}
                                    onClick={handleLastPage}>Last</Button>
                        </ButtonGroup>
                    </div>
                ) :
                ""
            }
        </Container>
    );
};

export default requireAuth(RoomPage);
