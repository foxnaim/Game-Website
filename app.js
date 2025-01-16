const http = require("http");
const fs = require("fs");
const path = require("path");

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".woff": "application/font-woff",
  ".ttf": "application/font-ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "application/font-otf",
  ".wasm": "application/wasm",
};

function Navigation(res, filePath, ext) {
  res.setHeader("Content-Type", mimeTypes[ext]); // Исправлено "setHeader"
  fs.readFile("./public" + filePath, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end("File not found");
      return;
    }
    res.end(data);
  });
}

http
  .createServer(function (req, res) {
    let url = req.url;
    console.log(url);
    switch (url) {
      case "/":
        console.log("home page");
        Navigation(res, "/index.html", ".html"); // Исправлено путь
        break;
      case "/AboutUs":
        console.log("About page");
        Navigation(res, "/pages/AboutUs.html", ".html");
        break;
      case "/Portfolio":
        console.log("Portfolio page");
        Navigation(res, "/pages/Portfolio.html", ".html");
        break;
      case "/News":
        console.log("News page");
        Navigation(res, "/pages/News.html", ".html");
        break;
        case "/btn":
          console.log("btn page");
          Navigation(res, "/pages/Contacts.html", ".html");
          break;
      default:
        const extname = String(path.extname(url)).toLowerCase();
        if (extname in mimeTypes) {
          Navigation(res, url, extname); // Используем Navigation для статических файлов
        } else {
          res.statusCode = 404;
          res.end("Page not found");
        }
    }
  })
  .listen(3500, () => {
    console.log("сервер работает");
  });
