const http = require('http')
const fs = require('fs')
const path = require('path')
const ws = require('ws')
const express = require('express')
const Jimp = require('jimp')


const port = 9095

const app = express()
const server = http.createServer(app)
const wss = new ws.Server({server})

const width = 512
const height = 512

main()

async function main() {
  let pixelData
  try {
    console.log(11)
    img = await Jimp.read(path.join(__dirname, './pixel.png'))
  } catch(e) {
    console.log(e)
    console.log(22)
    img = new Jimp(width,height,0xffffffff)
  }

  let lastUpdate = 0
  setInterval(() => {
    let now = Date.now()
    if (now - lastUpdate < 3000) {
      img.write(path.join(__dirname,'./pixel.png'), () => {
        console.log('data has saved')
      })
    }
  }, 3000)

  wss.on('connection', (ws, req) => {
    img.getBuffer(Jimp.MIME_PNG, (err, buf) => {
      if (err) {
        console.log(err)
      } else {
        console.log(buf)
        ws.send(buf)
      }
    })
    wss.clients.forEach(ws => {
      // 在线人数，人来发一次
      ws.send(JSON.stringify({
          type: 'onlineCount',
          count: wss.clients.size,
      }))
    })

    // 人走也发一次
    ws.on('close', () => {
      // 向每一个在线用户发送
      wss.clients.forEach(ws => {
        ws.send(JSON.stringify({
          type: 'onlineCount',
          count: wss.clients.size,
        }))
      })
    });
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
          img.setPixelColor(Jimp.cssColorToHex(msg.color), msg.x, msg.y)
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
}





