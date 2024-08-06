const Author = require("../models/authorModel");
const Book = require("../models/bookModel");
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const multer = require('multer');
const s3 = require('../config/aws-config');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('imageFile'); // El campo debe coincidir con el nombre del input en el formulario

exports.addBook = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', status: false });
    }
  
    try {
      const db = await getDB();
      if (!db) {
        return res.status(500).json({ message: "Error connecting to database", status: false });
      }

      const author_id = req.body.author_id;
      const _author_id = new ObjectId(author_id);

      // Verifica si el autor existe
      const author = await db.collection("Authors").findOne({ _id: _author_id });
    
      if (!author) {
        return res.status(404).json({ message: "Author not found", status: false });
      }
  
      // Crea un nuevo objeto Book con los datos del formulario
      const newBook = new Book({
        title: req.body.title,
        author_id: author_id,
        author: author.name,
        description: req.body.description,
        gender: req.body.gender,
        publishDate: req.body.publishDate,
        availability: req.body.availability,
        quantityAvailable: req.body.quantityAvailable,
        average_score: req.body.average_score,
        price: req.body.price,
        image_url: '', // Se establecerá después si se sube una imagen
        reviews: []
      });

      // Verifica si el libro ya existe
      const bookExists = await db.collection("Books").findOne({ title: newBook.title, author_id: newBook.author_id, publishDate: newBook.publishDate });
      if (bookExists) {
        return res.status(409).json({ message: "Book already exists", status: false });
      }
  

      // Sube la imagen a S3 si existe un archivo adjunto
      if (req.file) {
  
        const fileName = `${newBook.title}-${Date.now()}.jpg`;
        const params = {
          Bucket: 'bd2-proyecto2/libros',
          Key: fileName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };

        const uploadResult = await s3.upload(params).promise();
        newBook.image_url = uploadResult.Location; // Guarda la URL de la imagen cargada
      }

      // Inserta el nuevo libro en la base de datos
      await db.collection("Books").insertOne(newBook);

      return res.status(201).json({ message: "Book created successfully", status: true });
    } catch (error) {
      console.error("Error adding book:", error);
      return res.status(400).json({ message: error.message, status: false });
    }
  });
};

exports.getBooks = async (req, res) => {
  try {
    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }
    const books = await db.collection("Books").find({}).toArray();
    return res.status(200).json({data:books, status: true});
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false});
  }
}

exports.getBooksByAuthor = async (req, res) => {
  try {
    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }
   
    const author_id = req.params.author_id;
    const _author_id = new ObjectId(author_id);
    const author = await db.collection("Authors").findOne({ _id: _author_id });
    if (!author) {
      return res.status(404).json({ message: "Author not found", status: false});
    }
    const books = await db.collection("Books").find({ author_id: author_id }).toArray();
    return res.status(200).json({data:books, status: true});
  } catch (error) {
    return res.status(500).json({ message: error.message , status: false});
  }
}

exports.getBookById= async (req, res) => {
  try {
    const db = await getDB();
    const book_id = req.params.book_id;
    const _book_id = new ObjectId(book_id);
    const book = await db.collection("Books").findOne({ _id: _book_id });
    if (!book) {
      return res.status(404).json({ message: "Book not found", status: false});
    }
    return res.status(200).json({data:book, status: true});
  } catch (error) {
    return res.status(500).json({ message: error.message , status: false});
  }
};

exports.updateBook = async (req, res) => {
  try {
    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }

    const book_id = req.params.book_id;

    const _book_id =new ObjectId(book_id); 
    let author_id = req.body.author_id
    const _author_id = new ObjectId(author_id);
    
    const author = await db.collection("Authors").findOne({ _id: _author_id });
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
  
    const updatedBook = {
      title: req.body.title,
      author: author.name,
      author_id: author_id,
      description: req.body.description,
      gender: req.body.gender,
      publishDate: req.body.publishDate,
      availability: req.body.availability,
      quantityAvailable: req.body.quantityAvailable,
      average_score: req.body.average_score,
      price: req.body.price,
      image_url: req.body.image_url
    };

    await db.collection("Books").updateOne({ _id: _book_id }, { $set: updatedBook });
    return res.status(200).json({ message: "Book updated successfully", status: true});
  }
  catch (error) {
    return res.status(500).json({ message: error.message, status: false});
  }
}


exports.deleteBook= async (req, res) => {
  try {
    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }
    const book_id = req.params.book_id;
    const _book_id =new ObjectId(book_id); 
    const book = await db.collection("Books").findOne({ _id: _book_id });
    if (!book) {
      return res.status(404).json({ message: "Book not found", status: false});
    }
    await db.collection("Books").deleteOne({ _id: _book_id });
    return res.status(200).json({ message: "Book deleted successfully" , status: true});
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false});
  }
}

exports.addReview = async (req, res) => {
  try {
    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }

    const book_id = req.params.book_id;
    const _book_id = new ObjectId(book_id);
    const book = await db.collection("Books").findOne({ _id: _book_id });
    if (!book) {
      return res.status(404).json({ message: "Book not found", status: false});
    }

    if (!req.body.userName || !req.body.score || !req.body.comment) {
      return res.status(400).json({ message: "Missing required fields", status: false});
    }

    const review = {
      userName: req.body.userName,
      score: req.body.score,
      comment: req.body.comment
    };

    await db.collection("Books").updateOne({ _id: _book_id }, { $push: { reviews: review } });
    // Calcular el nuevo promedio de puntajes
    const updatedBook = await db.collection("Books").findOne({ _id: _book_id });
    const reviews = updatedBook.reviews;
    const averageScore = reviews.reduce((total, review) => total + review.score, 0) / reviews.length;

    // Actualizar el campo average_score en el documento
    await db.collection("Books").updateOne(
      { _id: _book_id },
      { $set: { average_score: averageScore } }
    );
    
    return res.status(200).json({ message: "Review added successfully", status: true});
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false});
  }
}

exports.getReviews = async (req, res) => {
  try {
    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }

    const book_id = req.params.book_id;
    const _book_id = new ObjectId(book_id);
    const book = await db.collection("Books").findOne({ _id: _book_id });
    if (!book) {
      return res.status(404).json({ message: "Book not found", status: false});
    }    
    return res.status(200).json({data:book.reviews, status: true});
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false});
  }
}

exports.allGenres = async (req, res) => {
  try {
    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }
    const genres = await db.collection("Books").aggregate([
      { $group: { _id: "$gender" } }
    ]).toArray();
    
    const uniqueGenres = genres.map(genre => genre._id);
    return res.status(200).json({ data: uniqueGenres, status: true });
  } catch (error) {

    return res.status(500).json({ message: error.message, status: false});
  }
}

exports.getAllBooksByIds = async (req, res) => {
  try {
    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }
    
    const bookRequests = req.body.map(item => ({
      _id: new ObjectId(item._id),
      quantity: item.quantity
    }));

    // Obtener solo los _id para la consulta
    const book_ids = bookRequests.map(item => item._id);

    const books = await db.collection("Books").find({ _id: { $in: book_ids } }).toArray();

    // Combinar los resultados con la cantidad solicitada y agregar price, title y description
    const combinedBooks = books.map(book => {
      const requestedBook = bookRequests.find(reqBook => reqBook._id.equals(book._id));
      return {
        _id: requestedBook._id,
        quantity: requestedBook.quantity,
        price: book.price,
        title: book.title,
        description: book.description,
        image_url: book.image_url
      };
    });

    return res.status(200).json({ data: combinedBooks, status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}