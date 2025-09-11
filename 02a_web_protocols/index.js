const express = require('express');
const app = express();
const port = 9001;

app.use(express.static('www'));

app.use(express.urlencoded({extended: false}));

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

app.post('/form_submit', (request, response) => {
	console.log(request.body);

	response.send('ok');
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
