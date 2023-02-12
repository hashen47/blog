window.addEventListener("load", () => {

    const loginBtn = document.getElementById("login-btn");
    const uInput = document.getElementById("username");
    const pInput = document.getElementById("password");
    const rInput = document.getElementById("remember");


    loginBtn.addEventListener("click", e => {
        console.log("happend");
        (async () => {
            try 
            {
                const response = await fetch("/auth/login", {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({
                        username : uInput.value,
                        password : pInput.value,
                        remember : rInput.checked
                    })
                });

                // get the response
                const resp = await response.json();
                console.log(resp);
                alert(resp.msg);
                if (resp.status == "success")
                {
                    console.log("here");
                    window.open("/", "_self"); // if user is successfully login user redirect to the index page
                }
            }
            catch(err)
            {
                console.log(err);
                return;
            }
        })();
    })
})