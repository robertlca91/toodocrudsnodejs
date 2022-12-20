const express = require('express')
const path = require('path')
const fs = require('fs/promises')

const app = express()
app.use(express.json()) //  atiende todo tipo de peticiones

const jsonPath = path.resolve('./file/Toodos.json')

app.get('/tasks', async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, 'utf8')
  res.send(jsonFile)
})

// creacion de toodos

app.post('/tasKs', async (req, res) => {
  const jsonPost = req.body
  const arrayToodos = JSON.parse(await fs.readFile(jsonPath, 'utf8'))
  // dandole un id
  const lastId = arrayToodos[arrayToodos.length - 1].id + 1
  arrayToodos.push({ id: lastId, ...jsonPost }) // desestructuracion de array
  await fs.writeFile(jsonPath, JSON.stringify(arrayToodos))
  res.end()
})

app.put('/tasKs', async (req, res) => {
  const { status, id } = req.body // destructurando todo el array para conseguir el status y id
  const jsonPut = JSON.parse(await fs.readFile(jsonPath, 'utf8'))
  const putId = jsonPut.findIndex((toodos) => toodos.id === id)
  if (putId >= 0) {
    jsonPut[putId].status = status
  }
  await fs.writeFile(jsonPath, JSON.stringify(jsonPut))
  res.send('se logro modificar con exito')
})

app.delete('/tasKs', async (req, res) => {
  const deletejson = JSON.parse(await fs.readFile(jsonPath, 'utf8'))
  const { id } = req.body
  const deleteId = deletejson.findIndex((toodos) => toodos.id === id)
  if (deleteId >= 0) {
    deletejson.splice(deleteId, 1)
  }
  await fs.writeFile(jsonPath, JSON.stringify(deletejson))
  res.send('se logro eliminar el id correctamente')
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}`)
})
