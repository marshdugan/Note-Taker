const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let db = require("./db/db.json");


app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    return res.json(db);
});

app.post("/api/notes", function(req, res) {
    const newNote = req.body;
    newNote.id = db.length - 1;

    db.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(db), error => {
        if (error) throw error;
    });
    res.json(newNote);
});


app.delete("/api/notes/:id", function(req, res) {
    resetIds();
    const chosen = parseInt(req.params.id);
    for (let i = 0; i < db.length; i++) {
        if (chosen === db[i].id) {
            db.splice(chosen, 1)
            fs.writeFile("./db/db.json", JSON.stringify(db), error => {
                if (error) throw error;
            });
            return res.json(db);
        }
    }
    return res.json(false);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


function resetIds() {
    for (let i = 0; i < db.length; i++) {
        db[i].id = i;
    }
}



//Listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
