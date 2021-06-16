// index.js

const express = require("express")
const PORT = process.env.PORT || 3001;
const path = require('path');
const app = express();
const { MongoClient } = require('mongodb')
//const uri = process.env.MONGODB_URI;
const uri =
"mongodb+srv://mdp38:PjoKKicu2ON4YsMl@triviaeast.numpm.mongodb.net/sample_mflix?retryWrites=true&w=majority";
app.use(express.static(path.join(__dirname, 'src')));

app.get("/api", (req, res) => {
    res.json({message: "Hello from server!"});
});

app.get("/api/movie", async (req, res) => {
    const client = new MongoClient(uri, {useUnifiedTopology:true});

    try {
        await client.connect();
        const database = client.db('sample_mflix');
        const collection = database.collection('movies');

        const query = { genres: "Comedy", poster: { $exists: true} };
        const cursor = await collection.aggregate([
        { $match: query },
        { $sample: {size: 1} },
        { $project:
            {
                title: 1,
                fullplot: 1,
                poster: 1
            }
        }
        ]);
        const movie = await cursor.next();
        return res.json(movie);
    } catch(err) {
        console.log(err);
    }
    finally {
        await client.close();
    }
});

app.get("/test", (req, res) => {
    res.json({message: "This is just a test"});
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

