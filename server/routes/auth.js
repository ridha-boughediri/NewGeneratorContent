const express = require("express");

const bcrypt = require("bcrypt");

let router = express.Router();

const db = require("../db.config");

const user = require("../models/user");

const jwt = require("jsonwebtoken");

// mon middleware pour la connexion selon la route

router.use((req, res, next) => {
  const event = new Date();

  console.log("AUTH Time:", event.toString());
  next();
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // je valide les données recus

  if (!email || !password) {
    return res.status(400).json({ message: "email ou mot de passe incorect" });
  }

  // trouver l user si il existe dans la database

  db.user
    .findOne({ where: { email: email }, raw: true })
    .then((user) => {
      // si l'utilisateur existe
      if (user === null) {
        return res
          .status(401)
          .json({ message: "le  compte lier a ce mail n'existe pas !" });
      }

      //check le mot de passe

      bcrypt
        .compare(password, user.password)
        .then((test) => {
          if (!test) {
            return res.status(401).json({ message: "mot de passe incorect" });
          }
          // generer le jwt token
          const putaindetoken = jwt.sign(
            {
              // les infos que je veux envoyés

              id: user.id,
              lastname: user.lastname,
              firstname: user.firstname,
              email: user.email,
              role_id: user.role_id,
              // etape suivante jwt.sign({payload}, secret phrase, temps expiration)
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_DURING }
          );
          return res.json({ access_token: putaindetoken });
        })
        .catch((err) =>
          res.status(500).json({ message: "Database Error", error: err })
        );
    })
    .catch((err) =>
      res.status(500).json({ message: "Database Error", error: err })
    );
});

module.exports = router;
