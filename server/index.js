// server/index.js

const express = require("express")
const PORT = process.env.PORT || 3001;
const path = require('path');
const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build/public')));

app.get("/api", (req, res) => {
    res.json({message: "Hello from server!"});
});

app.get("/test", (req, res) => {
    res.json({message: "This is just a test"});
});
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/public', 'index.html'))
});
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

