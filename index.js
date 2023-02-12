require("dotenv").config(); // configure the environment variables
const express = require("express");


// database connection
db = require("./database/db");
db.connect(err => {
    if (err)
    {
        console.log(err); // for debugging
        return;
    }
})


// application
const app = express();
const port = process.env.PORT || 3000;


// initialize the view engine
app.set("view engine", "pug");
app.set("views", "./views");


// configure the session
const session = require("express-session");
app.use(session({
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure : false // in the production this should change to true
    }
}))


// middlewares
app.use("/static", express.static("./public"));
app.use(express.json());


// routes
const auth = require("./routes/auth");
app.use("/", auth);


// listening
app.listen(port, () => {
    console.log(`Listening in ${port}`);
})
