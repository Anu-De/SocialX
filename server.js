const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());



app.listen(port, () => {
    console.log("Server is running on port " + port);
});


