const mongoose = require('mongoose');

// Definir esquema para el autor
const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  photo: { type: String }, // Aquí puedes almacenar la URL o referencia a la foto del autor
  
});

// Crear el modelo 'Author' a partir del esquema
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
