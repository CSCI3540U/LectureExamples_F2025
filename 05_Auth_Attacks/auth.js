const express = require('express');
const app = express();

let loginData = {
    'admin@abc.com': 'v05!j_R',
    'robert@abc.com': 'burt',
    'sandra@abc.com': 'gandalf5'
};

function userExists(toFind) {
    return Object.keys(loginData).includes(toFind);
}

function checkPassword(email, password) {
    return loginData[email] === password;
}

app.use(express.static('static'));

app.post('/login', (request, response) => {
    let email = request.body.email;
    let password = request.body.password;

    // TODO: you are here
});