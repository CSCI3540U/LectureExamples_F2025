const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const port = 9000;

// authentication

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// session tracking

let nextSessionId = 2;

let sessionData = {
    '1': {
        email: 'admin@abc.com',
        role: 'administrator'
    }
};

// middleware

app.use(express.static('static'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'the giraffe with its long neck is able to reach the highest branches'
}));

// templating engine setup

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// routes

app.get('/', (request, response) => {
    console.log(request.cookies);
    let sessionId = request.cookies['session_id'];
    if (sessionData[sessionId]) {
        let email = sessionData[sessionId]['email'];
        let role = sessionData[sessionId]['role'];
        if (email) {
            response.send(`Welcome, ${email}! Role: ${role}<br /><a href="/logout">Logout</a>`);
        } 
    } else {
        response.redirect('/login');
    }
});

app.get('/login', (request, response) => {
    response.render('login', {
        title: 'Login Page',
        errorMessage: ''
    });
});

app.post('/login', (request, response) => {
    let email = request.body.email;
    let password = request.body.password;
    // console.log(`Login attempt: ${request.body.email}/${request.body.password}`);

    // fix 1: delay
    sleep(500).then(() => {
        if (userExists(email)) {
            console.log(` User exists: ${email}`);
            if (checkPassword(email, password)) {
                // login success
                response.cookie('session_id', `${nextSessionId}`);
                sessionData[nextSessionId] = {
                    email: email,
                    role: 'user'
                };
                nextSessionId++;

                response.redirect('/');
            } else {
                // password does not match
                // fix 2: consistent error messages
                response.status(401).render('login', {
                    title: 'Login Page',
                    errorMessage: 'Login incorrect'
                });
            }
        } else {
            // e-mail does not exist
            response.status(401).render('login', {
                title: 'Login Page',
                errorMessage: 'Login incorrect'
            });
        }
    });
});

app.get('/logout', (request, response) => {
    request.session.email = '';
    response.redirect('/login');
});

app.get('/profile/:email', (request, response) => {
    let email = request.params.email; // unused
    let sessionId = request.cookies['session_id'];
    let userEmail = sessionData[sessionId]['email'];
    let role = sessionData[sessionId]['role'];
    if (email in loginData && (role === 'administrator' || userEmail === email)) {
        response.send(`Ciao, ${email}.  Your password is ${loginData[email]}.`);
    } else {
        response.status(400).send('Access denied.');
    }
});

app.get('/order_status', (request, response) => {
    let orderId = request.query.order_id;
    response.send(`Viewing order ${orderId}.`);
});

// web listener

app.listen(port, () => {
    console.log(`Web server listening on port ${port}.`);
});