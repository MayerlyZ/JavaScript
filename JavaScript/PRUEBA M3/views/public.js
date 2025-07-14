import { getEvent, enrollInEvent, getEnrollmentsByUser } from '../js/api.js'; // Importamos funciones 
import { getCurrentUser, logout } from '../js/auth.js';

// Creamos la vista publica 
export function publicView() {
  const user = getCurrentUser();
  console.log('Usuario actual', user)
  console.log('Ruta actual', window.location.hash)
  const container = document.createElement('div');
  container.innerHTML = `
    <header>
      ${user ? `<div>Bienvenido, ${user.name}</div>` :
      `<div><a href="#/login">LogIN</a> | <a href="#/register">Register</a></div>`}
    </header>
    <nav class="sidebar">
      <ul>
        <li><a href="#/public"><img src="./src/img/guardar-instagram.png" width="20px"> Enrollments</a></li>
        ${user ? `<li><a href="#/public/my-events"><img src="./src/img/gorro-de-graduacion.png" width="40px">Events</a></li>` : ''},
         <li><a href="#" id="logout"> Logout <img src="./src/img/cerrar-sesion.png" width="20px"></a></li>

      </ul>
    </nav>
    <main>
      <h2>${user ? `Welcome, ${user.name}` : 'Available events'}</h2>
      ${window.location.hash === '#/public/my-events' && user ? `
        <h3>My Events</h3>
        <ul id="my-events-list"></ul>
      ` : `
        <h3>Available events</h3>
        <ul id="events-list"></ul>
      `}
    </main>
  `;

  // Si el ususario se desloguea el sistema lo elimina del local storage y lo envia automaticamente al login
  if (user) {
    const logoutLink = container.querySelector('#logout');
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Referencias a ids
  const eventsList = container.querySelector('#events-list');
  const myEventsList = container.querySelector('#my-events-list');
  // Carga los eventos disponibles

  if (window.location.hash === '#/public/my-eventsLIST' && user) { // Verifica que el usuario este en esa ruta y que este logeado 
    getEnrollmentsByUser(user.id).then(async (enrollments) => { // Devuelve las inscripciones del usuario
      const events = await getEvent(); // Obtiene los eventos
      enrollments.forEach((enrollment) => {
        const event = events.find((c) => c.id === enrollment.eventId); // Revisa que el id de la inscripcion coincida con el id de el evento
        if (event) {
          const li = document.createElement('li');
          li.innerHTML = `${event.title} - ${event.description} (${event.startDate}, ${event.duration})`; // Esto lo agrega a la lista de mis eventos
        }
      });
    });

    // De lo contrario si el usuario no esta logeado muestra una lista con los eventos disponibles 
  } else {
    getEvent().then((events) => {
      events.forEach((event) => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${event.title} - ${event.description} (${event.startDate}, ${event.duration})
          ${user ? `<button class="enroll-btn" data-event id="${event.id}">Enrollments</button>` : ''}
        `;
        eventsList.appendChild(li);
      });

    // Si el usuario se quiere inscribir y esta logeado se le añadira el evento a la lista de mis eventos y se desactivara el boton de reservar
      if (user) {
        container.querySelectorAll('.enroll-btn').forEach((btn) => {
          btn.addEventListener('click', async () => {
            try {
              await enrollInEvent(user.id, btn.dataset.eventId);
              btn.parentElement.innerHTML += '<span style="color: green;"> Enrollments</span>';
              btn.remove();
              // Si el usuario no esta registrado le saldra un mensaje personalizado 
            } catch (error) {
              btn.parentElement.innerHTML += `<span style="color: red;">${error.message}</span>`;
            }
          });
        });
      }
    });
  }

  return container;
}