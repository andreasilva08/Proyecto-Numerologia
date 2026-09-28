import bcryptjs from 'bcryptjs';
import User from '../models/User.model.js';
import { generarJWT } from '../helpers/generar-jwt.js';

// Login de usuario (sin cambios mayores, se mantiene funcional)
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Usuario / Password no son correctos - correo',
      });
    }

    if (user.estado === 0 || user.estado === false) {
      return res.status(400).json({ message: 'Usuario inactivo' });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        message: 'Usuario / Password no son correctos - password',
      });
    }

    const token = await generarJWT(user.id);

    res.json({ user, token });
  } catch (error) {
    return res.status(500).json({
      message: 'Error en el servidor, hable con el WebMaster',
    });
  }
};

// Crear usuario (evitando Mass Assignment de roles)
export const createUser = async (req, res) => {
  try {
    // 1. Extraemos SOLO los campos permitidos (evita que manden "role": "admin")
    const { firstName, lastName, email, password, birthDate } = req.body;
    
    const user = new User({ firstName, lastName, email, password, birthDate });

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);
    }

    await user.save();
    
    // Ocultar el passwordHash en la respuesta por seguridad
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    // Excluimos la contraseña en la consulta global
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, role, ...resto } = req.body; // Filtramos 'role' y 'password' del body directo

    // CONTROLES DE BOLA / IDOR y PRIVILEGIOS:
    // Verificar si el usuario autenticado (req.usuario) es el dueño de la cuenta o es admin.
    // (Asumiendo que tu middleware de JWT inyecta req.usuario)
    const esAdmin = req.usuario?.role === 'admin';
    const esSuPropiaCuenta = req.usuario?._id.toString() === id;

    if (!esAdmin && !esSuPropiaCuenta) {
      return res.status(403).json({ message: 'No tiene autorización para modificar este usuario' });
    }

    // Si es admin, permitimos actualizar el rol de forma controlada; si no, ignoramos cualquier intento de cambio de rol
    if (esAdmin && role) {
      resto.role = role;
    }

    // Re-encriptar contraseña si viene en la petición
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      resto.password = await bcryptjs.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};