const express = require('express')
const fs = require('fs');
const { router, guardarDatos } = require('./scraping')
const app = express()

let noticias

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function leerDatos() {
    try {
        const data = fs.readFileSync('noticias.json', 'utf-8');
        noticias = JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo noticias.json:', error.message);
    }
}

app.get('/', (req, res) => {
    leerDatos()
    res.send(noticias)
})

app.get('/scraping', router, (req, res) => {
    res.send('Scraping completado');
})

app.get('/:index', (req, res) => {
    const index = req.params.index
    leerDatos()
    res.json(noticias[index])
    res.send(noticias[index])
})

app.post('/', (req, res) => {
    leerDatos()
    const nuevaNoticia = {
        titulo: req.body.titulo || '',
        img: req.body.img || '',
        descripcion: req.body.descripcion || '',
        enlace: req.body.enlace || ''
    }
    noticias.push(nuevaNoticia)
    guardarDatos(noticias)
})

app.put('/:index', (req, res) => {
    const index = req.params.index
    leerDatos()
    noticias[index] = {
        titulo: req.body.titulo || noticias[index].titulo,
        img: req.body.img || noticias[index].img,
        descripcion: req.body.descripcion || noticias[index].descripcion,
        enlace: req.body.enlace || noticias[index].enlace
    }
    guardarDatos(noticias)
})

app.delete('/:index', (req, res) => {
    const index = req.params.index
    leerDatos()
    const noticiaEliminada = noticias.splice(index, 1)
    guardarDatos(noticias)
    res.json(noticiaEliminada[0])
    res.send(noticiaEliminada[0])
})

app.listen(3000, () => {
    console.log('Express está escuchando en el puerto http://localhost:3000/')
})