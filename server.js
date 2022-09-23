//  Require Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// settings up express and port
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// use public folder
app.use(express.static("public"));

// path to notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// path to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// get db.json data
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    }
    const sendData = JSON.parse(data);
    res.json(sendData);
  });
});

// update db.json
app.post("/api/notes", (req, res) => {
  req.body.id = uuidv4();
  const newNote = req.body;
  notes.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes }, null, 2)
  );
  res.json(notes);
});
// Delete notes
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const noteIndex = notes.findIndex((n) => n.id == id);
  notes.splice(noteIndex, 1);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes }, null, 2)
  );
  res.json(notes);
});

app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
