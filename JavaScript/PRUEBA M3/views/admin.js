import { createFormComponent } from '../components/form.js';
import { createEventFormComponent } from '../components/eventForm.js';
import { getUsers, getEvent, deleteItem, deleteEvent, getEventById, getElementById} from '../js/api.js';
import { getCurrentUser, logout } from '../js/auth.js';

export function adminView() {
  const user = getCurrentUser();
  const container = document.createElement('div');
  const isUsersView = window.location.hash === '#/admin/users';
  const isEventView = window.location.hash === '#/admin/events';

  // Solo crear el contenido principal, sin header ni sidebar duplicados
  container.innerHTML = `
    <header>
      <h1>Events</h1>
      <div>Bienvenido, ${user.name} (<a href="#" id="logout">Cerrar sesión</a>)</div>
    </header>
    <nav class="sidebar">
      <ul>
        <li><a href="#/dashboard">Dashboard</a></li>
        <li><a href="#/admin/users">Gestionar Usuarios</a></li>
        <li><a href="#/admin/courses">Gestionar Eventos</a></li>
      </ul>
    </nav>
    <main class="admin-main">
      <div class="admin-content">
        <h2>${isUsersView ? 'Gestionar Usuarios' : isEventView ? 'Gestionar Eventos' : 'Panel de Administrador'}</h2>
        ${isUsersView ? `
          <section class="form-section">
            <div id="user-form" class="form-container"></div>
          </section>
          <section class="table-section">
            <h3>Lista de Usuarios</h3>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr>
                </thead>
                <tbody id="users-table"></tbody>
              </table>
            </div>
          </section>
        ` : isEventView ? `
          <section class="form-section">
            <h3>Crear Evento</h3>
            <div id="event-form" class="form-container"></div>
          </section>
          <section class="table-section">
            <h3>Lista de Eventos</h3>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr><th>ID</th><th>Título</th><th>Descripción</th><th>Fecha del evento</th><th>Duración</th><th>Acciones</th></tr>
                </thead>
                <tbody id="events-table"></tbody>
              </table>
            </div>
          </section>
        ` : '<p>Seleccione una opción del menú</p>'}
      </div>
    </main>
  `;

  const logoutLink = container.querySelector('#logout');
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  // Condicion para ver usuarios
  if (isUsersView) {
    const userForm = createFormComponent({ mode: 'create', onSubmit: () => window.location.reload() });
    container.querySelector('#user-form').appendChild(userForm.element);

    getUsers().then((users) => {
      const usersTable = container.querySelector('#users-table');
      users.forEach((user) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <button class="edit-user" data-id="${user.id}">Editar</button>
            <button class="delete-user" data-id="${user.id}">Eliminar</button>
          </td>
        `;
        usersTable.appendChild(tr);
      });

      // Funcion para editar el usuario
      container.querySelectorAll('.edit-user').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const userData = await getElementById(btn.dataset.id);
          const form = createFormComponent({ mode: 'edit', user: userData, onSubmit: () => window.location.reload() });
          container.querySelector('#user-form').innerHTML = '';
          container.querySelector('#user-form').appendChild(form.element);
          form.loadItems(btn.dataset.id);
        });
      });

      // Funcion para eliminar un usuario
      container.querySelectorAll('.delete-user').forEach((btn) => {
        btn.addEventListener('click', async () => {
          try {
            await deleteItem(btn.dataset.id);
            btn.closest('tr').remove();
          } catch (error) {
            alert(error.message);
          }
        });
      });
    });
  }

  // Condicion para ver los eventos
  if (isEventView) {
    const eventForm = createEventFormComponent({ mode: 'create', onSubmit: () => window.location.reload() });
    container.querySelector('#event-form').appendChild(eventForm.element);

    getEvent().then((events) => {
      const eventsTable = container.querySelector('#events-table');
      events.forEach((event) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${event.id}</td>
          <td>${event.title}</td>
          <td>${event.description}</td>
          <td>${event.startDate}</td>
          <td>${event.duration}</td>
          <td>
            <button class="edit-event" data-id="${event.id}">Editar</button>
            <button class="delete-event" data-id="${event.id}">Eliminar</button>
          </td>
        `;
        coursesTable.appendChild(tr);
      });

      // Funcion para editar los eventos
      container.querySelectorAll('.edit-event').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const eventData = await getEventById(btn.dataset.id);
          const form = createEventFormComponent({ mode: 'edit', event: eventData, onSubmit: () => window.location.reload() });
          container.querySelector('#event-form').innerHTML = '';
          container.querySelector('#event-form').appendChild(form.element);
          form.loadEvent(btn.dataset.id);
        });
      });

      // Funcion para eliminar los eventos
      container.querySelectorAll('.delete-event').forEach((btn) => {
        btn.addEventListener('click', async () => {
          try {
            await deleteEvent(btn.dataset.id);
            btn.closest('tr').remove();
          } catch (error) {
            alert(error.message);
          }
        });
      });
    });
  }

  return container;
}