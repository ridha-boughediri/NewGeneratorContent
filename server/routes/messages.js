const express = require("express");
const { user } = require("../db.config");
let router = express.Router();
const jwt = require("jsonwebtoken");

const db = require("../db.config");
const messages = require("../models/messages");
const checkTokenexist = require("../JWT/verif");

// mon middleware pour message selon la route

router.use((req, res, next) => {
  const event = new Date();

  console.log("Mesage Time:", event.toString());
  next();
});

router.get("/", (req, res) => {
  db.message
    .findAll()
    .then((messages) => res.json({ data: messages }))
    .catch((err) =>
      res.status(500).json({ message: "Database Error", error: err })
    );
});

router.get("/:id", async (req, res) => {
  let messageId = parseInt(req.params.id);

  // Vérification si le champ id est présent et cohérent
  if (!messageId) {
    return res.json(400).json({ message: "Missing Parameter" });
  }

  try {
    // Récupération de l'message et vérification
    let message = await db.message.findOne({
      where: { id: messageId },
      include: { model: user },
    });
    if (message === null) {
      return res.status(404).json({ message: "This message does not exist !" });
    }

    return res.json({ data: message }), res.status(200);
  } catch (err) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
});

router.post("/", checkTokenexist, async (req, res) => {
  const { content } = req.body;

  // Validation des données reçues
  if (!content) {
    return res.status(400).json({ message: "Missing Data" });
  }

  try {
    // Céation de l'message
    let messages = await db.message.create(req.body);
    // io.on("connection", (socket)=>{
    //     socket.emit(req.body);
    // })
    return (
      res.json({ message: "message Created", data: messages }), res.status(200)
    );
  } catch (err) {
    if (err.name == "SequelizeDatabaseError") {
      res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(500).json({ message: "Hash Process Error", error: err });
  }
});

router.patch("/:id", checkTokenexist, async (req, res) => {
  let messageId = parseInt(req.params.id);

  // Vérification si le champ id est présent et cohérent
  // if (!messageId) {
  //     return res.status(400).json({ message: 'Missing parameter' })
  // }

  try {
    // Recherche de l'message et vérification
    let message = await db.message.findOne({
      where: { id: messageId },
      raw: true,
    });
    if (message === null) {
      return res.status(404).json({ message: "This message does not exist !" });
    }

    // Mise à jour de l'message
    await db.message.update(req.body, { where: { id: messageId } });
    return res.json({ message: "message Updated" }), res.status(200);
  } catch (err) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
});

router.delete("/:id", checkTokenexist, (req, res) => {
  let messageId = parseInt(req.params.id);

  // Vérification si le champ id est présent et cohérent
  if (!messageId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  // Suppression de l'utilisateur
  db.message
    .destroy({ where: { id: messageId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database Error", error: err })
    );
});

module.exports = router;
