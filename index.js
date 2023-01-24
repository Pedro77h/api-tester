const fs = require("fs");
const pexels = require("pexels");
const { callbackify } = require("util");

const apiKey = "563492ad6f917000010000011856437eec2e4c2fbc2f17885e7272f4";


fs.readFile("res/pratos.txt", "utf-8", (err, data) => {
    if (err) {
        return err;

    } else {
        const listaPratos = data.split("\n");
        const descricao = fs.readFileSync("res/desc.txt", "utf-8");
        const preco = Math.floor(Math.random() * 100);
        let imagem = ""

        listaPratos.forEach(prato => {
            fetch(`https://api.pexels.com/v1/search?query=${prato}&per_page=1&locale=pt-BR`, {
                headers: {
                    Authorization: apiKey
                }
            })
            .then(response => response.json())
            .then(data => {
                imagem += data.photos[0].src.large
            })
            fetch("localhost:8000/api/pratos/criar", {
                method: 'POST',
                body: JSON.stringify({
                    nome: prato,
                    descricao: descricao,
                    preco: preco,
                    imagem:
                })
            })
            prato = prato.toLowerCase().replace(/\s/g, "-")
            console.log(prato)
        });
    };
});


