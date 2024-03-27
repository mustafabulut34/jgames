import store from './store'
import {BASE_URL, endpoints} from './config';


const headers = {
    'Content-Type': 'application/json',
};


const request = async (url, method, data) => {
    const options = {headers};
    const state = store.getState();
    options.method = method
    if (data) {
        options.body = JSON.stringify(data);
    }

    if (state.auth.token) {
        headers.Authorization = `Token ${state.auth.token}`
    }

    try {
        return await fetch(url, options)
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const auth = async (username, password) => {
    const url = BASE_URL + endpoints.auth;
    return request(url, 'POST', {
        username: username,
        password: password
    });
};

export const fetchRooms = async (currentPage, sortBy, limit) => {
    let url = BASE_URL + endpoints.rooms.base;
    let params = "";

    if (currentPage) {
        params += "page=" + currentPage
    }
    if (sortBy) {
        params += '&sort=' + sortBy;
    }
    if (limit) {
        params += '&limit=' + limit;
    }

    if (params) {
        url += "?" + params
    }
    return await request(url, 'GET');
};

export const createRoom = async (data) => {
    const url = BASE_URL + endpoints.rooms.base;
    return await request(url, 'POST', data);
};

export const updateRoom = async (id, data) => {
    const url = BASE_URL + endpoints.rooms.base + id + '/';
    return await request(url, 'PATCH', data);
};

export const deleteRoom = async (id) => {
    const url = BASE_URL + endpoints.rooms.base + id + '/';
    return await request(url, 'DELETE');
};

export const fetchAvailableRooms = async (capacity, startDate, endDate) => {
    let params = `?capacity=${capacity}&start_date=${startDate}&end_date=${endDate}`
    const url = BASE_URL + endpoints.rooms.availableRooms + params;
    return await request(url, 'GET');
};

export const fetchBookings = async (currentPage, sortBy, limit) => {
    let url = BASE_URL + endpoints.bookings;
    let params = "";

    if (currentPage) {
        params += "page=" + currentPage;
    }
    if (sortBy) {
        params += '&sort=' + sortBy;
    }
    if (limit) {
        params += '&limit=' + limit;
    }
    if (params) {
        url += "?" + params;
    }

    return request(url, 'GET');
};

export const createBooking = async (room_id, startDate, endDate) => {
    const url = BASE_URL + endpoints.bookings;
    return request(url, 'POST', {
        room: room_id,
        start_date: startDate,
        end_date: endDate
    });
};


export default request;
