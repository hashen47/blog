const db = require("../database/db");
const { Router } = require("express");
const router = Router();
const { login, register, logout } = require("../controllers/auth-ctr");


/* routes */
router.get("/login", (req, res) => {
    res.render("login", { title : "Login" });
})

router.route("/login").post(login);

router.get("/register", (req, res) => {
    res.render("register", { title : "Register" });
})

router.route("/register").post(register);

router.route("/logout").get(logout);


module.exports = router;