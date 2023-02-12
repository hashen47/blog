window.addEventListener("load", () => {
    const btn = document.querySelector(".btn");
    const uInput = document.getElementById("username");
    const pInput = document.getElementById("password");
    const rpInput = document.getElementById("re-password");
    const eInput = document.getElementById("email"); 


    btn.addEventListener("click", e => {
        try
        {
            (async () => {
                const response = await fetch("/auth/register", {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({
                        username : uInput.value,
                        password : pInput.value,
                        re_password : rpInput.value,
                        email : eInput.value
                    })
                });

                const resp = await response.json();

                console.log(resp);
                alert(resp);
                if (resp.status == "success") window.location.reload();

            })();
        }
        catch(err)
        {
            console.log(err);
            return;
        }
    })
})