import { login } from "../js/auth.js";  // Importamos la funcion login de auth

export function loginView(){
    // Mostramos el login en pantalla
    const container = document.createElement('div');
    container.innerHTML = `
    <form id="loginForm">
     <h2>Login</h2>
        <label for="email">Email:</label>
        <input type="email" id="email"  required>
        <label for="password">Password:</label>
        <input type="password" id="password"  required>
        <button type="submit">Enter</button>
    </form>
    <p><a href="#/register">Don't have an account? Sign up</a></p>  
    `;

    // Obtenemos sus ids
    const form = container.querySelector('#loginForm');
    const error = container.querySelector('#error');

    // Pide los datos y los valida con la funcion de login de ./auth.js
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.email.value.trim();
        const password = form.password.value.trim();

        try{
            const success = await login(email, password);
            if(success){
                const user = JSON.parse(localStorage.getItem('user')); // Dependiendo del rol muestra el dashboard o la vista para el publico 
                window.location.hash = user.role === 'admin' ? '#/dashboard' : '#/public'
            }
        } catch (err) {
            error.textContent = err.message;
        }
});
    return container
};