import fs from "fs";
import express from "express";
import axios from "axios";

const app = express();

const apiKey = "22354030-9c40933fae4229fc0bc98a962";

async function obterImagem(prato) {
  try {
    const { data } = await axios(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(prato)}`
    );
    return data.hits[0].largeImageURL;
  } catch (err) {
    return "https://pixabay.com/get/gb62aad10eb6a4ca3c888f2a2820388f19f31f29ad35a3fa2176e40a02f878c9d79ecc5b7b3fb1a9786c34b4f58f5f2139888dd78b48565fbba7e128b2d310df9_1280.jpg";
  }
}

async function obterDescricao() {
  const index = (Math.random() * (4 - 0) + 0).toFixed();

  const { data } = await axios.get(
    "https://baconipsum.com/api/?type=meat-and-filler"
  );

  return data[index];
}

function obterPreco() {
  return Math.floor(Math.random() * 100);
}

async function criarPrato(obj) {
  const { data } = await axios.post("http://localhost:8000/api/pratos/criar");

  app.get("/", (req, res) => {
    res.status(200).send(data);
  });

  return await Promise.resolve(data);
}

async function criarPratos() {
  const listaPratos = fs.readFileSync("res/pratos.txt", "utf-8").split("\n");
  const promises = listaPratos.map(async (prato) => {
    prato = prato.charAt(0).toUpperCase() + prato.slice(1);

    return await criarPrato({
      nome: prato,
      descricao: obterDescricao(),
      preco: obterPreco(),
      imagem: await obterImagem(prato),
    });
  });
  return await Promise.all(promises);
}

criarPratos();

app.listen(4000, () => {
  console.log("localhost:4000");
});
