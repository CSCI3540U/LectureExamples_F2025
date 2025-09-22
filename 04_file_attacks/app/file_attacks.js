const express = require('express');
const app = express();
const port = 9001;
const fs = require('fs');
const path = require('path');
const axios = require('axios');

app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));

app.get('/open_redirect', (request, response) => {
    let url = request.query['page'];
    response.redirect(url);
});

app.get('/local_file_inclusion', (request, response) => {
    let filename = request.query['page'];
    response.setHeader('Content-Type', 'text/html');
    response.sendFile(__dirname + `/static/${filename}.html`);
});

app.get('/directory_traversal', (request, response) => {
    let filename = request.query['page'];
    let pathname = __dirname + '/' + filename;
    response.setHeader('Content-Type', 'text/html');
    fs.readFile(pathname, (error, data) => {
        if (error) {
            console.error(error);
            return;
        }
        response.send(data);
    });    
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});