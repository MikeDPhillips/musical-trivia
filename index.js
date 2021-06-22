// index.js

const express = require("express");
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const path = require('path');

let app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const { MongoClient } = require('mongodb')

//const uri = process.env.MONGODB_URI;
const uri =
"mongodb+srv://mdp38:PjoKKicu2ON4YsMl@triviaeast.numpm.mongodb.net/trivia?retryWrites=true&w=majority";
//Get database connection object



app.use(express.static(path.join(__dirname, 'src')));


app.get("/api", (req, res) => {
    res.json({message: "Hello from server!"});
});

app.get("/api/history", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers","X-Requested-With");
    console.log("getting history");


    try {
        let client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        const database = client.db('trivia');
        console.log(database);
        const collection = database.collection('quiz_scores');
        collection.find().toArray()
            .then( results => {
                res.send(results);
            })
            .catch(error => {
                console.log(error);
                res.sendStatus(500);
            });

        //return res.json({message: "Connected to db!"});
    } catch(err) {
        console.log(err);
    }
});



app.get(['/', '/homepage.html'], (req, res) => {
   res.sendFile(path.join(__dirname, 'src/html/homepage.html'));
});

app.get('/genre.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html/genre.html'));
});

app.get('/play.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html/play.html'));
});
app.get('/stats.html', (req, res) => {

    res.sendFile(path.join(__dirname, 'src/html/stats.html'));
});


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

