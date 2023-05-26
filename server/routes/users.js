const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

const db = require("../db.config");
const checkTokenexist = require("../JWT/verif");

const router = express.Router();

router.use((req, res, next) => {
  const event = new Date();
  console.log("User Time:", event.toString());
  next();
});

router.get("/", (req, res) => {
  db.user
    .findAll()
    .then((users) => res.json({ data: users }), res.status(200))
    .catch((err) =>
      res.status(500).json({ message: "Database Error", error: err })
    );
});

router.get("/", checkTokenexist, (req, res) => {
  db.user
    .findAll()
    .then((users) => res.json({ data: users }), res.status(200))
    .catch((err) =>
      res.status(500).json({ message: "Database Error", error: err })
    );
});

router.get("/firstlast", (req, res) => {
  db.user
    .findAll({ attributes: ["firstname", "lastname"] })
    .then((users) => res.json({ data: users }), res.status(200))
    .catch((err) =>
      res.status(500).json({ message: "Database Error", error: err })
    );
});

router.get("/:id", checkTokenexist, async (req, res) => {
  let userId = parseInt(req.params.id);

  // Vérification si le champ id est présent et cohérent
  if (!userId) {
    return res.json(400).json({ message: "Missing Parameter" });
  }

  try {
    // Récupération de l'utilisateur et vérification
    let user = await db.user.findOne({
      where: { id: userId },
      attributes: ["login", "email", "password", "firstname", "lastname"],
    });
    if (user === null) {
      return res.status(404).json({ message: "This user does not exist !" });
    }

    return res.json({ data: user }), res.status(200);
  } catch (err) {
    return res.status(500).json({ message: "Database Error", error: err });
  }
});

router.patch("/:id", async (req, res) => {
  const userId = req.params.id;
  const { lastname, firstname, login, email, password } = req.body;

  // Validation des données reçues
  if (!lastname || !firstname || !login || !email || !password) {
    return res.status(400).json({ message: "Missing Data" });
  }

  try {
    // Vérification si l'utilisateur existe
    const user = await db.user.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mise à jour des données de l'utilisateur
    user.lastname = lastname;
    user.firstname = firstname;
    user.login = login;
    user.email = email;

    // Hashage du nouveau mot de passe
    const hash = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUND)
    );
    user.password = hash;

    // Sauvegarde des modifications dans la base de données
    await user.save();

    return res.json({ message: "User updated", data: user });
  } catch (err) {
    return res.status(500).json({ message: "Error updating user", error: err });
  }
});

router.delete("/:id", checkTokenexist, (req, res) => {
  let userId = parseInt(req.params.id);

  // Vérification si le champ id est présent et cohérent
  if (!userId) {
    return res.status(400).json({ message: "Missing parameter" });
  }

  // Suppression de l'utilisateur
  db.user
    .destroy({ where: { id: userId }, force: true })
    .then(() => res.status(204).json({}))
    .catch((err) =>
      res.status(500).json({ message: "Database Error", error: err })
    );
});

// 2ieme requete pour ajoute un users

router.post("/register", async (req, res) => {
  const { lastname, firstname, login, email, password } = req.body;

  // Validation des données reçues
  if (!lastname || !firstname || !login || !email || !password) {
    return res.status(400).json({ message: "Missing Data" });
  }

  try {
    // Vérification si l'utilisateur existe déjà
    const user = await db.user.findOne({ where: { email: email }, raw: true });
    if (user !== null) {
      return res
        .status(409)
        .json({ message: `The user ${lastname} already exists !` });
    }

    // Hashage du mot de passe utilisateur
    let hash = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUND)
    );
    req.body.password = hash;

    // Céation de l'utilisateur
    let userc = await db.user.create(req.body);
    return res.json({ message: "User Created", data: userc }), res.status(200);
  } catch (err) {
    if (err.name == "SequelizeDatabaseError") {
      res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(500).json({ message: "Hash Process Error", error: err });
  }
});

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
