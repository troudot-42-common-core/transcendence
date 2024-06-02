const express = require('express');
const path = require('path');

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")))

app.get("/languages/*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", req.path));
})

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

app.listen(process.env.PORT || 1234, () => {
    console.log("Server running on http://localhost:1234");
});