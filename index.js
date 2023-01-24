const fs = require("fs");
const express = require("express");
const axios = require("axios")

const app = express();

const apiKey = "22354030-9c40933fae4229fc0bc98a962";


async function obterImagem(prato) {
    try {
        const imagem = await axios(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(prato)}`)
        return Promise.resolve(imagem.data.hits[0].largeImageURL);

    } catch (err) {
        return "https://pixabay.com/get/gb62aad10eb6a4ca3c888f2a2820388f19f31f29ad35a3fa2176e40a02f878c9d79ecc5b7b3fb1a9786c34b4f58f5f2139888dd78b48565fbba7e128b2d310df9_1280.jpg"
    }
}

console.log(obterImagem("apple"))

function obterDescricao() {
    return fs.readFileSync("res/desc.txt", "utf-8");
}

function obterPreco() {
    return Math.floor((Math.random() * 100));
}

async function criarPrato(obj) {
    const prato = await fetch("http://localhost:8000/api/pratos/criar", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(obj)
    })
    .then(response => response.json())
    .then(data => {
        app.use("/", (req, res) => {
            res.status(200).send(data);
        })
    })
    return await Promise.resolve(prato);
}

async function criarPratos() {
    const listaPratos = fs.readFileSync("res/pratos.txt", "utf-8").split("\n");
    const promises = listaPratos.map(async(prato) => {
        
        prato = prato.charAt(0).toUpperCase() + prato.slice(1);

        return await criarPrato({
            nome: prato,
            descricao: obterDescricao(),
            preco: obterPreco(),
            imagem: await obterImagem(prato)
        })
    })
    return await Promise.all(promises);
}

criarPratos();


app.listen(4000, () => {
    console.log("localhost:4000")
})
