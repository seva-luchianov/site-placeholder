const commandLineArgs = require('command-line-args');
const options = commandLineArgs([{
    name: "name",
    type: String,
    defaultValue: ""
}, {
    name: "message",
    type: String,
    defaultValue: "Is temporarily down"
}, {
    name: "port",
    type: Number,
    defaultValue: 3000
}]);
console.log("CLI OPTIONS:", options);

const express = require("express");
const app = express();
const main_page = require('path').join(__dirname, "index.html")

app.set('trust proxy', true);

require('util').promisify(require('fs').writeFile)(main_page,
    `<!DOCTYPE html>
    <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
    .centered {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-family: sans-serif;
        text-align: center;
    }
    </style>
    </head>
    <body style="background: #282c34;">
        <div class="centered">
            <div id="name" style="font-size: 24px;">${options.name}</div>
            <div style="font-size: 20px;">${options.message}</div>
        </div>
        <script>
            document.getElementById("name").innerText = document.getElementById("name").innerText || location.hostname;
        </script>
    </body>
    </html>`.split("\n").join("").split(" ").filter(x => x).join(" ") // Shitty minifier
).then(function() {
    app.get('/*', function(req, res) {
        res.sendFile(main_page);
    });

    app.listen(options.port, function() {
        console.log("Placeholder page being served on port", options.port);
    });
}).catch(console.error);