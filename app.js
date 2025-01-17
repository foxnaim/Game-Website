const http = require("http");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// MIME-тип для статических файлов
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

// Обработка статических файлов
function Navigation(res, filePath, ext) {
  res.setHeader("Content-Type", mimeTypes[ext]);
  fs.readFile("./public" + filePath, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end("File not found");
      return;
    }
    res.end(data);
  });
}

// Создание сервера
http
  .createServer(function (req, res) {
    const url = req.url;
    console.log(url);

    // Обработка формы отправки email
    if (url === "/send-email" && req.method === "POST") {
      let body = "";

      // Сбор данных POST
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const formData = JSON.parse(body); // Парсинг JSON
          const { firstName, lastName, email, message } = formData;

          // Проверка на наличие всех данных
          if (!firstName || !lastName || !email || !message) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "All fields are required" }));
            return;
          }

          // Настройка Nodemailer
          const transporter = nodemailer.createTransport({
            service: "Gmail", // Или другой почтовый сервис
            auth: {
              user: "mksimantipev@gmail.com", // мой email
              pass: "oakb qeyb qvow athz", // Пароль приложения
            },
          });

          // Отправка email
          await transporter.sendMail({
            from: "mksimantipev@gmail.com",
            to: "recipient-email@gmail.com", // Кому отправить
            subject: `Message from ${firstName} ${lastName}`,
            text: message,
            html: `<p><strong>From:</strong> ${firstName} ${lastName}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Message:</strong> ${message}</p>`,
          });

          res.statusCode = 200;
          res.end(JSON.stringify({ success: "Email sent successfully" }));
        } catch (error) {
          console.error("Error sending email:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Failed to send email" }));
        }
      });

      return;
    }

    // Роутинг страниц
    switch (url) {
      case "/":
        console.log("Home page");
        Navigation(res, "/index.html", ".html");
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
        console.log("Contact page");
        Navigation(res, "/pages/Contacts.html", ".html");
        break;
      default:
        const extname = String(path.extname(url)).toLowerCase();
        if (extname in mimeTypes) {
          Navigation(res, url, extname);
        } else {
          res.statusCode = 404;
          res.end("Page not found");
        }
    }
  })
  .listen(3500, () => {
    console.log("Сервер работает ");
  });
