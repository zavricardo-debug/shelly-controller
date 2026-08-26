function ligar() {

    fetch("https://shelly-37-eu.shelly.cloud/device/relay/control", {

        method: "POST",

        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },

        body: "channel=0&turn=on&timer=1&id=441793a5621c&auth_key=COLOQUE_AQUI_A_SUA_AUTH_KEY"

    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("estado").innerText = "Ligado";
    })
    .catch(error => {
        console.error(error);
        document.getElementById("estado").innerText = "Erro";
    });

}
