const express = require('express');
const path = require('path');

const app = express();

<<<<<<< Updated upstream
app.use("/static", express.static(path.resolve(__dirname, "static")))

app.get("/languages/*", (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
})

app.get("/components/*", (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
})


app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
=======
app.use('/static', express.static(path.resolve(__dirname, 'static'))); // eslint-disable-line

app.get('/languages/*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path)); // eslint-disable-line
});

app.get('/components/*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path)); // eslint-disable-line
});


app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html')); // eslint-disable-line
>>>>>>> Stashed changes
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});