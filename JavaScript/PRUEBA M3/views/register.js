import { register } from "../js/auth";

export function registerView(){
    // Mostramos el formulario de registro 
    const container = document.createElement('div');
    container.innerHTML = `
   
    <form id="registerForm">
    <h2>Register</h2>
    
      <label for="name">Full Name:</label>
      <input type="text" id="name" placeholder="Name" required>
      <label for="password">Password:</label>
      <input type="password" id="password" placeholder="Password" required>
      <label for ="password">Confirm Password:</label>
      <input type="password" id="confirmPassword" placeholder="Confirm password" required>

      <button type="submit">Register</button>
    </form>

    <p><a href="#/login">Already have an account? Sign in</a></p>
  `;

    // Otenemos el formulario y su mensaje de error
  const form = container.querySelector('#registerForm');
  const error = container.querySelector('#error');

  // Le asignamos un evento y traemos los datos del form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      phone: form.phone.value.trim(),
      dateOfEvent: form.dateOfEvent.value.trim(),
    };

    // Hace la validacion con la funcion register() y dependienmdo de la respuesta redirige al login o muestra un mensaje personalizado 
    try{
        await register(userData);
        error.textContent = 'Registration successful. Redirecting to login....';
        setTimeout(() => {
          window.location.hash = '#/login' 
        }, 2000);
    } catch (err) {
        error.textContent = err.messagge;
    };
  });

  return container;
}