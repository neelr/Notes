var fs = require('fs');
var path = require('path');
var mark = require("marked")

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
            file = file.replace(".md", ".html")
            fileBuffer = mark(fileBuffer.toString("utf8"))
            fileBuffer += `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/dark.min.css">`
        }

        fs.promises.mkdir(path.dirname(file.replace(__dirname, __dirname + "/out")), { recursive: true }).then(_ => fs.promises.writeFile(file.replace(__dirname, __dirname + "/out"), fileBuffer))
    })

    Object.keys(folders).forEach(folder => {
        let files = folders[folder]

        let html = `
        <html>
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/dark.min.css">
                <title>${folder == __dirname ? "Notes" : folder.split("/")[folder.split("/").length - 1]}</title>
            </head>
            <body>
                <h1><span><a href="/">.</a>/${folder.replace(__dirname, "").split("/").slice(1).map((v, i) => {
            return `<a href="/${folder.replace(__dirname + '/', "").split("/").slice(0, i + 1).join("/")}">${v}</a>`
        }).join("/")}</span></h1>
        <ul>
        ${files.map(v => {
            return `<li><a href="${v.replace(__dirname, "").replace(".md", ".html")}">${v.split("/")[v.split("/").length - 1]}</a></li>`
        }).join("")}
        </ul>
            </body>
        </html>
        `

        fs.promises.mkdir(path.dirname(folder.replace(__dirname, __dirname + "/out") + "/index.html"), { recursive: true }).then(_ => fs.promises.writeFile(folder.replace(__dirname, __dirname + "/out") + "/index.html", html))

    })
})