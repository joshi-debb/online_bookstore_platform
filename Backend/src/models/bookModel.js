const mongoose = require('mongoose');

// Definir esquema para el libro
const bookSchema = new mongoose.Schema({

  title: { type: String, required: true },
  author_id: {type: String, required: true},
  author: { type: String, required: true },
  description: { type: String, required: true },
  gender: { type: String, required: true},
  publishDate: { type: Date, required: true},
  availability: { type: Boolean, default: true }, 
  quantityAvailable: { type: Number, default: 1 }, 
  average_score: { type: Number, default: 0 }, 
  price: { type: Number, required: true },
  image_url: { type: String, required: true }
});

// Crear el modelo 'Book' a partir del esquema
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
