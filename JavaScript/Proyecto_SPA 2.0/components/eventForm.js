import { createEvent, updateEvent, getEventById } from '../js/api.js';
import { getCurrentUser } from '../js/auth.js';

export function createEventFormComponent({ onSubmit, mode = 'read', event = null } = {}) {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser && currentUser.role === 'admin'; // Verifica rol 
  const isEditMode = (mode === 'edit' || mode === 'create') && isAdmin; // Verifica si el formulario debe de estar en modo edicion

  // Creacion del formulario 
  const container = document.createElement('div');
  container.innerHTML = `
    <h3>${isEditMode ? (mode === 'create' ? 'Crear Evento' : 'Editar Evento') : 'Ver Evento'}</h3>
    <form id="courseForm">
      <input type="text" id="title" placeholder="Título" value="${event.title || ''}" ${isEditMode ? '' : 'disabled'} required>
      <textarea id="description" placeholder="Descripción" ${isEditMode ? '' : 'disabled'} required>${event?.description || ''}</textarea>
      <input type="date" id="startDate" placeholder="Fecha de inicio" value="${event?.startDate || ''}" ${isEditMode ? '' : 'disabled'} required>
      <input type="text" id="duration" placeholder="Duración" value="${event?.duration || ''}" ${isEditMode ? '' : 'disabled'} required>
      ${isEditMode ? '<button type="submit">Guardar</button>' : ''}
    </form>
    <p id="formMessage" style="color: red;"></p>
  `;

    //Referencias a los campos del form
  const form = container.querySelector('#eventForm');
  const titleInput = container.querySelector('#title');
  const descriptionInput = container.querySelector('#description');
  const startDateInput = container.querySelector('#startDate');
  const durationInput = container.querySelector('#duration');
  const message = container.querySelector('#formMessage');

  let editinId = events?.id || null; // si es null estamos agregando un curso y si no es null estamos editanto el curso con el id correspondiente

  if (isEditMode) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Referencia a los valores de los campos del form
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();
      const startDate = startDateInput.value.trim();
      const duration = durationInput.value.trim();

        // Valida que todos los campos esten llenos
      if (!title || !description || !startDate || !duration) {
        message.textContent = 'Todos los campos son obligatorios';
        return;
      }

      // Si editinId pasa algun valor actualiza el evento, si no pasa ningun valor crea un nuevo evento
      try {
        const data = { title, description, startDate, duration };
        if (editinId) {
          await updateEvent(editinId, data);
          message.textContent = 'Evento actualizado correctamente';
        // Si pasa null agrega el evento
        } else {
          await createEvent(data);
          message.textContent = 'Evento creado correctamente';
        }
    
        // Reseteo de valores y de form
        form.reset();
        editinId = null;
        if (onSubmit) onSubmit();
      } catch (error) {
        console.error(error);
        message.textContent = error.message || 'Error al guardar el evento';
      }
    });
  }

  // Carga los datos al formulario
  async function loadCourse(id) {
    try {
      const item = await getEventById(id);
      if (item) {
        titleInput.value = item.title;
        descriptionInput.value = item.description;
        startDateInput.value = item.startDate;
        durationInput.value = item.duration;
        editinId = item.id;
        message.textContent = isAdmin ? `Editando evento ID: ${item.id}` : `Viendo evento ID: ${item.id}`;
      } else {
        message.textContent = 'evento no encontrado';
      }
    } catch (error) {
      console.error(error);
      message.textContent = error.message || 'Error al cargar los datos del evento';
    }
  }

  return { element: container, loadCourse };
}