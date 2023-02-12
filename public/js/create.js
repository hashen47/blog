window.addEventListener("load", () => {

    const btn = document.getElementById("create");
    const title = document.getElementById("title");
    const content = document.getElementById("content");

    btn.addEventListener("click", e => {
        (async() => {
            const response = await fetch("/user/create", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    title : title.value,
                    content : content.value
                })
            });

            const resp = await response.json();

            alert(resp.msg);
            if (resp.status == "success") window.location.reload();
        })()
    })

})