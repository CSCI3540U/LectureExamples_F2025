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
    console.log(`Login attempt: ${request.body.email}/${request.body.password}`);

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

            response.redirect('/home');
        } else {
            // password does not match
            response.status(401).render('login', {
                title: 'Login Page',
                errorMessage: 'Password is incorrect'
            });
        }
    } else {
        // e-mail does not exist
        response.status(401).render('login', {
            title: 'Login Page',
            errorMessage: 'E-Mail does not exist'
        });
    }
});

app.get('/logout', (request, response) => {
    request.session.email = '';
    response.redirect('/login');
});

// web listener

app.listen(port, () => {
    console.log(`Web server listening on port ${port}.`);
});