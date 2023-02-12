const db = require("../database/db");
const { Router } = require("express");
const router = Router();
const { login, register, isAuthenticated, logout } = require("../controllers/auth-ctr");


/* routes */
router.get("/", (req, res) => {
    res.render("login", { title : "Login" });
})

router.route("/").post(login);

router.get("/register", (req, res) => {
    res.render("register", { title : "Register" });
})

router.route("/register").post(register);

router.get("/posts", isAuthenticated, (req, res) => {
    res.status(200).send("Index Page");
})

router.route("/logout").get(logout);


module.exports = router;