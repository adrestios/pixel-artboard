const http = require('http')
const fs = require('fs')
const path = require('path')
const ws = require('ws')
const express = require('express')

const port = 9095

const app = express()
const server = http.createServer(app)
const wss = new ws.Server({server})

const width = 50
const height = 50
let pixelData
try {
  pixelData = require('./pixel.json')
} catch(e) {
  pixelData = new Array(height).fill(0).map(it => new Array(width).fill('white'))
}

setInterval(() => {
  fs.writeFile(path.join(__dirname, './pixel.json'), JSON.stringify(pixelData), (err) => {
    console.log('data has saved')
  })
}, 3000)

wss.on('connection', (ws, req) => {
  ws.send(JSON.stringify({
    type: 'init',
    pixelData: pixelData,
  }))

  let lastDraw = 0

  ws.on('message', msg => {
    msg = JSON.parse(msg)
    let now = Date.now()

    if (msg.type === 'drawDot') {
      if (now - lastDraw < 10) {
        return
      }
      if (msg.x >= 0 && msg.x < width && msg.y >= 0 && msg.y < height) {

        lastDraw = now

        pixelData[msg.y][msg.x] = msg.color
        wss.clients.forEach(client => {
          client.send(JSON.stringify({
            type: 'updateDot',
            x: msg.x,
            y: msg.y,
            color: msg.color,
          }))
        })
      }
    }
  })
})

app.use(express.static(path.join(__dirname, './static')))

server.listen(port, () => {
  console.log('server listen on port ', port)
})



