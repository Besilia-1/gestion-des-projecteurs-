const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Route pour l'inscription
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role]
    );
    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
  }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (user.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mot de passe incorrect" });
      }
  
      const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });
  