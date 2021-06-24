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

const uri = process.env.MONGODB_URI;
//const uri =
//"mongodb+srv://mdp38:PjoKKicu2ON4YsMl@triviaeast.numpm.mongodb.net/trivia?retryWrites=true&w=majority";
//Get database connection object
let collection = null;
let client = MongoClient.connect(uri, { useUnifiedTopology: true })
    .then( (connection) => {
        const database = connection.db('trivia');
        collection = database.collection('quiz_scores');
    })

app.use(express.static(path.join(__dirname, 'src')));


app.get("/api", (req, res) => {
    res.json({message: "Hello from server!"});
});

app.post('/submit', (req, res) => {
    console.log(req.body)
    // let name = req.body.name;
    // let score = req.body.score;
    // let correct = req.body.correct;
    // let genre = req.body.genre;
    let objToInsert = {
       name:req.body.name,
       score:req.body.score,
       correct:req.body.correct,
       genre:req.body.genre
    }
    collection.insertOne(objToInsert)
        .then( result => {
          let objToReturn = {
            "success" : "Database has been updated",
            "status": 200,
            "data": objToInsert
          };
          res.send(JSON.stringify(objToReturn));
          console.log(objToReturn);
        })

});
app.get("/api/history", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers","X-Requested-With");
    console.log("getting history");
    try {
        collection.find().toArray()
            .then( results => {
                results.forEach( (item) => {

                    let timeStamp = parseInt(item._id.toString().substr(0,8), 16)*1000
                    let date = new Date(timeStamp);
                        item['date'] = date.toISOString().split('T')[0];
                        console.log(item['date'] );
                });
                console.log(results);
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

