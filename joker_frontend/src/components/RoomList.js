import React, {useState} from 'react';
import {Table, Button, Modal} from 'react-bootstrap';
import BookForm from "./BookForm";
import RoomForm from "./RoomForm";
import {useSelector} from "react-redux";

const RoomList = ({rooms, currentPage, limit, startDate, endDate, onDelete, onEdit, onCreate}) => {
        const [showBookModal, setShowBookModal] = useState(false);
        const [showConfirmModal, setShowConfirmModal] = useState(false);
        const [showEditModal, setShowEditModal] = useState(false);
        const [showAddModal, setShowAddModal] = useState(false);
        const [roomToBook, setRoomToBook] = useState(null);
        const [roomToDelete, setRoomToDelete] = useState(null);
        const [roomToEdit, setRoomToEdit] = useState(null);

        let isAdmin = useSelector(state => state.auth.isAdmin);
        if (typeof isAdmin === "boolean") {
            isAdmin = isAdmin.toString()
        }

        const handleBookClick = (room) => {
            setRoomToBook(room);
            setShowBookModal(true);
        };

        const handleEditClick = (room) => {
            setRoomToEdit(room);
            setShowEditModal(true);
        };

        const handleEditSubmit = (updatedRoom) => {
            onEdit(updatedRoom);
            setRoomToEdit(null);
            setShowEditModal(false);
        };
        const handleCreateSubmit = (createdRoom) => {
            onCreate(createdRoom);
            setShowAddModal(false);
        };
        const handleDeleteClick = (room) => {
            setRoomToDelete(room);
            setShowConfirmModal(true);
        };
        const handleConfirmDelete = () => {
            onDelete(roomToDelete);
            setShowConfirmModal(false);
        };


        return (
            <>
                {
                    isAdmin === 'true' &&
                    <Button className="m-1" variant="success" onClick={() => setShowAddModal(true)}>Add Room</Button>
                }
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Room Name</th>
                        <th>Capacity</th>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {rooms && rooms.length > 0 ? (
                            rooms.map((room, index) => (
                                <tr className="align-middle" key={(currentPage - 1) * limit + index + 1}>
                                    <td>{(currentPage - 1) * limit + index + 1}</td>
                                    <td>{room.title}</td>
                                    <td>{room.capacity}</td>
                                    <td style={{width: '20%'}}>
                                        <Button className="mr-1" variant="success"
                                                onClick={() => handleBookClick(room)}>Book</Button>
                                        {
                                            isAdmin === 'true' &&
                                            <>
                                                <Button className="mx-1" variant="primary"
                                                        onClick={() => handleEditClick(room)}>Edit</Button>
                                                <Button className="ml-1" variant="danger"
                                                        onClick={() => handleDeleteClick(room)}>Delete</Button>
                                            </>
                                        }
                                    </td>
                                </tr>
                            ))) :
                        <tr>
                            <td colSpan={4}><span className="d-flex justify-content-center">No available room.</span></td>
                        </tr>
                    }
                    </tbody>
                </Table>
                {
                    roomToBook && <BookForm
                        show={showBookModal}
                        room={roomToBook}
                        startDate={startDate ? startDate : new Date().toISOString().split('T')[0]}
                        endDate={endDate ? endDate : new Date().toISOString().split('T')[0]}
                        onCancel={() => setShowBookModal(false)}
                    />
                }
                {
                    roomToDelete &&
                    <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete the room? Room: {roomToDelete.title}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                            <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
                        </Modal.Footer>
                    </Modal>
                }
                {
                    roomToEdit &&
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Room</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <RoomForm room={roomToEdit} onSubmit={(updatedRoom) => handleEditSubmit(updatedRoom)}/>
                        </Modal.Body>
                    </Modal>
                }
                {isAdmin === 'true' &&
                <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <RoomForm room={null} onSubmit={(createdRoom) => handleCreateSubmit(createdRoom)}/>
                    </Modal.Body>
                </Modal>
                }
            </>
        );
    }
;

export default RoomList;
