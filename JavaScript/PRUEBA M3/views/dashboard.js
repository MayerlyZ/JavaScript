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
      <h1>Events</h1>
      <button>Add event</button>
      <div>Welcome, ${user.name}</div>
    </header>
    <nav class="sidebar">
      <ul>
        <li class="imagen"> <img src="./src/img/vaca.png" width="150px"> <p>Admon</p></li><br><br><br><br><br>
        
        <li class="event"><a href="#/dashboard">Events</a></li>
        <li><a href="#" id="logout"> Logout <img src="./src/img/cerrar-sesion.png" alt="log"></a>
       
      </ul>
    </nav>
    <main class="dashboard-main">
      <div class="dashboard-content">
         <section class="table-section">
          <h3>Events</h3>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Descripción</th><th>Capacity</th><th>Date</th><th></th></tr>
              </thead>
              <tbody id="events-table"></tbody>
            </table>
          </div>
        </section>
    
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
        <td><button class="edit-user" data-id="${user.id}"><img src="./src/img/lapiz.png"></button></td>
        <td><button class="delete-user" data-id="${user.id}"><img src="./src/img/basura.png"></button></td>

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
  getEvent().then((event)=> {
    event.forEach((event) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${event.id}</td>
        <td>${event.title}</td>
        <td>${event.description}</td>
        <td>${event.capacity}</td>
        <td>${event.startDate}</td>
        
        <td><button class="edit-event" data-id="${event.id}"><img src="./src/img/lapiz.png"></button></td>
        <td><button class="delete-event" data-id="${event.id}"><img src="./src/img/basura.png"></button></td>
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

    //Funcion para eliminar los eventos


  });

  return container;
}