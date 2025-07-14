import { createFormComponent } from '../components/form.js';
import { createEventFormComponent } from '../components/eventForm.js';
import { getCurrentUser, logout } from '../js/auth.js'; // Referencias de vista y de funciones
import { getUsers, getEvent, getEventById } from '../js/api.js';

// Funcion para mostrar el dashboard, los usuarios y los eventos
export function dashboardView() {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    window.location.hash = '#/public';  // Valida que sea usuario admin y si no lo es lo envia a la vista publica
    return document.createElement('div');
  }

  // Construccion de el dashboard
  const container = document.createElement('div');
  container.innerHTML = `
    <header>
      <h1>Sistema de Gestión</h1>
      <div>Bienvenido, ${user.name} (<a href="#" id="logout">Cerrar sesión</a>)</div>
    </header>
    <nav class="sidebar">
      <ul>
        <li><a href="#/dashboard">Dashboard</a></li>
        <li><a href="#/admin/users">Gestionar Usuarios</a></li>
        <li><a href="#/admin/courses">Gestionar eventos</a></li>
      </ul>
    </nav>
    <main class="dashboard-main">
      <div class="dashboard-content">
        <h2>Dashboard Administrativo</h2>
        <section class="table-section">
          <h3>Usuarios</h3>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr>
              </thead>
              <tbody id="users-table"></tbody>
            </table>
          </div>
        </section>
        <section class="table-section">
          <h3>Cursos</h3>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Título</th><th>Descripción</th><th>Fecha de Inicio</th><th>Duración</th><th>Acciones</th></tr>
              </thead>
              <tbody id="events-table"></tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  `;

  // Funcion de deslogue
  const logoutLink = container.querySelector('#logout');
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  // Construccion de la tabla de usuarios
  const usersTable = container.querySelector('#users-table');
  getUsers().then((users) => {
    users.forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><button class="edit-user" data-id="${user.id}">Editar</button></td>
      `;
      usersTable.appendChild(tr);
    });

    // Funcion de edita el usuario 
    container.querySelectorAll('.edit-user').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const userData = await getUsers(btn.dataset.id); // Busca los botones con ese selector, envia los datos a la funcion createFormComponent
        const form = createFormComponent({ mode: 'edit', user: userData, onSubmit: () => window.location.reload() });
        container.appendChild(form.element);
        form.loadItems(btn.dataset.id);
      });
    });
  });

  // Construccion de la tabla de eventos
  const eventsTable = container.querySelector('#events-table');
  getEvent().then((events)=> {
    events.forEach((events) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${events.id}</td>
        <td>${events.title}</td>
        <td>${events.description}</td>
        <td>${events.startDate}</td>
        <td>${events.duration}</td>
        <td><button class="edit-event" data-id="${events.id}">Editar</button></td>
      `;
      eventsTable.appendChild(tr);
    });

    // Funcion para editar los eventos
    container.querySelectorAll('.edit-event').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const eventData = await getEventById(btn.dataset.id); // Busca los botones con ese selector, envia los datos a la funcion createCourseFormComponent
        const form = createEventFormComponent({ mode: 'edit', event: eventData, onSubmit: () => window.location.reload() });
        container.appendChild(form.element);
        form.loadEvent(btn.dataset.id);
      });
    });
  });

  return container;
}