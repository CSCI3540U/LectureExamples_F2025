const express = require('express');
const app = express();
const port = 9001;

app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));

app.post('/login', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    if (username === 'admin' && password === '54321') {
        // send our secrets
        response.sendFile(__dirname + '/static/admin/admin_password.txt');
    } else {
        // failed login
        response.status(401).send('Login Incorrect');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});