const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
        const filePath = path.join(__dirname, "index.html");
        fs.readFile(filePath, (err, content) => {
            if (err) return res.end("Error");
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(content);
        })
    } else if (req.url === "/messages") {
        if (req.method === "GET") {
            fs.readFile(path.join(__dirname, "messages.json"), (err, data) => {
                if (err) return res.end("[]");
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(data);
            })
        } else if (req.method === "POST") {
            let body = ""
            req.on("data", chunk => body += chunk);
            req.on("end", () => {
                const newMessage = JSON.parse(body);
                fs.readFile(path.join(__dirname, "messages.json"), (err, data) => {
                    const messages = err ? [] : JSON.parse(data);
                    messages.push(newMessage);
                    fs.writeFile(path.join(__dirname, "messages.json"), JSON.stringify(messages, null, 2), () => {
                        res.writeHead(200, {"Content-Type": "application/json"});
                        res.end(JSON.stringify(newMessage));
                    })
                })
            })
        }
    } else if (req.url.startsWith("/public")) {
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, content) => {
            if (err) return res.end("Error");

            let contentType = "text/plain"; // default
            if (filePath.endsWith(".css")) contentType = "text/css";
            else if (filePath.endsWith(".js")) contentType = "application/javascript";
            else if (filePath.endsWith(".html")) contentType = "text/html";

            res.writeHead(200, {"Content-Type": contentType});
            res.end(content);
        });
    } else {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("Sidan hittades inte");
    }
})

server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));