const loginForm = document.getElementById('loginForm');

const API_URL = 'http://localhost:3200/api/users/login';

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const credentials = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (response.ok) {
      // Guardar el Token JWT y datos del usuario en el localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert('¡Inicio de sesión exitoso!');
      window.location.href = 'dashboard.html'; // Redirige al panel principal
    } else {
      alert(`Error: ${data.message || 'Credenciales incorrectas'}`);
    }
  } catch (error) {
    console.error('Error de red:', error);
    alert('No se pudo conectar con el servidor.');
  }
});