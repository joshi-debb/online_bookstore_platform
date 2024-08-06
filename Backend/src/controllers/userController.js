const User = require("../models/userModel");
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const s3 = require('../config/aws-config');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('photo');
exports.registerUser = async (req, res) => {
  console.log(req.body)
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', status: false });
    }

    try {
      const db = await getDB();
      if (db == null) {
        return res.status(500).json({ message: "Error connecting to database" });
      }

      const date = new Date();
      req.body.fecha_registro = date;

      const newUser = new User({
        nombre: req.body.nombre,
        password: req.body.password,
        apellido: req.body.apellido,
        email: req.body.email,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        fecha_registro: req.body.fecha_registro,
        photo: req.body.photo
      });

      const userExists = await db.collection("Usuarios").findOne({ email: newUser.email });
      if (userExists) {
        return res.status(409).json({ message: "User already exists", status: false });
      }

      // Upload the photo to S3
      if (req.file) {
        const fileName = `${newUser.email}-${Date.now()}.jpg`;
        const params = {
          Bucket: 'bd2-proyecto2/usuarios',
          Key: fileName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };

        const uploadResult = await s3.upload(params).promise();
        newUser.photo = uploadResult.Location; // Save the URL of the uploaded photo
      }

      await db.collection("Usuarios").insertOne(newUser);
      return res.status(201).json({ message: "User created successfully", status: true });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message, status: false });
    }
  });
}
exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }
    const userExists = await db.collection("Usuarios").findOne({ email: email, password: password });

    if (userExists) {
      return res.status(200).json({ 
        message: "User logged in successfully", 
        status: true, 
        user: userExists
      });
    }

    return res.status(401).json({ message: "Invalid credentials", status: false });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

exports.updateUser = async (req, res) => {
  try {

    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }

    const user_id = req.params.user_id;

    const _user_id = new ObjectId(user_id);

    const actualUser = await db.collection("Usuarios").findOne({ _id: _user_id });
    if (!actualUser) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    console.log(req.body.nombre, req.body.password, req.body.apellido, req.body.email, req.body.telefono, req.body.direccion, actualUser.photo, actualUser.fecha_registro);

    const updatedUser = {
      nombre: req.body.nombre,
      password: req.body.password,
      apellido: req.body.apellido,
      email: req.body.email,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
      photo: actualUser.photo,
      fecha_registro: actualUser.fecha_registro
    }

    await db.collection("Usuarios").updateOne({ _id: _user_id }, { $set: updatedUser });
    return res.status(201).json({ message: "User updated successfully", status: true });

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}

exports.getUser = async (req, res) => {
  try {

    const db = await getDB();
    if (db == null) {
      return res.status(500).json({ message: "Error connecting to database" });
    }

    const user_id = req.params.user_id;
    const _user_id = new ObjectId(user_id);

    const user = await db.collection("Usuarios").findOne({ _id: _user_id });
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
}