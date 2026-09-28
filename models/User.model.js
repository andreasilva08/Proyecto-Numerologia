import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    birthDate: {
      type: Date,
      required: true
    },
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client'
    }
  },
  {
    timestamps: true
  }
);

// Sobrescribir toJSON para excluir la contraseña y la versión __v al responder al cliente
userSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();
  return user;
};

export default mongoose.model('User', userSchema);