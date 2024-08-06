const mongoose = require('mongoose');

// Definir esquema para el usuario
const userSchema = new mongoose.Schema({
  nombre: { type: String },
  password: { type: String },
  apellido: { type: String },
  email: { type: String },
  telefono: { type: Number },
  direccion: { type: String },
  fecha_registro: { type: Date},
  photo: { type: String },
});

// Crear el modelo 'Author' a partir del esquema
const User = mongoose.model('User', userSchema);

module.exports = User;
