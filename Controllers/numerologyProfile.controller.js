import NumerologyProfile from '../models/NumerologyProfile.model.js';
import User from '../models/User.model.js';

export const createNumerologyProfile = async (req, res) => {
  try {
    // Tomamos el userId priorizando el token autenticado, o el que venga en el body
    const userId = req.usuario?._id || req.body.userId || req.body.usuarioId;

    if (!userId) {
      return res.status(400).json({ message: 'El ID de usuario es obligatorio para crear un perfil' });
    }

    // VALIDACIÓN DE USUARIO FANTASMA: Comprobar que el usuario realmente exista en BD
    const usuarioExiste = await User.findById(userId);
    if (!usuarioExiste) {
      return res.status(404).json({ message: 'El usuario asociado no existe en el sistema' });
    }

    const profile = new NumerologyProfile({
      ...req.body,
      userId
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) { 
    res.status(400).json({ message: error.message }); 
  }
};

export const getNumerologyProfiles = async (req, res) => {
  try {
    const profiles = await NumerologyProfile.find().populate('userId', 'firstName lastName email');
    res.json(profiles);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

export const getNumerologyProfileById = async (req, res) => {
  try {
    const profile = await NumerologyProfile.findById(req.params.id).populate('userId', 'firstName lastName email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

export const updateNumerologyProfile = async (req, res) => {
  try {
    // Opcional: Validar propiedad del perfil antes de actualizar
    const profile = await NumerologyProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) { 
    res.status(400).json({ message: error.message }); 
  }
};

export const deleteNumerologyProfile = async (req, res) => {
  try {
    const profile = await NumerologyProfile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted' });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};