require("dotenv").config();
const express = require('express');
const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const verifyToken = require("./middlewares/verifyToken");
const jwt = require("jsonwebtoken");
const app = express();
const router = jsonServer.router('db/contacts.json');
const middlewares = jsonServer.defaults();

app.use(bodyParser.json());
app.use(middlewares);

app.delete("/contacts/:id", verifyToken, (req, res, next) => {
  const user_id = req.user.id;
  const { contacts } = require('./db/contacts.json');
  const userContacts = contacts.filter(contact => contact.user_id === user_id);
  const contactIdToDelete = parseInt(req.params.id);
  console.log("contactIdToDelete", contactIdToDelete);
  const isUserContact = userContacts.find(contact => contact.id === contactIdToDelete);
  if (!isUserContact) {
    return res.status(403).send({ msg: 'You are not allowed to delete this contact' });
  }
  return next();
});


app.post("/contacts", verifyToken);

app.delete("/contacts/", verifyToken, (req, res, next) => {
  const user_id = req.user.id;
  const { contacts } = require('./db/contacts.json');
  const userContacts = contacts.filter(contact => contact.user_id === user_id);
  const { idsArr } = req.body;
  const userContants = [];

  if (!isUsersContacts) {
    return res.status(403).send({ msg: 'You are not allowed to delete this contact' });
  }
  return next();
});

app.get("/contacts", verifyToken, (req, res, next) => {
  const user_id = req.user.id;

  const { contacts } = require('./db/contacts.json');
  const userContacts = contacts.filter(contact => contact.user_id === user_id);

  if (req.method === 'GET') {
    return res.send(userContacts);
  }
  return next();
});


app.post("/login", (req, res) => {
  const { login, password } = req.body;
  if (login === "root" && password === "Default-123") {
    const token = jwt.sign({ id: 1, nickName: "root", login }, process.env.TOKEN_SECRET);
    return res.send({ token });
  }
  if (login === "user" && password === "Password-123") {
    const token = jwt.sign({ id: 2, nickName: "usr1", login }, process.env.TOKEN_SECRET);
    return res.send({ token });
  }
  return res.status(401).send({ msg: "Unathorized" });

});

app.get("/me", [verifyToken], (req, res) => {
  const { id, nickName } = req.user;
  return res.send({ id, nickName });
});

app.use(router);


const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
