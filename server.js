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
app.use(express.static("public"));

// path to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// path to notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Connect back-end to front-end

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    }
    const dbData = JSON.parse(data);
    res.json(dbData);
  });
});

app.post("/api/notes", (req, res) => {
  const note = req.body;

  if (req.body) {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        note.id = uuidv4(); // unique id for each note
        const dataParsed = JSON.parse(data);
        dataParsed.push(note);
        fs.writeFile("./db/db.json", JSON.stringify(dataParsed), (err) => {
          err ? console.error(err) : console.log("Update Successful");
          res.json(note);
        });
      }
    });
  } else {
    console.error("Error adding tip");
  }
});

app.listen(PORT, () =>
  console.log(`Now listening at http://localhost:${PORT}`)
);
