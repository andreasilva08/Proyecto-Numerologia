document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const API_BASE_URL = 'http://localhost:3200/api';

  // 1. VALIDACIÓN DE SESIÓN Y BIENVENIDA
  if (!token || token === 'null' || token === 'undefined') {
    alert('Acceso no autorizado. Por favor inicia sesión.');
    localStorage.clear();
    window.location.href = 'login.html';
    return;
  }

  const nombreUser = user?.firstName || user?.nombre || user?.nombreCompleto || 'Viajero Cósmico';
  document.getElementById('welcomeUser').textContent = `¡Hola, ${nombreUser}! 👋`;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'login.html';
    });
  }

  const handleAuthError = (status) => {
    if (status === 401) {
      alert('Tu sesión ha expirado.');
      localStorage.clear();
      window.location.href = 'login.html';
      return true;
    }
    return false;
  };

  // -------------------------------------------------------------
  // 2. TARJETA DE PERFIL + HORÓSCOPO ASTRAL (LOCAL)
  // -------------------------------------------------------------
  const renderUserProfileCard = () => {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const zodiacSign = document.getElementById('zodiacSign');
    const zodiacElement = document.getElementById('zodiacElement');
    const zodiacSymbol = document.getElementById('zodiacSymbol');
    const zodiacHoroscope = document.getElementById('zodiacHoroscope');

    if (profileName) profileName.textContent = nombreUser;
    if (profileEmail) profileEmail.textContent = user?.email || user?.correo || 'Sin correo registrado';

    // Fecha de nacimiento guardada en sesión (o una por defecto)
    const birthDateStr = user?.fechaNacimiento || user?.birthDate || user?.createdAt || '2000-03-21';
    const birthDate = new Date(birthDateStr);
    const day = birthDate.getUTCDate();
    const month = birthDate.getUTCMonth() + 1; // 1-12

    // Cálculo de Signo Zodiacal, Elemento y Predicción
    const infoZodiacal = obtenerInfoZodiacal(day, month);

    if (zodiacSign) zodiacSign.textContent = infoZodiacal.signo;
    if (zodiacElement) zodiacElement.textContent = infoZodiacal.elemento;
    if (zodiacSymbol) zodiacSymbol.textContent = infoZodiacal.simbolo;
    if (zodiacHoroscope) zodiacHoroscope.textContent = infoZodiacal.horoscopo;
  };

  // Lógica astronómica y horóscopo
  function obtenerInfoZodiacal(dia, mes) {
    if ((mes == 3 && dia >= 21) || (mes == 4 && dia <= 19)) {
      return { signo: "Aries", simbolo: "♈", elemento: "Fuego 🔥", horoscopo: "Tu impulso natural abre caminos hoy. Canaliza tu energía con paciencia." };
    } else if ((mes == 4 && dia >= 20) || (mes == 5 && dia <= 20)) {
      return { signo: "Tauro", simbolo: "♉", elemento: "Tierra 🌿", horoscopo: "Momento ideal para afianzar proyectos y buscar estabilidad emocional." };
    } else if ((mes == 5 && dia >= 21) || (mes == 6 && dia <= 20)) {
      return { signo: "Géminis", simbolo: "♊", elemento: "Aire 💨", horoscopo: "La comunicación fluirá a tu favor. Comparte tus ideas sin temor." };
    } else if ((mes == 6 && dia >= 21) || (mes == 7 && dia <= 22)) {
      return { signo: "Cáncer", simbolo: "♋", elemento: "Agua 🌊", horoscopo: "Escucha tu intuición. Tu sensibilidad es tu mayor fortaleza hoy." };
    } else if ((mes == 7 && dia >= 23) || (mes == 8 && dia <= 22)) {
      return { signo: "Leo", simbolo: "♌", elemento: "Fuego 🔥", horoscopo: "Tu brillo personal destacará. Lidera con empatía y generosidad." };
    } else if ((mes == 8 && dia >= 23) || (mes == 9 && dia <= 22)) {
      return { signo: "Virgo", simbolo: "♍", elemento: "Tierra 🌿", horoscopo: "Un día excelente para organizar tus metas y priorizar tu bienestar." };
    } else if ((mes == 9 && dia >= 23) || (mes == 10 && dia <= 22)) {
      return { signo: "Libra", simbolo: "♎", elemento: "Aire 💨", horoscopo: "Busca la armonía en tus relaciones. Toma decisiones desde la paz." };
    } else if ((mes == 10 && dia >= 23) || (mes == 11 && dia <= 21)) {
      return { signo: "Escorpio", simbolo: "♏", elemento: "Agua 🌊", horoscopo: "Transformación profunda en marcha. Confía en los giros del destino." };
    } else if ((mes == 11 && dia >= 22) || (mes == 12 && dia <= 21)) {
      return { signo: "Sagitario", simbolo: "♐", elemento: "Fuego 🔥", horoscopo: "Nuevas perspectivas se abren ante ti. Mantén el optimismo." };
    } else if ((mes == 12 && dia >= 22) || (mes == 1 && dia <= 19)) {
      return { signo: "Capricornio", simbolo: "♑", elemento: "Tierra 🌿", horoscopo: "La disciplina dará frutos pronto. Sigue construyendo tu futuro." };
    } else if ((mes == 1 && dia >= 20) || (mes == 2 && dia <= 18)) {
      return { signo: "Acuario", simbolo: "♒", elemento: "Aire 💨", horoscopo: "Tu visión innovadora inspirará a quienes te rodean. Crea libremente." };
    } else {
      return { signo: "Piscis", simbolo: "♓", elemento: "Agua 🌊", horoscopo: "Conecta con tus sueños y arte. El universo guía tus pasos." };
    }
  }

  // Ejecutar renderizado de tarjeta perfil
  renderUserProfileCard();

  // -------------------------------------------------------------
  // 3. CONSULTAR PERFIL NUMEROLÓGICO (BACKEND)
  // -------------------------------------------------------------
  const btnCalculateProfile = document.getElementById('btnCalculateProfile');
  const profileResultsView = document.getElementById('profileResultsView');
  const numLifePath = document.getElementById('numLifePath');
  const numMeaningText = document.getElementById('numMeaningText');

  if (btnCalculateProfile) {
    btnCalculateProfile.addEventListener('click', async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/numerology-profiles`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token
          }
        });

        if (handleAuthError(response.status)) return;

        const data = await response.json();

        if (response.ok) {
          const profile = Array.isArray(data) ? data[0] : (data.perfil || data.perfiles?.[0] || data);
          const lifePath = profile?.lifePathNumber || profile?.lifePath || profile?.caminoDeVida || profile?.numeroVida || '7';

          numLifePath.textContent = lifePath;
          if (numMeaningText) {
            numMeaningText.textContent = `Tu camino está marcado por la vibración del número ${lifePath}, orientado a potenciar tus virtudes.`;
          }
          if (profileResultsView) profileResultsView.style.display = 'block';
        } else {
          alert(`Mensaje del servidor: ${data.mensaje || data.message || 'Sin perfil previo.'}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión al servidor.');
      }
    });
  }

  // 5. OBTENER LECTURA NUMEROLÓGICA DEL DÍA
  const btnGetReading = document.getElementById('btnGetReading');
  const dailyReadingText = document.getElementById('dailyReadingText');

  if (btnGetReading) {
    btnGetReading.addEventListener('click', async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/readings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token
          }
        });

        if (handleAuthError(response.status)) return;

        const data = await response.json();

        if (response.ok) {
          let textoLectura = '';
          if (Array.isArray(data)) {
            textoLectura = data[0]?.content || data[0]?.message || data[0]?.mensaje || data[0]?.descripcion;
          } else {
            textoLectura = data.content || data.message || data.mensaje || data.descripcion || data.reading?.content;
          }

          dailyReadingText.textContent = textoLectura || 'Las energías de hoy te aconsejan mantener la calma, enfocar tu atención en tus prioridades y confiar en tus decisiones.';
        } else {
          alert(`Error al cargar lectura: ${data.mensaje || data.message || data.msg || 'Inténtalo más tarde.'}`);
        }
      } catch (error) {
        console.error('Error al obtener lectura:', error);
        alert('Error de conexión al obtener la lectura diaria.');
      }
    });
  }
});