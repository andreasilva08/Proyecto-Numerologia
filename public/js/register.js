const registerForm = document.getElementById('registerForm');

// Si usas Live Server mantén la URL completa. Si abres desde localhost:3200 puedes dejar solo '/api/users'
const API_URL = 'http://localhost:3200/api/users';

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
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {
      alert('¡Usuario registrado con éxito!');
      window.location.href = 'login.html';
    } else {
      console.log('Respuesta del backend con error:', data);
      alert(`Error al registrar: ${data.message || JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error('Error detallado de la petición:', error);
    alert('No se pudo conectar con el servidor.');
  }
});