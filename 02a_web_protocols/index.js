const express = require('express');
const app = express();
const port = 9001;

const cookieParser = require('cookie-parser');

app.use(express.static('www'));

// middleware
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/', (request, response) => {
	response.send(`
<!doctype html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>My Page</h1>
    <p>This is my page!</p>
  </body>
</html>
		`);
});

```
GET / HTTP/1.1
Host: localhost
```

app.get('/home', (request, response) => {
  response.cookie('session-id', '1');
  response.redirect('/');
});

app.get('/cookie-peek', (request, response) => {
  console.log(request.cookies['session-id']);

	response.send('ok');
});

app.get('/logout', (request, response) => {
  response.clearCookie('session-id');
});

app.post('/form_submit', (request, response) => {
	console.log(request.body);

	response.send('ok');
});

// http://localhost:9001/form_submit?username=randy&password=gidget
app.get('/form_submit', (request, response) => {
	console.log(request.query);

	response.send('ok');
});

app.get('/products/:prodid', (request, response) => {
	console.log(request.params);

	response.send('ok');
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
