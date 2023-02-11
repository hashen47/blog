const express = require("express");


// application
const app = express();
const port = process.env.PORT || 3000;


// simple route
app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
})


// listening
app.listen(port, () => {
    console.log(`Listening in ${port}`);
})
