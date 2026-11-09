const API_BASE_URL = 'http://localhost:3200/api';

document.addEventListener('DOMContentLoaded', () => {
  
  // -------------------------------------------------------------
  // 1. LÓGICA PARA REGISTRO (register.html)
  // -------------------------------------------------------------
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        birthDate: document.getElementById('birthDate').value
      };

      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
          alert('¡Usuario registrado con éxito!');
          window.location.href = 'login.html';
        } else {
          alert(`Error: ${data.message || 'No se pudo completar el registro'}`);
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
        alert('No se pudo conectar con el servidor.');
      }
    });
  }

  // -------------------------------------------------------------
  // 2. LÓGICA PARA LOGIN (login.html)
  // -------------------------------------------------------------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const credentials = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      };

      try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (response.ok) {
          // Guardar token JWT y datos del usuario en el navegador
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          alert('¡Inicio de sesión exitoso!');
          window.location.href = 'dashboard.html';
        } else {
          alert(`Error: ${data.message || 'Credenciales incorrectas'}`);
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
        alert('No se pudo conectar con el servidor.');
      }
    });
  }

});