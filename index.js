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
app.get("/", (req, res) => {
    res.status(200).render("index", { title : "posts" , log : req.session.uid });
})

const auth = require("./routes/auth"); // auth route
app.use("/auth", auth);

const user = require("./routes/user"); // user route
app.use("/user", user);


// listening
app.listen(port, () => {
    console.log(`Listening in ${port}`);
})
