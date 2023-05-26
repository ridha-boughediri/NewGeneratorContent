const express = require("express");
const app = express();
const router = require("./routes/users");
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
let DB = require("./db.config");

const routeMessages = require("./routes/messages");
const routeLogin = require("./routes/auth");

app.use(bodyParser.json());

app.use("/messages", routeMessages);

app.use("/auth", routeLogin);
app.use("/users", router);

const port = 8889; // Choose a different port number
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
