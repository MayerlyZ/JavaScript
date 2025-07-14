import { getCurrentUser } from "./auth.js";
const API_URL = 'http://localhost:3000';

// Funciones para users

// Funcion para obtener todos los datos de la API
export async function getUsers(){
    const res = await fetch(`${API_URL}/users`);
    if(!res.ok) throw new Error('Error al obtener los usuarios');
    return await res.json();
};

// Funcion para obtener un dato por id
export async function getElementById(id) {
    const res = await fetch(`${API_URL}/users/${id}`);
    if(!res.ok) throw new Error('Usuario no encontrado');
    return await res.json();
}

// Funcion para crear un nuevo usuario
export async function createItem(data) {
    const user = getCurrentUser();
    if(!user || user.role !== 'admin') {
        throw new Error('Solo admins pueden crear usuarios');
    }
    const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data),
    });
    if(!res.ok) throw new Error('Error al crear usuario');
    return await res.json();
}

// Funcion para actualizar por id un usuario
export async function updateItem(id, data) {
    const user = getCurrentUser();
    if(!user || user.role !== 'admin') {
        throw new Error('Solo admins pueden actualizar usuarios');
    }
    const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error('Error al actualizar usuario');
    return await res.json();
}

// Funcion para eliminar por id
export async function deleteItem(id) {
    const user = getCurrentUser();
    if(!user || user.role !== 'admin') {
        throw new Error('Solo admins pueden eliminar usuarios');
    }
    const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'Delete',
    });
    if(!res.ok) throw new Error('Error al eliminar usuario');
    return await res.json();
}

// Funciones para eventos

// Funcion para obtener los eventos
export async function getEvent(){
    const res = await fetch(`${API_URL}/events`);
    if(!res.ok) throw new Error('Evento no encontrado');
    return await res.json();
};

// Funcion para obtener un evento por id
export async function getEventById(id) {
    const res = await fetch(`${API_URL}/events/${id}`);
    if(!res.ok) throw new Error('Evento no encontrado');
    return await res.json();
}

// Funcion para crear un nuevo evento
export async function createEvent(data) {
    const user = getCurrentUser();
    if(!user || user.role !== 'admin') {
        throw new Error('Solo admins pueden crear eventos');
    }
    const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data),
    });
    if(!res.ok) throw new Error('Error al crear evento');
    return await res.json();
}

// Funcion para actualizar por id un evento
export async function updateEvent(id, data) {
    const user = getCurrentUser();
    if(!user || user.role !== 'admin') {
        throw new Error('Solo admins pueden actualizar los eventos');
    }
    const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error('Error al actualizar los eventos');
    return await res.json();
}

// Funcion para eliminar un evento por id
export async function deleteEvent(id) {
    const user = getCurrentUser();
    if(!user || user.role !== 'admin') {
        throw new Error('Solo admins pueden eliminar los eventos');
    }
    const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'Delete',
    });
    if(!res.ok) throw new Error('Error al eliminar el evento');
    return await res.json();
}

// Funciones para Enrollments

export async function enrollInEvent(userId, eventId) {
    const user = getCurrentUser();
    if(!user || user.role == 'userId') {
        throw new Error('Solo puedes reservar con tu cuenta');
    }
    const res = await fetch(`${API_URL}/enrollments`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({ userId: parseInt(userId), eventId: parseInt(eventId) }),
    });
    if(!res.ok) throw new Error('Error al reservar el evento');
    return await res.json();
}

export async function getEnrollmentsByUser(userId) {
    const res = await fetch(`${API_URL}/enrollments?userId=${userId}`);
    if(!res.ok) throw new Error('Error al obtener los eventos reservados');
    return await res.json();
}