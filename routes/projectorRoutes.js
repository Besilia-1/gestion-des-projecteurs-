const express = require('express');
const { addProjector } = require('../controllers/projectorController');

const router = express.Router();

router.post('/', addProjector);

module.exports = router;

router.post("/", async (req, res) => {
    const { name, status } = req.body;
    try {
      await db.query("INSERT INTO projectors (name, status) VALUES (?, ?)", [name, status]);
      res.status(201).json({ message: "Projecteur ajouté !" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout du projecteur" });
    }
  });
  

  router.get("/", async (req, res) => {
    try {
      const [projectors] = await db.query("SELECT * FROM projectors");
      res.json(projectors);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des projecteurs" });
    }
  });

  
  router.put("/:id", async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
      await db.query("UPDATE projectors SET status = ? WHERE id = ?", [status, id]);
      res.json({ message: "Projecteur mis à jour !" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
  });
  

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await db.query("DELETE FROM projectors WHERE id = ?", [id]);
      res.json({ message: "Projecteur supprimé !" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  });
  