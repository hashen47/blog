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
                if (resp.status == "success") window.location.reload();
            })();
        })
    })
})