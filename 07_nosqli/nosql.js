const express = require('express');
const app = express();
const port = 9000;
const mongoose = require('mongoose');
const db_url = require('./db_creds');
console.log(`db_url = ${JSON.stringify(db_url)}`);

async function main() {
    await mongoose.connect(db_url);
    const user = await User.findOne({ email: 'admin@abc.com' });
    if (user) {
        console.log('Avoiding re-creating default user');
    } else {
        const user = new User({ email: 'admin@abc.com', password: 'openup'});
        user.save();
    }
}

const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, unique: true, dropDups: true },
    password: String
}));
main().catch(err => console.log(err));

app.use(express.static('static'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/login', (request, response) => {
    response.render('login', {
        title: 'Please Log In'
    });
});

app.post('/login', async (request, response) => {
    console.log(`request.body: ${request.body}`);
    const { email, password } = request.body;

    const query = { email, password };

    console.log(`query: ${JSON.stringify(query)}`);

    const user = await User.findOne(query);

    if (user) {
        response.json({
            message: 'Success'
        });
    } else {
        response.status(401).json({
            message: 'Login Incorrect'
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});