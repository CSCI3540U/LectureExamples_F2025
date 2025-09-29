const express = require('express');
const app = express();
const port = 9001;
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const fileUpload = require('express-fileupload');
const process = require('child_process');
const util = require('util');
const exec = util.promisify(process.exec);

app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
    limits: { fileSize: 25 * 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
    safeFileNames: true,
    preserveExtension: true,
}));

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
    fs.realpath(pathname, (error, resolved_path) => {
        if (error) {
            console.log(error);
        } else {
            // check if the path is /var/www/app/
            // if (resolved_path.startsWith('/var/www/app')) {
            if (resolved_path.startsWith(__dirname + '/')) {
                    fs.readFile(pathname, (error, data) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    response.send(data);
                });                
            } else {
                // trying to access outside of the container directory
                response.send(`You cannot access files outside of ${__dirname}`)
            }
        }
    });
});

app.get('/remote_file_inclusion', async (request, response) => {
    let url = request.query['page'];
    try {
        let pageResponse = await axios.get(url);
        response.send(pageResponse.data);
    } catch (error) {
        response.status(500).send(`Error: ${error.message}`);
    }
});

app.post('/file_upload', async (request, response) => {
    const file = request.files.uploaded_image;
    let desired_file_path = path.join(path.join(__dirname, 'uploads'), file.name);
    if (file.name.endsWith('.jpg') && (file.mimetype === 'image/jpeg')) {
        const cmd = await exec(`/usr/bin/file "${file.tempFilePath}"`);
        if (cmd.stderr) {
            console.error(`Error while checking file type: ${cmd.stderr}`);
            response.write(`Error while checking file type: ${cmd.stderr}`);
            response.end();
            return;
        }
        if (cmd.stdout.includes('JPEG')) {
            file.mv(desired_file_path, (error) => {
                if (error) {
                    console.error(`Error copying file: ${error}`);
                } else {
                    response.statusCode = 200;
                    response.setHeader('Content-Type','text/html');
                    response.write(`File name: ${file.name}`);
                    response.write(`File size: ${file.size}`);
                    response.write(`File hash: ${file.md5}`);
                    response.write(`MIME type: ${file.mimetype}`);
                    response.write(`Temp path: ${file.tempFilePath}`);
                    response.write(`Dest path: ${desired_file_path}`);
                    response.end();
                }
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});