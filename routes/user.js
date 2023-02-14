const { Router } = require("express");
const { isAuthenticated } = require("../controllers/auth-ctr");
const { create, del, update, loadPostUpdate, myPosts, anyOnePosts, comment, like, dislike, isLiked } = require("../controllers/user-ctr");
const router = Router();



router.get("/create", isAuthenticated, (req, res) => {
    res.render("create", { title : "create", log : req.session.uid });
})

router.route("/create").post(isAuthenticated, create);

router.get("/posts", isAuthenticated, myPosts, (req, res) => { // load current user posts
    res.render("index", { title : "My Posts", log : req.session.uid, posts : req.posts });
})

router.get("/:user/posts", anyOnePosts, (req, res) => { // load other one posts (according to :user)
    res.render("index", { title : `${req.params.user}'s Posts`, log : req.session.uid, posts : req.posts });
})

router.get("/posts/:puid/update", isAuthenticated, loadPostUpdate, (req, res) => {
    res.render("update", { title : "Update", log : req.session.uid, puid : req.params.puid, post : req.post });
})

router.route("/update").post(isAuthenticated, update);

router.route("/delete").post(isAuthenticated, del);

router.route("/comment").post(comment);

router.route("/like").post(like);

router.route("/dislike").post(dislike);

router.route("/isliked").get(isLiked);



module.exports = router;