const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();

const server = http.createServer(app);
const db = require ('./db');
const { title } = require('process');
app.use(express.static('public'));

app.get('/', (req, res) => {
    const htmlData = `<div>
                        <h1>Albums</h1>
                        <h2>Welcome to my site about my favorite Grindcore albums!</h2>
                        <p>Sorry in advance for the crazy album covers</p>
                        <a href="/top-albums">Skip straight to the greats</a>
                        <p>we b wild in these mean streets</p>
                        <img src="/images/an-example-must-be-made.jpg" width:"650">
                        <a href="/Albums">check em out here!</a>
                      </div>`;
    res.send(htmlData);
});

app.get('/Albums', (req, res) => {
    const list = db.map((album, index) =>{
        return `<li><a href="/Albums/${index}">${album.name}</a></li>`;
    }).join('');

    const htmlData = `<div>
                        <h1>The albums</h1>
                        <ul>
                          ${list}
                        </ul>
                        <a href="/top-albums">The Greats</a>
                        <a href="/">Home</a>
                      </div>`;
    res.send(htmlData);
});

app.get('/Albums/:id', (req, res) => {
    const {id} = req.params;
    const {name, image, publishDate, songTitles, duration} = db[id];
    const titleList = songTitles.map((songTitles) => {
        return `<li>${songTitles}</li>`;
    }).join('');
    const htmlData = `<div>
                        <h1>${name}</h1>
                        <h2>This album came out in ${publishDate}</h2>
                        <image src=${image}>
                        <ul>
                            ${titleList}
                        </ul>
                        <h3>The length of this album is ${duration}</h3>
                        <a href="/top-albums">see my list of favorites here!</a>
                        <a href="/">Home</a>
                      </div>`;
    res.send(htmlData);
});

app.get('/top-albums', (req, res) => {
    const {id} = req.params;
    let {name, score} = {};     //server crashed when db[id] was introduced
    if (db[id]) {
        ({name, score} = db[id]);  // if filtered results return true album is included in final array
    }
    const scoreList = db.filter((db) => db.score > 5).map((db) => `<li>${db.name}: ${db.score}</li>`); //used .map as well to return filtered elements into an array also used for fun.
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



