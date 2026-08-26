function ligar() {

    document.getElementById("estado").innerText =
        "A ligar...";

    fetch("https://shelly-37-eu.shelly.cloud/device/relay/control", {
        method: "POST",

        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },

        body: "channel=0&turn=on&timer=1&id=441793a5621c&auth_key=COLOQUE_AQUI_A_SUA_AUTH_KEY"

    })
    .then(async response => {

        const resultado = await response.text();

        console.log("Status:", response.status);
        console.log("Resposta Shelly:", resultado);

        if (!response.ok) {
            throw new Error(
                "Erro HTTP " +
                response.status +
                ": " +
                resultado
            );
        }

        document.getElementById("estado").innerText =
            "🟢 Shelly ligado";

    })
    .catch(error => {

        console.error("ERRO:", error);

        document.getElementById("estado").innerText =
            "❌ " + error.message;

    });

}
