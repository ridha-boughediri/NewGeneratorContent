// import du package nessaire

const jwt = require("jsonwebtoken");
// extraire le token
const extractBearer = (authorization) => {
  if (typeof authorization !== "string") {
    return false;
  }

  // On isole le token de l ensemble dela data

  const matches = authorization.match(/(bearer)\s+(\S+)/i);

  return matches && matches[2];
};

// je check si il y a un token

const checkTokenexist = (req, res, next) => {
  const token =
    req.headers.authorization && extractBearer(req.headers.authorization);

  // mes console log

  console.log("HEADERS:", req.headers);
  console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({ message: "slt petit loup" });
  }

  // verifier la durée et la validité du token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodeToken) => {
    if (err) {
      return res.status(401).json({ message: "mauvais token" });
    }

    next();
  });
};

module.exports = checkTokenexist;
