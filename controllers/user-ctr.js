const db = require("../database/db");
const { createValidation, delValidation, updateValidation, commentValidation } = require("./validation");



module.exports.create = async (req, res, next) => {
    const obj = await createValidation(req.body); 

    if (obj.err)
    {
        return res.status(422).send({ status : "error", msg : obj.err });
    }
    else 
    {
        db.query("select *  from post where uid=? order by puid desc limit 1", [req.session.uid], (err, results, fields) => {
            const puid = (results.length > 0) ? ++results[0].puid : 1;
            let currentDate = new Date(Date.now()); // current date
            currentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() < 10) ? "0" + currentDate.getMonth() : currentDate.getMonth()}-${currentDate.getDate()}`; // date like 2023-02-13

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


// delete the post
module.exports.del = async(req, res, next) => {
    console.log(req.body.pid);
    const obj = await delValidation({ pid : Number(req.body.pid) });
    if (obj.err)
    {
        return res.status(422).send({ status : "error", msg : obj.err });
    }
    else 
    {
        db.query("select * from post where pid=? and uid=?", [Number(obj.pid), req.session.uid], (err, results, fields) => {
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
                db.query("delete from post where pid=? and uid=?", [Number(obj.pid), req.session.uid], (err, results, fields) => {
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


// update the post with the user given new data
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


// load the post to update
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


// load the all posts to the index page
module.exports.allPosts  = (req, res, next) => {
    const query = `
        select u.name, u.uid as userid, p.*, (select count(*) from plike where pid=p.pid) as likes 
        from post as p inner join user as u on u.uid=p.uid
        order by p.pid desc
    `;

    db.query(query, (err, results, fields) => {
        if (err)
        {
            console.log(err);
            return;
        }

        // add comment to the result (result means post object)
        db.query("select * from comment order by cid desc", (err, comments, fields) => {
            results = JSON.parse(JSON.stringify(results));
            comments = JSON.parse(JSON.stringify(comments));

            for (let i in results)
            {
                results[i].comments = [];
                for (let j in comments)
                {
                    if (comments[j].pid == results[i].pid) results[i].comments.push(comments[j]);
                }
            }

            if (results.length > 0) req.posts = results;
            else req.posts = [];
            return next();
        })
    })
}


// load only posts that user have
module.exports.myPosts = (req, res, next) => {
    const query = `
        select u.name, u.uid as userid, p.*, (select count(*) from plike where pid=p.pid) as likes 
        from post as p inner join user as u on u.uid=p.uid
        where u.uid=?
        order by p.pid desc
    `;

    db.query(query, [req.session.uid], (err, results, fields) => {
        if (err)
        {
            console.log(err);
            return;
        }

        // add comment to the result (result means post object)
        db.query("select * from comment order by cid desc", (err, comments, fields) => {
            results = JSON.parse(JSON.stringify(results));
            comments = JSON.parse(JSON.stringify(comments));

            for (let i in results)
            {
                results[i].comments = [];
                for (let j in comments)
                {
                    if (comments[j].pid == results[i].pid) results[i].comments.push(comments[j]);
                }
            }
            
            if (results.length > 0) req.posts = results;
            else req.posts = [];
            return next();
        })
    })
}


// load anyone posts according to the req.params.user
module.exports.anyOnePosts = (req, res, next) => {
    const { user } = req.params;
    const query = `
        select u.name, u.uid as userid, p.*, (select count(*) from plike where pid=p.pid) as likes 
        from post as p inner join user as u on u.uid=p.uid
        where u.name=?
        order by p.pid desc
    `;

    db.query(query, [user], (err, results, fields) => {
        if (err)
        {
            console.log(err);
            return;
        }

        // add comment to the result (result means post object)
        db.query("select * from comment order by cid desc", (err, comments, fields) => {
            results = JSON.parse(JSON.stringify(results));
            comments = JSON.parse(JSON.stringify(comments));

            for (let i in results)
            {
                results[i].comments = [];
                for (let j in comments)
                {
                    if (comments[j].pid == results[i].pid) results[i].comments.push(comments[j]);
                }
            }
            
            if (results.length > 0) req.posts = results;
            else req.posts = [];
            return next();
        })
    })
}


module.exports.comment = async(req, res, next) => {
    if (!req.session.uid) res.status(422).send({ status : "error", msg : "Can't comment without login first" });

    const obj = await commentValidation(req.body);
    if (obj.err)
    {
        return res.status(422).send({ status : "error", msg : obj.err });
    }
    else 
    {
        db.query("insert into comment(text, pid, uid) values (?, ?, ?)", [obj.comment, obj.pid, req.session.uid], (err, results, fields) => {
            if (err)
            {
                console.log(err);
                return;
            }
            else 
            {
                return res.status(200).send({ status : "success", msg : "successfully added the comment" });
            }
        })
    }
}

