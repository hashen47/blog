window.addEventListener("load", () => {
    const deleteBtns = document.querySelectorAll(".delete");
    const commentBtns = document.querySelectorAll(".comment");

    // delete a post
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", e => {
            if (window.confirm("Do you want to delete this post?"))
            {
                (async() => {
                    try
                    {
                        const response = await fetch("/user/delete", {
                            method : "POST",
                            headers : {
                                "Content-Type" : "application/json"
                            },
                            body : JSON.stringify({
                                pid : e.target.getAttribute("pid")
                            })
                        });

                        let resp = await response.json();
                        console.log(resp.msg);
                        alert(resp.msg);

                        if (resp.status == "success") window.location.reload();
                    }
                    catch(err)
                    {
                        console.log(err);
                        return;
                    }
                })();
            }
            else 
            {
                alert("post is not deleted");
            }
        })
    })

    // create a comment to a post
    commentBtns.forEach(btn => {
        btn.addEventListener("click", e => {
            (async() => {
                const pid = btn.closest("div").getAttribute("pid");
                const commentText = btn.previousElementSibling.value;

                const response = await fetch("/user/comment", {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({
                        pid : pid,
                        comment : commentText    
                    })
                });

                const resp = await response.json();

                console.log(resp.msg);
                if (resp.status == "error") alert(resp.msg);
                if (resp.status == "success") window.location.reload();
            })();
        })
    })

    // like to the post
    // to like a post you should click dislike icon
    document.querySelectorAll(".dislike").forEach(svg => { 
        svg.addEventListener("click", e => {
            const pid = svg.closest("div").getAttribute("pid");

            (async() => {
                const response = await fetch("/user/like", {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({
                        pid : pid
                    })
                })

                const resp = await response.json();
                if (resp.status == "success") window.location.reload();
                else if (resp.status == "error") alert(resp.msg);
            })();
        })
    })

    // dislike to the post
    // to dislike a post you should click like icon
    function dislike() 
    {
        document.querySelectorAll(".like").forEach(svg => {
            svg.addEventListener("click", e => {
                const pid = svg.closest("div").getAttribute("pid");

                (async() => {
                    const response = await fetch("/user/dislike", {
                        method : "POST",
                        headers : {
                            "Content-Type" : "application/json"
                        },
                        body : JSON.stringify({
                            pid : pid
                        })
                    })

                    const resp = await response.json();
                    if (resp.status == "success") window.location.reload();
                    else if (resp.status == "error") alert(resp.msg);
                })();
            })
        })
    }


    // check if current user like or dislike to a post
    async function isLiked()
    {
        const response = await fetch("/user/isliked");
        let resp = await response.json();

        document.querySelectorAll(".like").forEach(like => {
            if (resp.pids.includes(like.closest("div").getAttribute("pid"))) 
            {
                like.style.display = "inherit";
                like.nextElementSibling.style.display = "none";
            }
            else 
            {
                like.nextElementSibling.style.display = "inherit";
            }
        })

        dislike();
    }

    isLiked();
})