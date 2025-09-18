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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});