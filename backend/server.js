const express = require('express');

const path = require('path');


const app = express();
const port = 3010;

// Serve static files from the 'client/public' directory
app.use('/public',express.static(path.join(__dirname, '../client/public')));

// Serve static files from the 'client/src' directory
app.use('/src', express.static(path.join(__dirname, '../client/src')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/login-form.html'));
});
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/profile.html'));
});
app.get('/createPost', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/createPost.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});


app.listen(port, () => {
    console.log("Server is running on port " + port);
});


