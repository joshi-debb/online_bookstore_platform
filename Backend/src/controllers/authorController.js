const Author = require("../models/authorModel");
const s3 = require('../config/aws-config');
const multer = require('multer');
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('photo');
exports.getAuthors = async (req, res) => {
  try {
    const db = await getDB(); //Se obtiene la instancia de la base de datos
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }
    const authors = await db.collection("Authors").find({}).toArray();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

exports.createAuthor = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', status: false });
    }

    try {
      const db = await getDB();
      if (db == null) {
        return res.status(500).json({ message: "Error connecting to database" });
      }

      const newAuthor = new Author(req.body);

      // Validate the author data
      const validateAuthor = await newAuthor.validateSync();
      if (validateAuthor) {
        return res.status(400).json({ message: validateAuthor.message, status: false });
      }

      // Check if the author already exists
      const authorExists = await db.collection("Authors").findOne({ name: newAuthor.name });
      if (authorExists) {
        return res.status(409).json({ message: "Author already exists", status: false });
      }

      // Upload the photo to S3
      if (req.file) {
        const fileName = `${newAuthor.name}-${Date.now()}.jpg`;
        const params = {
          Bucket: 'bd2-proyecto2/autores',
          Key: fileName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
         
        };

        const uploadResult = await s3.upload(params).promise();
        newAuthor.photo = uploadResult.Location; // Save the URL of the uploaded photo
      }

      // Insert the new author into the database
      await db.collection("Authors").insertOne(newAuthor);
      return res.status(201).json({ message: "Author created successfully", status: true });
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: error.message, status: false });
    }
  });
};


exports.deleteAuthor = async (req, res) => {
  try {
    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }
    
    const author_id = req.params.author_id;
    console.log(req.params)
    const _author_id = new ObjectId(author_id);
    const author = await db.collection("Authors").findOne({ _id: _author_id });
    if (!author) {
      return res.status(404).json({ message: "Author not found", status: false });
      
    }
    await db.collection("Books").deleteMany({ author_id: author_id });
    await db.collection("Authors").deleteOne({ _id: _author_id });
    return res.status(200).json({ message: "Author deleted successfully", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}
