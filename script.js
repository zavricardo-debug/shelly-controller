function ligar() {

    fetch("https://shelly-37-eu.shelly.cloud/device/relay/control", {

        body: "channel=0&turn=on&timer=1&id=441793a5621c&auth_key=SUA_AUTH_KEY",

        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },

        method: "POST"

    })
    .then(response => response.text())
    .then(data => {

        console.log("Resposta:", data);

        document.getElementById("estado").innerText =
            "Resposta: " + data;

    })
    .catch(error => {

        console.error("Erro:", error);

        document.getElementById("estado").innerText =
            "Erro: " + error;

    });

}
