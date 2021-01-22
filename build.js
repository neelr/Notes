var fs = require('fs');
var path = require('path');
var mark = require("marked-katex")

const exclude = [
    ".vercel",
    ".vscode",
    ".git",
    ".gitignore",
    "build.js",
    "automate",
    ".DS_Store",
    "out",
    "node_modules",
    "package-lock.json",
    "package.json"
].map(v => `${__dirname}/${v}`)

var walk = (dir, done) => {
    var results = [];
    var directories = {}
    fs.readdir(dir, (err, list) => {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        directories[dir] = []
        list.forEach((file) => {
            file = path.resolve(dir, file);
            fs.stat(file, (err, stat) => {
                if (stat && stat.isDirectory()) {
                    if (!exclude.includes(file)) {
                        directories[dir].push(file)
                        walk(file, (err, res, folders) => {
                            directories = { ...directories, ...folders }
                            results = results.concat(res);
                            if (!--pending) done(null, results, directories);
                        });
                    } else {
                        if (!--pending) done(null, results, directories);
                    }
                } else {
                    if (!exclude.includes(file)) {
                        directories[dir].push(file)
                        results.push(file);
                    }
                    if (!--pending) done(null, results, directories);
                }
            });
        });
    });
};


walk(__dirname, (e, res, folders) => {
    res.forEach(file => {
        let fileBuffer = fs.readFileSync(file)
        if (file.includes(".md")) {
            fileBuffer = `<head><title>${path.basename(file)}</title></head>${mark(fileBuffer.toString("utf8"))}`
            file = file.replace(".md", ".html")
            fileBuffer += `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/dark.min.css">`
        }

        fs.promises.mkdir(path.dirname(file.replace(__dirname, __dirname + "/out")), { recursive: true }).then(_ => fs.promises.writeFile(file.replace(__dirname, __dirname + "/out"), fileBuffer))
    })

    Object.keys(folders).forEach(folder => {
        let files = folders[folder]

        let html = `
        <html style="min-height:100vh;">
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
                <title>${folder == __dirname ? "Notes" : folder.split("/")[folder.split("/").length - 1]}</title>
            </head>
            <body style="display:flex; flex-direction:column; min-height:100%;">
                <h1><span><a href="/">.</a>/${folder.replace(__dirname, "").split("/").slice(1).map((v, i) => {
            return `<a href="/${folder.replace(__dirname + '/', "").split("/").slice(0, i + 1).join("/")}">${v}</a>`
        }).join("/")}</span></h1>
        <ul>
        ${files.map(v => {
            return `<li><a href="${v.replace(__dirname, "").replace(".md", ".html")}">${v.split("/")[v.split("/").length - 1]}</a></li>`
        }).join("")}
        </ul>
        <footer style="margin-top:auto;"><a href="github.com/neelr/Notes">Source</a> | <a href="https://neelr.dev">@neelr</a> | <strong>MIT LICENSE</strong></footer>
            </body>
        </html>
        `

        fs.promises.mkdir(path.dirname(folder.replace(__dirname, __dirname + "/out") + "/index.html"), { recursive: true }).then(_ => fs.promises.writeFile(folder.replace(__dirname, __dirname + "/out") + "/index.html", html))

    })
})