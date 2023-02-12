const db = require("../database/db");
const { createValidation, delValidation, updateValidation } = require("./validation");



module.exports.create = async (req, res, next) => {
    const obj = await createValidation(req.body); 

    if (obj.err)
    {
        return res.status(422).send({ status : "error", msg : obj.err });
    }
    else 
    {
        db.query("select *  from post where uid=? order by puid desc limit 1", [req.session.uid], (err, results, fields) => {
            const puid = (results) ? ++results[0].puid : 1;
            let currentDate = new Date(Date.now()); // current date
            currentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() < 10) ? "0" + currentDate.getMonth() : currentDate.getMonth()}-${currentDate.getDate()}`;

            db.query("insert into post(title, content, puid, cdate, uid) values (?, ?, ?, ?, ?)", [obj.title, obj.content, puid, currentDate, req.session.uid], (err, results, fields) => {
                if (err) 
                {
                    console.log(err);
                    return;
                }

                res.status(200).send({ status : "success", msg : "successfully create the post" });
                return next();
            })
        })
    }
}


module.exports.del = async(req, res, next) => {
    const obj = await delValidation({ id : Number(req.body.id) });
    if (obj.err)
    {
        return res.status(422).send({ status : "error", msg : obj.err });
    }
    else 
    {
        db.query("select * from post where puid=? and uid=?", [obj.id, req.session.uid], (err, results, fields) => {
            if (err) 
            {
                console.log(err);
                return;
            }

            if (results.length == 0)
            {
                return res.status(400).send({ status : "error", msg : "invalid request" });
            }
            else 
            {
                db.query("delete from post where puid=? and uid=?", [obj.id, req.session.uid], (err, results, fields) => {
                    if (err)
                    {
                        console.log(err);
                        return;
                    }

                    res.status(200).send({ status : "success", msg : "successfully delete the post "});
                    return next();
                })
            }
        })
    }
}


module.exports.update = async(req, res, next) => {
    const obj = await updateValidation(req.body);
    if (obj.err)
    {
        return res.status(422).send({ status : "error", msg : obj.err });
    }
    else 
    {
        const puid = obj.id;
        db.query("select *  from post where puid=? and uid=?", [obj.puid, req.session.uid], (err, results, fields) => {
            if (err)
            {
                console.log(err);
                return;
            }

            if (results.length > 0)
            {
                db.query("update post set title=?, content=? where uid=? and puid=?", [obj.title, obj.content, req.session.uid, obj.puid], (err, results, fields) => {
                    if (err) 
                    {
                        console.log(err);
                        return;
                    }

                    res.status(200).send({ status : "success", msg : "successfully updated the post" });
                    return next();
                })
            }
            else 
            {
                return res.status(400).send({ status : "error", msg : "there is no post" });
            }
        })
    }
}


module.exports.loadPostUpdate = async (req, res, next) => {
    const { puid } = req.params;
    db.query("select * from post where puid=? and uid=? limit 1", [puid, req.session.uid], (err, results, fileds) => {
        if (err)
        {
            console.log(err);
            return;
        }

        if (results.length > 0) req.post = results[0];
        else return res.redirect("/");
        return next();
    })
}