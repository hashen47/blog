const bcrypt = require("bcryptjs");
const db = require("../database/db");
const { loginValidation, registerValidation } = require("./validation");



module.exports.login = async (req, res, next) => {
    let obj = await loginValidation(req.body);
    if (obj.err)
    {
        res.status(400).json({ status : "error", msg : obj.err });
        return next();
    }


    db.query("select * from user where name=?", [obj.username], (err, results, fields) => {
        if (err) console.log(err); // for debugging
        if (results.length == 0) return res.status(422).json({ status : "error", msg : "username doesn't exists" });

        (async () => {
            const hash = results[0].hash;
            const result = await bcrypt.compare(obj.password, hash); 

            if (result) 
            {
                req.session.regenerate(err => {
                    if (err)
                    {
                        console.log(err);
                        return next(err);
                    }

                    req.session.uid = results[0].uid;
                    req.session.username = results[0].name;
                    if (obj.remember) req.session.cookie.maxAge = 12 * 60 * 60 * 1000; // 12 hours

                    req.session.save(err => {
                        if (err)
                        {
                            console.log(err);
                            return next(err);
                        }
                        res.status(200).json({ status : "success", msg : "logged" });
                        return next();
                    })
                })
            }
            else
            {
                return res.status(422).json({ status : "error", msg : "username and password combination is wrong" });
            }

        })();
    })
}


module.exports.register = async (req, res, next) => {
    let obj = await registerValidation(req.body);
    if (obj.err)
    {
        res.status(400).json({ status : "error", msg : obj.err });
        return next();
    }


    db.query("select * from user where name=? or email=?", [obj.username, obj.email], (err, results, fields) => {
        if (err) console.log(err); // for debugging
        if (results.length != 0) return res.status(422).json({ status : "error", msg : "username is already exists" });

        (async() => {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(obj.password, salt);

            db.query("insert into user(name, hash, email) values (?, ?, ?)", [ obj.username, hash, obj.email ], (err, results, fields) => {
                if (err) console.log(err);
                res.status(200).json({ status : "success", msg : "successfully registered" });
                return next();
            });
        })();
    })
}


module.exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err)
        {
            console.log(err);
            return next(err);
        }

        res.clearCookie("connect.sid", { path : "/" });
        res.redirect("/auth/login");
    })
}


module.exports.isAuthenticated = (req, res, next) => {
    if (!req.session.username && !req.session.uid)
    {
        return res.redirect("/auth/login");
    }

    next();
}