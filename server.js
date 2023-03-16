const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const server = http.createServer(app);
const db = require ('./db');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/Albums', (req, res) => {
    res.render('album-list', {
        locals: {
            album: db
        }
    })
 });

app.get('/Albums/:id', (req, res) => {
    const {id} = req.params;
    const {name, image, publishDate, songTitles, duration, score} = db[id];
    res.render('album', {
        locals: {
            name,
            image,
            publishDate,
            songTitles,
            duration,
            score
        }
    })
});

app.get('/top-albums', (req, res) => {
    const {id} = req.params;
    let {name, score} = {};     //server crashed when db[id] was introduced initially
    if (db[id]) {
        ({name, score} = db[id]);  // if filtered results return true album is included in final array
    }
    const scoreList = db.filter((db) => db.score > 5).map((db) => `<li>${db.name}: ${db.score}</li>`); //used .map as well to return filtered elements into the map array also used for fun.
    const htmlData = `<div>
                            <h1>Here are the greats!</h1>
                            <ol>
                            ${scoreList}
                            </ol>
                            <a href="/">Home</a>
                        </div>`
    res.send(htmlData);
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


