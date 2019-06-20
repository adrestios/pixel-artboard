#pixel-artboard
## [DEMO](http://adrestios:5991)

## 说明
仿照B站夏日绘板写的像素画板，可以以鼠标位置自由缩放和拖拽，支持移动端拖拽缩放，使用 Websocket 让前后端进行交互，采取批量更新减少服务器压力，后端使用 Jimp 对图片进行读取和
修改处理，第一次通信传输二进制图片数据减少数据量，前端拿到数据转换为 canvas，之后传递坐标点进行画点。

## 截图
* PC端
  ![pc](https://github.com/adrestios/pixel-artboard/blob/master/README_IMG/PC%E7%AB%AF.png)
* 移动端
  ![移动](https://github.com/adrestios/pixel-artboard/blob/master/README_IMG/%E7%A7%BB%E5%8A%A8%E7%AB%AF.pngs)

## 启动
1. 安装依赖
```
yarn add
```
2. 启动
```
node app.js
```

## 所用技术
* canvas
* Vue
* WebSocket
* express
* Jimp