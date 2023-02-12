const { Router } = require("express");
const { isAuthenticated } = require("../controllers/auth-ctr");
const { create, del, update, loadPostUpdate } = require("../controllers/user-ctr");
const router = Router();


router.use("/", isAuthenticated); // user should logged to go to any route of /user

router.get("/create", (req, res) => {
    res.render("create", { title : "create", log : req.session.uid });
})

router.route("/create").post(create);

router.get("/:user/posts", (req, res) => {
    res.render("index", { title : "create", log : req.session.uid });
})

router.get("/posts/:puid/update", loadPostUpdate, (req, res) => {
    res.render("update", { title : "Update", log : req.session.uid, puid : req.params.puid, post : req.post });
})

router.route("/update").post(update);



module.exports = router;