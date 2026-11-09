/**
 * ==============================================================================
 * DASHBOARD CÓSMICO - NUMEROLOGY MASTER
 * Conexión Frontend (Live Server 5500 / Localhost) con Backend Express (Puerto 3200)
 * ==============================================================================
 */

// 1. CONFIGURACIÓN GLOBAL DE LA URL DE LA API
const BACKEND_PORT = 3200;
const API_BASE_URL = window.location.origin.includes(`:${BACKEND_PORT}`)
  ? `${window.location.origin}/api`
  : `http://localhost:${BACKEND_PORT}/api`;

window.API_BASE_URL = API_BASE_URL;

document.addEventListener('DOMContentLoaded', async () => {
  // 2. VALIDACIÓN DE SESIÓN Y TOKEN
  const token = localStorage.getItem('token');
  let user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || token === 'null' || token === 'undefined') {
    alert('Acceso no autorizado. Por favor inicia sesión primero.');
    localStorage.clear();
    window.location.href = 'login.html';
    return;
  }

  // Helper para generar cabeceras autenticadas en cada fetch
  const getAuthHeaders = () => {
    const currentToken = localStorage.getItem('token') || '';
    return {
      'Content-Type': 'application/json',
      'x-token': currentToken,
      'Authorization': `Bearer ${currentToken}`
    };
  };

  // Manejo centralizado de expiración de sesión (401)
  const handleAuthError = (status) => {
    if (status === 401) {
      console.error('[Auth Error 401]: Token expirado o inválido.');
      alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      localStorage.clear();
      window.location.href = 'login.html';
      return true;
    }
    return false;
  };

  // ===========================================================================
  // 3. REFERENCIAS AL DOM
  // ===========================================================================
  const welcomeUser = document.getElementById('welcomeUser');
  const logoutBtn = document.getElementById('logoutBtn');
  const refreshDataBtn = document.getElementById('refreshDataBtn');
  const editProfileBtn = document.getElementById('editProfileBtn');
  const profileEditModal = document.getElementById('profileEditModal');
  const profileEditForm = document.getElementById('profileEditForm');
  const editFirstName = document.getElementById('editFirstName');
  const editLastName = document.getElementById('editLastName');
  const editBirthDay = document.getElementById('editBirthDay');
  const editBirthMonth = document.getElementById('editBirthMonth');
  const editBirthYear = document.getElementById('editBirthYear');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const pinaculosFecha = document.getElementById('pinaculosFecha');
  const matrizNombre = document.getElementById('matrizNombre');
  const herenciaApellidos = document.getElementById('herenciaApellidos');
  const compatibilidadFecha1 = document.getElementById('compatibilidadFecha1');

  // Perfil
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileRoleBadge = document.getElementById('profileRoleBadge');
  const zodiacSign = document.getElementById('zodiacSign');
  const zodiacElement = document.getElementById('zodiacElement');
  const zodiacSymbol = document.getElementById('zodiacSymbol');
  const zodiacHoroscope = document.getElementById('zodiacHoroscope');
  const birthDateDisplay = document.getElementById('birthDateDisplay');
  const birthDateText = document.getElementById('birthDateText');

  const toastRegion = document.createElement('div');
  toastRegion.className = 'fixed top-4 right-4 z-[60] flex flex-col gap-2';
  toastRegion.setAttribute('role', 'status');
  toastRegion.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastRegion);

  const mostrarToast = (mensaje, tipo = 'success') => {
    const toast = document.createElement('div');
    toast.className = `max-w-sm rounded-xl border px-4 py-3 text-sm shadow-xl opacity-0 transition-opacity duration-300 ${
      tipo === 'error'
        ? 'border-red-400/40 bg-slate-950 text-red-200'
        : 'border-[rgba(226,183,97,0.4)] bg-slate-950 text-mystic-gold-light'
    }`;
    toast.textContent = mensaje;
    toastRegion.appendChild(toast);
    requestAnimationFrame(() => toast.classList.replace('opacity-0', 'opacity-100'));
    window.setTimeout(() => {
      toast.classList.replace('opacity-100', 'opacity-0');
      window.setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  const cambiarVisibilidadSuave = (element, visible) => {
    if (!element) return;
    if (visible) {
      element.classList.remove('hidden');
      element.classList.add('opacity-0');
      requestAnimationFrame(() => element.classList.replace('opacity-0', 'opacity-100'));
      return;
    }

    element.classList.remove('opacity-100');
    element.classList.add('opacity-0');
    window.setTimeout(() => {
      if (element.classList.contains('opacity-0')) element.classList.add('hidden');
    }, 300);
  };

  // Desglose del Sendero Natal
  const desgloseVidaContainer = document.getElementById('desgloseVidaContainer');
  const desgloseVidaTiles = document.getElementById('desgloseVidaTiles');

  // Mini Badges
  const quickLifePath = document.getElementById('quickLifePath');
  const quickPersonalYear = document.getElementById('quickPersonalYear');
  const quickExpression = document.getElementById('quickExpression');

  // Formulario Expresión
  const formExpresion = document.getElementById('formExpresion');
  const inputNombreCompleto = document.getElementById('inputNombreCompleto');
  const charCountExp = document.getElementById('charCountExp');
  const btnExpText = document.getElementById('btnExpText');
  const btnExpSpinner = document.getElementById('btnExpSpinner');
  const resultadoExpresionContainer = document.getElementById('resultadoExpresionContainer');
  const orbNumeroExpresion = document.getElementById('orbNumeroExpresion');
  const arquetipoExpresion = document.getElementById('arquetipoExpresion');
  const badgeMaestroExpresion = document.getElementById('badgeMaestroExpresion');
  const descripcionExpresion = document.getElementById('descripcionExpresion');
  const palabrasClaveContainer = document.getElementById('palabrasClaveContainer');
  const toggleDesgloseBtn = document.getElementById('toggleDesgloseBtn');
  const desgloseLetrasContainer = document.getElementById('desgloseLetrasContainer');

  // Formulario Año Personal
  const formAnioPersonal = document.getElementById('formAnioPersonal');
  const inputDiaNacimiento = document.getElementById('inputDiaNacimiento');
  const inputMesNacimiento = document.getElementById('inputMesNacimiento');
  const btnAnioText = document.getElementById('btnAnioText');
  const btnAnioSpinner = document.getElementById('btnAnioSpinner');
  const resultadoAnioPersonalContainer = document.getElementById('resultadoAnioPersonalContainer');
  const orbNumeroAnioPersonal = document.getElementById('orbNumeroAnioPersonal');
  const etapaAnioPersonal = document.getElementById('etapaAnioPersonal');
  const badgeMaestroAnio = document.getElementById('badgeMaestroAnio');
  const formulaPasoAPaso = document.getElementById('formulaPasoAPaso');
  const enfoqueAnioPersonal = document.getElementById('enfoqueAnioPersonal');
  const descripcionAnioPersonal = document.getElementById('descripcionAnioPersonal');
  const consejoAnioPersonal = document.getElementById('consejoAnioPersonal');

  // Formulario Alma (Vocales)
  const formAlma = document.getElementById('formAlma');
  const inputNombreAlma = document.getElementById('inputNombreAlma');
  const btnAlmaText = document.getElementById('btnAlmaText');
  const btnAlmaSpinner = document.getElementById('btnAlmaSpinner');
  const resultadoAlmaContainer = document.getElementById('resultadoAlmaContainer');
  const orbNumeroAlma = document.getElementById('orbNumeroAlma');
  const arquetipoAlma = document.getElementById('arquetipoAlma');
  const badgeMaestroAlma = document.getElementById('badgeMaestroAlma');
  const descripcionAlma = document.getElementById('descripcionAlma');
  const palabrasClaveAlmaContainer = document.getElementById('palabrasClaveAlmaContainer');
  const desgloseVocalesContainer = document.getElementById('desgloseVocalesContainer');

  // Formulario Personalidad (Consonantes)
  const formPersonalidad = document.getElementById('formPersonalidad');
  const inputNombrePersonalidad = document.getElementById('inputNombrePersonalidad');
  const btnPersonalidadText = document.getElementById('btnPersonalidadText');
  const btnPersonalidadSpinner = document.getElementById('btnPersonalidadSpinner');
  const resultadoPersonalidadContainer = document.getElementById('resultadoPersonalidadContainer');
  const orbNumeroPersonalidad = document.getElementById('orbNumeroPersonalidad');
  const arquetipoPersonalidad = document.getElementById('arquetipoPersonalidad');
  const badgeMaestroPersonalidad = document.getElementById('badgeMaestroPersonalidad');
  const descripcionPersonalidad = document.getElementById('descripcionPersonalidad');
  const palabrasClavePersonalidadContainer = document.getElementById('palabrasClavePersonalidadContainer');
  const desgloseConsonantesContainer = document.getElementById('desgloseConsonantesContainer');

  // Lectura Gemini IA
  const btnGetReading = document.getElementById('btnGetReading');
  const btnReadingText = document.getElementById('btnReadingText');
  const btnReadingSpinner = document.getElementById('btnReadingSpinner');
  const btnReadingIcon = document.getElementById('btnReadingIcon');
  const readingLoadingState = document.getElementById('readingLoadingState');
  const readingPlaceholderState = document.getElementById('readingPlaceholderState');
  const readingResultContainer = document.getElementById('readingResultContainer');
  const readingOriginBadge = document.getElementById('readingOriginBadge');
  const readingModelTag = document.getElementById('readingModelTag');
  const readingTokensTag = document.getElementById('readingTokensTag');
  const readingResumenText = document.getElementById('readingResumenText');
  const readingVidaText = document.getElementById('readingVidaText');
  const readingDestacadoOrb = document.getElementById('readingDestacadoOrb');
  const readingFortalezasList = document.getElementById('readingFortalezasList');
  const readingAreasList = document.getElementById('readingAreasList');

  // ===========================================================================
  // 4. FUNCIONES AUXILIARES NUMEROLÓGICAS Y ASTROLÓGICAS
  // ===========================================================================

  /** Reduce un número respetando los Números Maestros 11, 22, 33 */
  const reducirNumeroLocal = (n, permitirMaestros = true) => {
    let num = parseInt(n, 10);
    if (isNaN(num) || num <= 0) return 0;
    while (num > 9) {
      if (permitirMaestros && (num === 11 || num === 22 || num === 33)) break;
      num = num.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0);
    }
    return num;
  };

  /**
   * Calcula el Camino de Vida y retorna también el desglose paso a paso.
   * @param {string} fechaStr - ISO date string
   * @returns {{ numero: number|null, desglose: Object|null }}
   */
  const calcularCaminoDeVidaDetallado = (fechaStr) => {
    if (!fechaStr) return { numero: null, desglose: null };
    const f = new Date(fechaStr);
    if (isNaN(f.getTime())) return { numero: null, desglose: null };

    const d = f.getUTCDate();
    const m = f.getUTCMonth() + 1;
    const y = f.getUTCFullYear();

    const diaRed = reducirNumeroLocal(d, false);
    const mesRed = reducirNumeroLocal(m, false);
    const anioRed = reducirNumeroLocal(y, false);
    const suma = diaRed + mesRed + anioRed;
    const numero = reducirNumeroLocal(suma, true);

    return {
      numero,
      desglose: {
        dia: d, diaRed,
        mes: m, mesRed,
        anio: y, anioRed,
        suma, numero
      }
    };
  };

  /** Renderiza el desglose del Sendero Natal en tiles visuales */
  const renderizarDesgloseVida = (desglose) => {
    if (!desglose || !desgloseVidaTiles) return;

    const { dia, diaRed, mes, mesRed, anio, anioRed, suma, numero } = desglose;
    const esMaestro = numero === 11 || numero === 22 || numero === 33;

    desgloseVidaTiles.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 text-sm font-mono">
        <div class="flex flex-col items-center bg-[rgba(226,183,97,0.08)] border border-[rgba(226,183,97,0.2)] rounded-lg px-3 py-2 min-w-[72px] text-center">
          <span class="text-[15px] text-[#94a1b2] uppercase tracking-wider">Día</span>
          <span class="text-base font-serif text-mystic-gold-light">${dia}</span>
          <span class="text-[15px] text-[#94a1b2]">→ <strong class="text-mystic-gold">${diaRed}</strong></span>
        </div>
        <span class="text-mystic-gold text-xl">+</span>
        <div class="flex flex-col items-center bg-[rgba(226,183,97,0.08)] border border-[rgba(226,183,97,0.2)] rounded-lg px-3 py-2 min-w-[72px] text-center">
          <span class="text-[15px] text-[#94a1b2] uppercase tracking-wider">Mes</span>
          <span class="text-base font-serif text-mystic-gold-light">${mes}</span>
          <span class="text-[15px] text-[#94a1b2]">→ <strong class="text-mystic-gold">${mesRed}</strong></span>
        </div>
        <span class="text-mystic-gold text-xl">+</span>
        <div class="flex flex-col items-center bg-[rgba(226,183,97,0.08)] border border-[rgba(226,183,97,0.2)] rounded-lg px-3 py-2 min-w-[80px] text-center">
          <span class="text-[15px] text-[#94a1b2] uppercase tracking-wider">Año</span>
          <span class="text-base font-serif text-mystic-gold-light">${anio}</span>
          <span class="text-[15px] text-[#94a1b2]">→ <strong class="text-mystic-gold">${anioRed}</strong></span>
        </div>
        <span class="text-mystic-gold text-xl">=</span>
        <div class="flex flex-col items-center bg-[rgba(226,183,97,0.12)] border border-[rgba(226,183,97,0.3)] rounded-lg px-3 py-2 min-w-[72px] text-center">
          <span class="text-[15px] text-[#94a1b2] uppercase tracking-wider">Suma</span>
          <span class="text-base font-serif text-mystic-gold-light">${suma}</span>
        </div>
        <span class="text-mystic-gold text-xl">→</span>
        <div class="flex flex-col items-center ${esMaestro ? 'bg-[rgba(123,44,191,0.2)] border-purple-400' : 'bg-[rgba(226,183,97,0.15)] border-mystic-gold'} border-2 rounded-xl px-4 py-2 min-w-[72px] text-center shadow-[0_0_12px_rgba(226,183,97,0.2)]">
          <span class="text-[15px] ${esMaestro ? 'text-purple-300' : 'text-mystic-gold'} uppercase tracking-wider font-bold">${esMaestro ? '✦ Maestro' : 'Camino'}</span>
          <span class="text-2xl font-serif ${esMaestro ? 'text-purple-200' : 'text-mystic-gold'} font-bold">${numero}</span>
        </div>
      </div>
    `;

    desgloseVidaContainer.classList.remove('hidden');
  };

  const obtenerInfoZodiacal = (dia, mes) => {
    if (!dia || !mes) {
      return {
        signo: '--', simbolo: '✨', elemento: '--',
        horoscopo: 'Aún no has registrado tu fecha de nacimiento. Puedes ingresar tus datos en el widget de Año Personal para calcular tus ciclos.'
      };
    }
    if ((mes == 3 && dia >= 21) || (mes == 4 && dia <= 19)) return { signo: "Aries", simbolo: "♈", elemento: "Fuego 🔥", horoscopo: "Tu impulso natural abre caminos hoy. Canaliza tu energía con paciencia y visión estratégica." };
    if ((mes == 4 && dia >= 20) || (mes == 5 && dia <= 20)) return { signo: "Tauro", simbolo: "♉", elemento: "Tierra 🌿", horoscopo: "Momento ideal para afianzar tus proyectos y buscar estabilidad emocional y financiera." };
    if ((mes == 5 && dia >= 21) || (mes == 6 && dia <= 20)) return { signo: "Géminis", simbolo: "♊", elemento: "Aire 💨", horoscopo: "La comunicación fluirá con carisma. Comparte tus ideas y expande tus horizontes." };
    if ((mes == 6 && dia >= 21) || (mes == 7 && dia <= 22)) return { signo: "Cáncer", simbolo: "♋", elemento: "Agua 🌊", horoscopo: "Escucha tu intuición más profunda. Tu sensibilidad es tu mayor escudo hoy." };
    if ((mes == 7 && dia >= 23) || (mes == 8 && dia <= 22)) return { signo: "Leo", simbolo: "♌", elemento: "Fuego 🔥", horoscopo: "Tu resplandor personal inspirará a otros. Lidera con generosidad y nobles convicciones." };
    if ((mes == 8 && dia >= 23) || (mes == 9 && dia <= 22)) return { signo: "Virgo", simbolo: "♍", elemento: "Tierra 🌿", horoscopo: "Excelente jornada para organizar detalles, cuidar tu salud y dar orden a tu vida." };
    if ((mes == 9 && dia >= 23) || (mes == 10 && dia <= 22)) return { signo: "Libra", simbolo: "♎", elemento: "Aire 💨", horoscopo: "Busca la armonía en cada interacción. El equilibrio interior atraerá bendiciones." };
    if ((mes == 10 && dia >= 23) || (mes == 11 && dia <= 21)) return { signo: "Escorpio", simbolo: "♏", elemento: "Agua 🌊", horoscopo: "Transformación y renacimiento interno. Despídete de lo viejo para abrazar lo nuevo." };
    if ((mes == 11 && dia >= 22) || (mes == 12 && dia <= 21)) return { signo: "Sagitario", simbolo: "♐", elemento: "Fuego 🔥", horoscopo: "Nuevas aventuras y aprendizajes en el horizonte. Mantén viva tu fe y optimismo." };
    if ((mes == 12 && dia >= 22) || (mes == 1 && dia <= 19)) return { signo: "Capricornio", simbolo: "♑", elemento: "Tierra 🌿", horoscopo: "La perseverancia disciplinada rendirá frutos cuantiosos. Prosigue con determinación." };
    if ((mes == 1 && dia >= 20) || (mes == 2 && dia <= 18)) return { signo: "Acuario", simbolo: "♒", elemento: "Aire 💨", horoscopo: "Tu originalidad rompe barreras convencionales. Confía en tus revelaciones visionarias." };
    return { signo: "Piscis", simbolo: "♓", elemento: "Agua 🌊", horoscopo: "Conecta con tu lado espiritual y artístico. El universo sincroniza sus señales contigo." };
  };

  /** Formatea una fecha ISO a dd/mm/aaaa */
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return null;
    const f = new Date(fechaStr);
    if (isNaN(f.getTime())) return null;
    const d = String(f.getUTCDate()).padStart(2, '0');
    const m = String(f.getUTCMonth() + 1).padStart(2, '0');
    const y = f.getUTCFullYear();
    return `${d}/${m}/${y}`;
  };

  const formatearFechaISO = (fecha) => {
    if (!fecha || Number.isNaN(fecha.getTime())) return '';
    return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}-${String(fecha.getUTCDate()).padStart(2, '0')}`;
  };

  const obtenerFechaEditadaISO = () => {
    const dia = Number(editBirthDay.value);
    const mes = Number(editBirthMonth.value);
    const anio = Number(editBirthYear.value);
    const fecha = new Date(0);
    fecha.setUTCHours(0, 0, 0, 0);
    fecha.setUTCFullYear(anio, mes - 1, dia);
    const esFechaValida = Number.isInteger(dia) && Number.isInteger(mes) && Number.isInteger(anio) &&
      dia >= 1 && mes >= 1 && mes <= 12 && anio >= 1 &&
      fecha.getUTCDate() === dia && fecha.getUTCMonth() + 1 === mes && fecha.getUTCFullYear() === anio &&
      fecha.getTime() <= Date.now();

    if (!esFechaValida) {
      throw new Error('Ingresa una fecha de nacimiento válida que no sea futura.');
    }
    return formatearFechaISO(fecha);
  };

  // ===========================================================================
  // 5. CARGA DEL PERFIL DEL USUARIO DESDE MONGODB
  // ===========================================================================
  const cargarPerfilUsuario = async ({ exigirActualizacion = false } = {}) => {
    const userId = user._id || user.id;
    if (!userId && exigirActualizacion) {
      throw new Error('No se encontró el identificador de usuario para sincronizar el perfil.');
    }
    if (userId) {
      try {
        const resUser = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: 'GET',
          headers: getAuthHeaders()
        });
        if (!resUser.ok) {
          if (handleAuthError(resUser.status)) {
            throw new Error('La sesión expiró. Inicia sesión nuevamente.');
          }
          if (exigirActualizacion) {
            throw new Error(`No se pudo actualizar el perfil (${resUser.status}).`);
          }
          console.warn(`[User Fetch Status ${resUser.status}]: Usando datos de sesión local.`);
        } else {
          const freshUser = await resUser.json();
          user = { ...user, ...freshUser };
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (err) {
        if (exigirActualizacion) throw err;
        console.warn('[User Fetch Network Error]:', err.message);
      }
    }

    // Nombre y correo
    const nombreUsuario = user.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : (user.nombre || user.nombreCompleto || 'Consultante');

    welcomeUser.textContent = `¡Bienvenido, ${nombreUsuario}! 🪐`;
    profileName.textContent = nombreUsuario;
    profileEmail.textContent = user.email || 'correo@desconocido.com';
    if (profileRoleBadge && user.role) {
      profileRoleBadge.textContent = user.role === 'admin' ? 'Administrador' : 'Consultante';
    }

    // Pre-rellenar inputs de expresión con el nombre
    if (inputNombreCompleto) {
      inputNombreCompleto.value = nombreUsuario;
      if (charCountExp) charCountExp.textContent = `${nombreUsuario.length}/100`;
    }
    // Pre-rellenar inputs de alma y personalidad con el nombre
    if (inputNombreAlma) inputNombreAlma.value = nombreUsuario;
    if (inputNombrePersonalidad) inputNombrePersonalidad.value = nombreUsuario;

    // Fecha de nacimiento real desde MongoDB
    const fechaReal = user.birthDate || user.fechaNacimiento;

    if (fechaReal) {
      const fechaFormateada = formatearFecha(fechaReal);
      if (fechaFormateada && birthDateText && birthDateDisplay) {
        birthDateText.textContent = fechaFormateada;
        birthDateDisplay.classList.remove('hidden');
      }

      const fNac = new Date(fechaReal);
      if (!isNaN(fNac.getTime())) {
        const diaReal = fNac.getUTCDate();
        const mesReal = fNac.getUTCMonth() + 1;

        // Signo y elemento reales
        const infoZ = obtenerInfoZodiacal(diaReal, mesReal);
        zodiacSign.textContent = infoZ.signo;
        zodiacElement.textContent = infoZ.elemento;
        zodiacSymbol.textContent = infoZ.simbolo;
        zodiacHoroscope.textContent = infoZ.horoscopo;

        // Camino de vida con desglose
        const { numero, desglose } = calcularCaminoDeVidaDetallado(fechaReal);
        if (numero !== null) {
          quickLifePath.textContent = numero;
          renderizarDesgloseVida(desglose);
        }

        // Pre-rellenar Año Personal con los datos reales (SIN ejecutar el cálculo)
        // El usuario debe hacer clic manualmente
        if (inputDiaNacimiento) inputDiaNacimiento.value = diaReal;
        if (inputMesNacimiento) inputMesNacimiento.value = mesReal;
      } else {
        mostrarValoresSinFecha();
      }
    } else {
      mostrarValoresSinFecha();
    }

    if (editFirstName) editFirstName.value = user.firstName || '';
    if (editLastName) editLastName.value = user.lastName || '';
    if (editBirthDay && editBirthMonth && editBirthYear) {
      const fecha = fechaReal ? new Date(fechaReal) : null;
      editBirthDay.value = fecha && !isNaN(fecha.getTime()) ? fecha.getUTCDate() : '';
      editBirthMonth.value = fecha && !isNaN(fecha.getTime()) ? fecha.getUTCMonth() + 1 : '';
      editBirthYear.value = fecha && !isNaN(fecha.getTime()) ? fecha.getUTCFullYear() : '';
    }

    const fechaISO = fechaReal ? new Date(fechaReal) : null;
    const fechaNacimientoISO = fechaISO && !isNaN(fechaISO.getTime())
      ? `${fechaISO.getUTCFullYear()}-${String(fechaISO.getUTCMonth() + 1).padStart(2, '0')}-${String(fechaISO.getUTCDate()).padStart(2, '0')}`
      : '';
    if (pinaculosFecha) pinaculosFecha.value = fechaNacimientoISO;
    if (compatibilidadFecha1) compatibilidadFecha1.value = fechaNacimientoISO;
    if (matrizNombre) matrizNombre.value = nombreUsuario;
    if (herenciaApellidos) herenciaApellidos.value = user.lastName || '';
  };

  const mostrarValoresSinFecha = () => {
    quickLifePath.textContent = '--';
    quickPersonalYear.textContent = '--';
    zodiacSign.textContent = '--';
    zodiacElement.textContent = '--';
    zodiacSymbol.textContent = '✨';
    zodiacHoroscope.textContent = 'Fecha de nacimiento no registrada. Ingresa tus datos en el widget de Año Personal para comenzar.';
    desgloseVidaContainer.classList.add('hidden');
  };

  // ===========================================================================
  // 6. CONTADOR DE CARACTERES EN INPUT DE EXPRESIÓN
  // ===========================================================================
  if (inputNombreCompleto && charCountExp) {
    inputNombreCompleto.addEventListener('input', () => {
      charCountExp.textContent = `${inputNombreCompleto.value.length}/100`;
    });
  }

  // ===========================================================================
  // 7. EVENTO: CÁLCULO DE EXPRESIÓN (NOMBRE A NÚMERO)
  // ===========================================================================
  const calcularYRenderizarExpresion = async (nombreAEnviar) => {
    const response = await fetch(`${API_BASE_URL}/v1/numerologia/expresion`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ nombreCompleto: nombreAEnviar })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (handleAuthError(response.status)) throw new Error('La sesión expiró.');
      const errores = Array.isArray(errorData.errores)
        ? errorData.errores.map((error) => error.mensaje).filter(Boolean).join(' ')
        : '';
      throw new Error(errores || errorData.message || `Error al calcular la expresión (${response.status}).`);
    }

    const result = await response.json();
    if (result.status !== 'success' || !result.data) {
      throw new Error(result.message || 'El servidor no devolvió el resultado de expresión.');
    }

    const data = result.data;
    orbNumeroExpresion.textContent = data.numeroExpresion;
    quickExpression.textContent = data.numeroExpresion;
    arquetipoExpresion.textContent = data.interpretacion?.arquetipo || `Vibración ${data.numeroExpresion}`;
    descripcionExpresion.textContent = data.interpretacion?.descripcion || 'Interpretación numérica calculada.';
    badgeMaestroExpresion.classList.toggle('hidden', !data.esNumeroMaestro);

    palabrasClaveContainer.replaceChildren();
    (data.interpretacion?.palabrasClave || []).forEach((palabra) => {
      const span = document.createElement('span');
      span.className = 'badge-gold text-[10px]';
      span.textContent = `✦ ${palabra}`;
      palabrasClaveContainer.appendChild(span);
    });

    desgloseLetrasContainer.replaceChildren();
    (data.desglose || []).forEach((item) => {
      const tile = document.createElement('div');
      tile.className = 'tile-breakdown';
      const letter = document.createElement('span');
      letter.className = 'tile-letter';
      letter.textContent = item.caracter;
      const value = document.createElement('span');
      value.className = 'tile-value';
      value.textContent = item.valor;
      tile.append(letter, value);
      desgloseLetrasContainer.appendChild(tile);
    });

    resultadoExpresionContainer.classList.remove('hidden');
    return data;
  };

  formExpresion.addEventListener('submit', async (event) => {
    event.preventDefault();
    const nombreAEnviar = inputNombreCompleto.value.trim();
    if (!nombreAEnviar) {
      mostrarToast('Por favor digita un nombre completo.', 'error');
      return;
    }

    const btnCalcularExpresion = document.getElementById('btnCalcularExpresion');
    btnCalcularExpresion.disabled = true;
    btnExpText.textContent = 'Calculando...';
    btnExpSpinner.classList.remove('hidden');

    try {
      await calcularYRenderizarExpresion(nombreAEnviar);
    } catch (error) {
      console.error('[Error en /v1/numerologia/expresion]:', error);
      mostrarToast(error.message || `Error de conexión con ${API_BASE_URL}.`, 'error');
    } finally {
      btnCalcularExpresion.disabled = false;
      btnExpText.textContent = 'Calcular Número de Expresión';
      btnExpSpinner.classList.add('hidden');
    }
  });

  // Toggle desglose de letras
  if (toggleDesgloseBtn) {
    toggleDesgloseBtn.addEventListener('click', () => {
      const isHidden = desgloseLetrasContainer.classList.contains('hidden');
      desgloseLetrasContainer.classList.toggle('hidden', !isHidden);
      toggleDesgloseBtn.innerHTML = isHidden
        ? '<span>Ocultar desglose letra por letra</span> ▲'
        : '<span>Ver desglose letra por letra</span> ▼';
    });
  }

  // ===========================================================================
  // 8. EVENTO: CÁLCULO DE AÑO PERSONAL (solo cuando el usuario hace clic)
  // ===========================================================================
  const ejecutarCalculoAnioPersonal = async (dia, mes) => {
    const diaNum = parseInt(dia, 10);
    const mesNum = parseInt(mes, 10);
    if (!diaNum || !mesNum || isNaN(diaNum) || isNaN(mesNum)) return;

    const btnCalcularAnioPersonal = document.getElementById('btnCalcularAnioPersonal');
    btnCalcularAnioPersonal.disabled = true;
    btnAnioText.textContent = 'Calculando...';
    btnAnioSpinner.classList.remove('hidden');

    try {
      const response = await fetch(`${API_BASE_URL}/v1/numerologia/anio-personal`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dia: diaNum, mes: mesNum, anio: 2026 })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (handleAuthError(response.status)) return;
        alert(`Error al calcular año personal (${response.status}): ${errorData.message || response.statusText}`);
        return;
      }

      const result = await response.json();
      if (result.status === 'success' && result.data) {
        const data = result.data;

        orbNumeroAnioPersonal.textContent = data.numeroAnioPersonal;
        quickPersonalYear.textContent = data.numeroAnioPersonal;
        etapaAnioPersonal.textContent = data.interpretacion?.etapa || `Año Personal ${data.numeroAnioPersonal}`;
        formulaPasoAPaso.textContent = `Fórmula: ${data.pasoAPaso?.formula || '--'}`;
        enfoqueAnioPersonal.textContent = `Enfoque: ${data.interpretacion?.enfoque || '--'}`;
        descripcionAnioPersonal.textContent = data.interpretacion?.descripcion || 'Ciclo activo para 2026.';
        consejoAnioPersonal.textContent = `Consejo: ${data.interpretacion?.consejo || 'Fluye con la energía del presente.'}`;

        badgeMaestroAnio.classList.toggle('hidden', !data.esNumeroMaestro);
        resultadoAnioPersonalContainer.classList.remove('hidden');
      }
    } catch (networkError) {
      console.error('[Error en /v1/numerologia/anio-personal]:', networkError);
      alert(`Error de conexión al calcular año personal.\nVerifica que Express esté en el puerto ${BACKEND_PORT}.`);
    } finally {
      btnCalcularAnioPersonal.disabled = false;
      btnAnioText.textContent = 'Calcular Ciclo 2026';
      btnAnioSpinner.classList.add('hidden');
    }
  };

  // El formulario SOLO calcula al hacer submit (nunca automático)
  formAnioPersonal.addEventListener('submit', (e) => {
    e.preventDefault();
    const dia = inputDiaNacimiento.value;
    const mes = inputMesNacimiento.value;
    if (!dia || !mes) {
      alert('Por favor ingresa el día y el mes de nacimiento.');
      return;
    }
    ejecutarCalculoAnioPersonal(dia, mes);
  });

  // ===========================================================================
  // 9. EVENTO: NÚMERO DEL ALMA (VOCALES)
  // ===========================================================================
  formAlma.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombreAEnviar = inputNombreAlma.value.trim();
    if (!nombreAEnviar) { alert('Por favor digita un nombre completo.'); return; }

    const btnCalcularAlma = document.getElementById('btnCalcularAlma');
    btnCalcularAlma.disabled = true;
    btnAlmaText.textContent = 'Revelando...';
    btnAlmaSpinner.classList.remove('hidden');

    try {
      const response = await fetch(`${API_BASE_URL}/v1/numerologia/alma`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nombreCompleto: nombreAEnviar })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (handleAuthError(response.status)) return;
        alert(`Error al calcular Número del Alma (${response.status}): ${errorData.message || response.statusText}`);
        return;
      }

      const result = await response.json();
      if (result.status === 'success' && result.data) {
        const data = result.data;

        orbNumeroAlma.textContent = data.numeroAlma;
        arquetipoAlma.textContent = data.interpretacion?.arquetipo || `Vibración del Alma ${data.numeroAlma}`;
        descripcionAlma.textContent = data.interpretacion?.descripcion || 'Descripción del anhelo más profundo.';
        badgeMaestroAlma.classList.toggle('hidden', !data.esNumeroMaestro);

        palabrasClaveAlmaContainer.innerHTML = '';
        (data.interpretacion?.palabrasClave || []).forEach(palabra => {
          const span = document.createElement('span');
          span.className = 'badge-cyan text-[10px]';
          span.textContent = `✦ ${palabra}`;
          palabrasClaveAlmaContainer.appendChild(span);
        });

        desgloseVocalesContainer.innerHTML = '';
        (data.vocalesEncontradas || []).forEach(item => {
          const tile = document.createElement('div');
          tile.className = 'tile-breakdown !border-[rgba(0,245,212,0.3)]';
          tile.innerHTML = `<span class="tile-letter !text-mystic-cyan">${item.caracter}</span><span class="tile-value">${item.valor}</span>`;
          desgloseVocalesContainer.appendChild(tile);
        });

        resultadoAlmaContainer.classList.remove('hidden');
      }
    } catch (networkError) {
      console.error('[Error en /v1/numerologia/alma]:', networkError);
      alert(`Error de conexión.\nVerifica que Express esté en el puerto ${BACKEND_PORT}.`);
    } finally {
      btnCalcularAlma.disabled = false;
      btnAlmaText.textContent = 'Revelar Número del Alma';
      btnAlmaSpinner.classList.add('hidden');
    }
  });

  // ===========================================================================
  // 10. EVENTO: NÚMERO DE PERSONALIDAD (CONSONANTES)
  // ===========================================================================
  formPersonalidad.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombreAEnviar = inputNombrePersonalidad.value.trim();
    if (!nombreAEnviar) { alert('Por favor digita un nombre completo.'); return; }

    const btnCalcularPersonalidad = document.getElementById('btnCalcularPersonalidad');
    btnCalcularPersonalidad.disabled = true;
    btnPersonalidadText.textContent = 'Descubriendo...';
    btnPersonalidadSpinner.classList.remove('hidden');

    try {
      const response = await fetch(`${API_BASE_URL}/v1/numerologia/personalidad`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ nombreCompleto: nombreAEnviar })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (handleAuthError(response.status)) return;
        alert(`Error al calcular Número de Personalidad (${response.status}): ${errorData.message || response.statusText}`);
        return;
      }

      const result = await response.json();
      if (result.status === 'success' && result.data) {
        const data = result.data;

        orbNumeroPersonalidad.textContent = data.numeroPersonalidad;
        arquetipoPersonalidad.textContent = data.interpretacion?.arquetipo || `Vibración de Personalidad ${data.numeroPersonalidad}`;
        descripcionPersonalidad.textContent = data.interpretacion?.descripcion || 'Tu imagen proyectada al mundo.';
        badgeMaestroPersonalidad.classList.toggle('hidden', !data.esNumeroMaestro);

        palabrasClavePersonalidadContainer.innerHTML = '';
        (data.interpretacion?.palabrasClave || []).forEach(palabra => {
          const span = document.createElement('span');
          span.className = 'badge-gold text-[10px]';
          span.textContent = `✦ ${palabra}`;
          palabrasClavePersonalidadContainer.appendChild(span);
        });

        desgloseConsonantesContainer.innerHTML = '';
        (data.consonantesEncontradas || []).forEach(item => {
          const tile = document.createElement('div');
          tile.className = 'tile-breakdown !border-[rgba(250,180,50,0.3)]';
          tile.innerHTML = `<span class="tile-letter !text-amber-400">${item.caracter}</span><span class="tile-value">${item.valor}</span>`;
          desgloseConsonantesContainer.appendChild(tile);
        });

        resultadoPersonalidadContainer.classList.remove('hidden');
      }
    } catch (networkError) {
      console.error('[Error en /v1/numerologia/personalidad]:', networkError);
      alert(`Error de conexión.\nVerifica que Express esté en el puerto ${BACKEND_PORT}.`);
    } finally {
      btnCalcularPersonalidad.disabled = false;
      btnPersonalidadText.textContent = 'Descubrir Número de Personalidad';
      btnPersonalidadSpinner.classList.add('hidden');
    }
  });

  // ===========================================================================
  // 11. EVENTO: LECTURA DEL DÍA CON GEMINI IA
  // ===========================================================================
  btnGetReading.addEventListener('click', async () => {
    btnGetReading.disabled = true;
    btnReadingIcon.classList.add('hidden');
    btnReadingSpinner.classList.remove('hidden');
    btnReadingText.textContent = 'Canalizando...';
    cambiarVisibilidadSuave(readingPlaceholderState, false);
    cambiarVisibilidadSuave(readingResultContainer, false);
    cambiarVisibilidadSuave(readingLoadingState, true);

    const nombreFinal = profileName.textContent || 'Consultante';
    const fechaFinal = user.birthDate || user.fechaNacimiento || '';

    try {
      const response = await fetch(`${API_BASE_URL}/readings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          matriz_id: user._id ? `matriz_${user._id}` : 'matriz_general_v1',
          prompt_usado_id: 'prompt_diario_gemini_v1',
          matriz: {
            nombre: nombreFinal,
            fechaNacimiento: fechaFinal,
            caminoDeVida: quickLifePath.textContent !== '--' ? quickLifePath.textContent : null,
            anioPersonal: quickPersonalYear.textContent !== '--' ? quickPersonalYear.textContent : null,
            signoZodiacal: zodiacSign.textContent !== '--' ? zodiacSign.textContent : null
          },
          plantillaPrompt: `Eres un maestro numerólogo y oráculo espiritual. Genera una lectura personalizada para ${nombreFinal}, analizando sus virtudes y energías cósmicas para hoy.`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (handleAuthError(response.status)) return;

        if (response.status === 503) {
          alert('El servicio de Gemini IA está experimentando alta demanda. Por favor intenta en unos instantes.');
        } else {
          alert(`Error del oráculo (${response.status}): ${errorData.message || response.statusText}`);
        }
        cambiarVisibilidadSuave(readingLoadingState, false);
        cambiarVisibilidadSuave(readingPlaceholderState, true);
        return;
      }

      const result = await response.json();

      if (result.data) {
        const reading = result.data;
        const contenido = reading.contenido || {};

        if (result.cached) {
          readingOriginBadge.textContent = '⚡ Recuperado de Caché MongoDB (0 tokens)';
          readingOriginBadge.className = 'badge-purple text-[10px]';
        } else {
          readingOriginBadge.textContent = '✨ Generado en vivo con Gemini IA';
          readingOriginBadge.className = 'badge-gold text-[10px]';
        }

        readingModelTag.textContent = `Modelo: ${reading.modelo || 'gemini-3.8-flash'}`;
        readingTokensTag.textContent = `Tokens: ${reading.tokens_usados || 0}`;

        readingResumenText.textContent = contenido.resumen ? `"${contenido.resumen}"` : '"El universo conspira a tu favor hoy."';
        readingVidaText.textContent = contenido.interpretacion_numero_vida || 'Tu sendero vital se encuentra iluminado por influencias armónicas.';
        readingDestacadoOrb.textContent = contenido.numero_destacado || quickLifePath.textContent || '--';

        readingFortalezasList.innerHTML = '';
        (Array.isArray(contenido.fortalezas) ? contenido.fortalezas : []).forEach(item => {
          const li = document.createElement('li');
          li.className = 'flex items-start gap-2';
          li.innerHTML = `<span class="text-emerald-400 mt-0.5">✔</span> <span>${item}</span>`;
          readingFortalezasList.appendChild(li);
        });

        readingAreasList.innerHTML = '';
        (Array.isArray(contenido.areas_de_trabajo) ? contenido.areas_de_trabajo : []).forEach(item => {
          const li = document.createElement('li');
          li.className = 'flex items-start gap-2';
          li.innerHTML = `<span class="text-amber-400 mt-0.5">✦</span> <span>${item}</span>`;
          readingAreasList.appendChild(li);
        });

        cambiarVisibilidadSuave(readingLoadingState, false);
        cambiarVisibilidadSuave(readingResultContainer, true);
      }
    } catch (networkError) {
      console.error('[Error en POST /readings]:', networkError);
      alert(`Error de red.\nAsegúrate de que el servidor Express esté activo en el puerto ${BACKEND_PORT}.`);
      cambiarVisibilidadSuave(readingLoadingState, false);
      cambiarVisibilidadSuave(readingPlaceholderState, true);
    } finally {
      btnGetReading.disabled = false;
      btnReadingIcon.classList.remove('hidden');
      btnReadingSpinner.classList.add('hidden');
      btnReadingText.textContent = 'Actualizar Lectura Cósmica';
    }
  });

  // ===========================================================================
  // 12. PRECARGA DE LECTURA EXISTENTE DESDE BD
  // ===========================================================================
  const verificarLecturaExistente = async ({ exigirActualizacion = false } = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/readings`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (handleAuthError(response.status)) {
          throw new Error('La sesión expiró. Inicia sesión nuevamente.');
        }
        if (exigirActualizacion) {
          throw new Error(`No se pudieron verificar las lecturas previas (${response.status}).`);
        }
      }

      if (response.ok) {
        const result = await response.json();
        const readings = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
        if (readings.length > 0) {
          const lastReading = readings[0];
          const contenido = lastReading.contenido;
          if (contenido && contenido.resumen) {
            readingOriginBadge.textContent = '📦 Lectura Previa Almacenada en BD';
            readingModelTag.textContent = `Modelo: ${lastReading.modelo || 'gemini-3.8-flash'}`;
            readingTokensTag.textContent = `Tokens: ${lastReading.tokens_usados || 0}`;

            readingResumenText.textContent = `"${contenido.resumen}"`;
            readingVidaText.textContent = contenido.interpretacion_numero_vida || '';
            readingDestacadoOrb.textContent = contenido.numero_destacado || '--';

            readingFortalezasList.innerHTML = '';
            (contenido.fortalezas || []).forEach(f => {
              const li = document.createElement('li');
              li.className = 'flex items-start gap-2';
              li.innerHTML = `<span class="text-emerald-400 mt-0.5">✔</span> <span>${f}</span>`;
              readingFortalezasList.appendChild(li);
            });

            readingAreasList.innerHTML = '';
            (contenido.areas_de_trabajo || []).forEach(a => {
              const li = document.createElement('li');
              li.className = 'flex items-start gap-2';
              li.innerHTML = `<span class="text-amber-400 mt-0.5">✦</span> <span>${a}</span>`;
              readingAreasList.appendChild(li);
            });

            cambiarVisibilidadSuave(readingPlaceholderState, false);
            cambiarVisibilidadSuave(readingResultContainer, true);
            btnReadingText.textContent = 'Regenerar Lectura Cósmica';
          }
        }
      }
    } catch (e) {
      if (exigirActualizacion) throw e;
      console.warn('[Readings Check Error]:', e.message);
    }
  };

  // ===========================================================================
  // 13. BOTONES DE ACCIÓN: REFRESCAR Y CERRAR SESIÓN
  // ===========================================================================
  const abrirModalPerfil = () => {
    editFirstName.value = user.firstName || '';
    editLastName.value = user.lastName || '';
    const fechaActual = user.birthDate || user.fechaNacimiento;
    const fecha = fechaActual ? new Date(fechaActual) : null;
    editBirthDay.value = fecha && !isNaN(fecha.getTime()) ? fecha.getUTCDate() : '';
    editBirthMonth.value = fecha && !isNaN(fecha.getTime()) ? fecha.getUTCMonth() + 1 : '';
    editBirthYear.value = fecha && !isNaN(fecha.getTime()) ? fecha.getUTCFullYear() : '';
    profileEditModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
    cambiarVisibilidadSuave(profileEditModal, true);
    requestAnimationFrame(() => editFirstName.focus());
  };

  const cerrarModalPerfil = () => {
    profileEditModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overflow-hidden');
    cambiarVisibilidadSuave(profileEditModal, false);
    editProfileBtn.focus();
  };

  if (editProfileBtn && profileEditModal && profileEditForm) {
    editProfileBtn.addEventListener('click', abrirModalPerfil);
    document.getElementById('closeProfileModalBtn').addEventListener('click', cerrarModalPerfil);
    document.getElementById('cancelProfileEditBtn').addEventListener('click', cerrarModalPerfil);

    profileEditModal.addEventListener('click', (event) => {
      if (event.target === profileEditModal) cerrarModalPerfil();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && profileEditModal.getAttribute('aria-hidden') === 'false') {
        cerrarModalPerfil();
      }
    });

    profileEditForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!editFirstName.value.trim() || !editLastName.value.trim()) {
        mostrarToast('Los nombres y apellidos no pueden estar vacíos.', 'error');
        return;
      }

      let birthDate;
      try {
        birthDate = obtenerFechaEditadaISO();
      } catch (error) {
        mostrarToast(error.message, 'error');
        return;
      }

      const userId = user._id || user.id;
      if (!userId) {
        mostrarToast('No se pudo identificar tu perfil. Vuelve a iniciar sesión.', 'error');
        return;
      }

      saveProfileBtn.disabled = true;
      saveProfileBtn.textContent = 'Guardando...';
      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            firstName: editFirstName.value.trim(),
            lastName: editLastName.value.trim(),
            birthDate
          })
        });

        if (!response.ok) {
          if (handleAuthError(response.status)) return;
          const errorData = await response.json().catch(() => ({}));
          const validationMessages = Array.isArray(errorData.errores)
            ? errorData.errores.map((error) => error.mensaje).filter(Boolean).join(' ')
            : '';
          throw new Error(validationMessages || errorData.message || errorData.mensaje || 'No se pudo guardar el perfil.');
        }

        const updatedUser = await response.json();
        user = { ...user, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(user));
        await cargarPerfilUsuario();
        cerrarModalPerfil();
        try {
          await calcularYRenderizarExpresion(`${user.firstName || ''} ${user.lastName || ''}`.trim());
        } catch (error) {
          console.error('[Profile Expression Recalculation Error]:', error);
          mostrarToast(`Perfil actualizado, pero no se pudo recalcular la expresión: ${error.message}`, 'error');
          return;
        }
        mostrarToast('Perfil actualizado correctamente.');
      } catch (error) {
        console.error('[Profile Update Error]:', error);
        mostrarToast(error.message || 'Ocurrió un error al guardar el perfil.', 'error');
      } finally {
        saveProfileBtn.disabled = false;
        saveProfileBtn.textContent = 'Guardar Cambios';
      }
    });
  }

  if (refreshDataBtn) {
    refreshDataBtn.addEventListener('click', async () => {
      if (refreshDataBtn.disabled) return;
      refreshDataBtn.disabled = true;
      refreshDataBtn.setAttribute('aria-busy', 'true');
      refreshDataBtn.textContent = '⏳ Sincronizando...';
      try {
        await cargarPerfilUsuario({ exigirActualizacion: true });
        await verificarLecturaExistente({ exigirActualizacion: true });
        mostrarToast('Información sincronizada con el oráculo');
      } catch (error) {
        console.error('[Dashboard Refresh Error]:', error);
        mostrarToast(error.message || 'No se pudo sincronizar la información.', 'error');
      } finally {
        refreshDataBtn.disabled = false;
        refreshDataBtn.removeAttribute('aria-busy');
        refreshDataBtn.textContent = '🔄 Actualizar';
      }
    });
  }

  const hoy = new Date();
  const fechaMaxima = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  if (editBirthYear) editBirthYear.max = String(new Date().getFullYear());
  [pinaculosFecha, compatibilidadFecha1, document.getElementById('compatibilidadFecha2')].forEach((input) => {
    if (input) input.max = fechaMaxima;
  });

  const conectarCalculoAvanzado = (formId, endpoint, crearPayload, renderizarResultado) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const boton = form.querySelector('button[type="submit"]');
      const textoOriginal = boton.textContent;
      boton.disabled = true;
      boton.textContent = 'Calculando...';

      try {
        const response = await fetch(`${API_BASE_URL}/v1/numerologia/${endpoint}`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(crearPayload())
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (handleAuthError(response.status)) return;
          const validationMessages = Array.isArray(result.errores)
            ? result.errores.map((error) => error.mensaje).filter(Boolean).join(' ')
            : '';
          throw new Error(validationMessages || result.message || result.mensaje || `Error al calcular (${response.status}).`);
        }
        if (result.status !== 'success' || !result.data) {
          throw new Error(result.message || 'El servidor no devolvió un resultado válido.');
        }

        renderizarResultado(result.data);
        mostrarToast(result.message || 'Cálculo realizado correctamente.');
      } catch (error) {
        console.error(`[Advanced Numerology Error: ${endpoint}]:`, error);
        mostrarToast(error.message || 'No fue posible realizar el cálculo.', 'error');
      } finally {
        boton.disabled = false;
        boton.textContent = textoOriginal;
      }
    });
  };

  conectarCalculoAvanzado(
    'formPinaculos',
    'pinaculos',
    () => ({ fechaNacimiento: pinaculosFecha.value }),
    (data) => {
      document.getElementById('pinaculosLifePath').textContent = `Camino de Vida: ${data.caminoDeVida}`;
      const list = document.getElementById('pinaculosList');
      list.replaceChildren();
      data.pinaculos.forEach((pinaculo, index) => {
        const item = document.createElement('div');
        item.className = 'rounded-xl border border-amber-300/35 bg-[rgba(226,183,97,0.12)] p-4 shadow-[0_0_14px_rgba(245,158,11,0.08)]';
        const title = document.createElement('p');
        title.className = 'text-xs font-bold uppercase tracking-wider text-amber-200';
        title.textContent = `Pináculo ${index + 1}`;
        const number = document.createElement('p');
        number.className = 'mt-1 font-serif text-3xl font-bold text-amber-300';
        number.textContent = pinaculo.numero;
        const ages = document.createElement('p');
        ages.className = 'mt-1 text-sm font-medium text-amber-100';
        ages.textContent = pinaculo.edadHasta === null
          ? `Desde los ${pinaculo.edadDesde} años`
          : `De ${pinaculo.edadDesde} a ${pinaculo.edadHasta} años`;
        item.append(title, number, ages);
        list.appendChild(item);
      });
      document.getElementById('pinaculosResult').classList.remove('hidden');
    }
  );

  conectarCalculoAvanzado(
    'formMatrizKarmica',
    'matriz-karmica',
    () => ({ nombreCompleto: matrizNombre.value.trim() }),
    (data) => {
      const missingNumbers = document.getElementById('matrizKarmicaNumbers');
      missingNumbers.replaceChildren();
      document.getElementById('matrizKarmicaSummary').textContent =
        `Números presentes: ${data.numerosPresentes.join(', ') || 'ninguno'}. Números kármicos ausentes:`;
      if (data.numerosKarmicos.length) {
        data.numerosKarmicos.forEach((number) => {
          const badge = document.createElement('span');
          badge.className = 'flex h-11 w-11 items-center justify-center rounded-full border border-purple-200/50 bg-purple-300/20 font-serif text-xl font-bold text-purple-100 shadow-[0_0_12px_rgba(192,132,252,0.2)]';
          badge.textContent = number;
          missingNumbers.appendChild(badge);
        });
      } else {
        const noMissing = document.createElement('span');
        noMissing.className = 'text-base font-semibold text-emerald-300';
        noMissing.textContent = 'No faltan números del 1 al 9.';
        missingNumbers.appendChild(noMissing);
      }
      document.getElementById('matrizKarmicaResult').classList.remove('hidden');
    }
  );

  conectarCalculoAvanzado(
    'formHerencia',
    'herencia',
    () => ({ apellidos: herenciaApellidos.value.trim() }),
    (data) => {
      document.getElementById('herenciaSummary').textContent =
        `Suma pitagórica: ${data.sumaTotal} → Número de Herencia: ${data.numeroHerencia}`;
      document.getElementById('herenciaResult').classList.remove('hidden');
    }
  );

  conectarCalculoAvanzado(
    'formCompatibilidad',
    'compatibilidad',
    () => ({
      fechaNacimiento1: compatibilidadFecha1.value,
      fechaNacimiento2: document.getElementById('compatibilidadFecha2').value
    }),
    (data) => {
      document.getElementById('compatibilidadScore').textContent =
        `${new Intl.NumberFormat('es', { maximumFractionDigits: 1 }).format(data.porcentaje)}%`;
      document.getElementById('compatibilidadDescription').textContent = data.descripcion;
      document.getElementById('compatibilidadPaths').textContent =
        `Caminos de Vida: ${data.caminoDeVida1} y ${data.caminoDeVida2}`;
      document.getElementById('compatibilidadResult').classList.remove('hidden');
    }
  );

  logoutBtn.addEventListener('click', () => {
    if (confirm('¿Deseas cerrar tu sesión cósmica?')) {
      localStorage.clear();
      window.location.href = 'login.html';
    }
  });

  // ===========================================================================
  // 14. INICIALIZACIÓN
  // ===========================================================================
  await cargarPerfilUsuario();
  await verificarLecturaExistente();
});