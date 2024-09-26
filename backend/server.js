const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3010;

// In-memory storage for posts
const posts = [];

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../client/public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the 'client/public' directory
app.use('/public', express.static(path.join(__dirname, '../client/public')));

// Serve static files from the 'client/src' directory
app.use('/src', express.static(path.join(__dirname, '../client/src')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/login-form.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/profile.html'));
});

app.get('/createPost', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/createPost.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});
app.get('/reg', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/reg.html'));
});

app.post('/api/posts', upload.single('image'), (req, res) => {
    const { caption } = req.body;
    const imagePath = '/public/uploads/' + req.file.filename;

    if (!caption || !req.file) {
        return res.status(400).json({ error: 'Caption and image are required.' });
    }

    const post = { caption, imagePath };
    posts.push(post);

    res.status(200).json({ message: 'Post created successfully!', post });
});

app.get('/api/posts', (req, res) => {
    res.status(200).json(posts);
});

app.delete('/api/posts/:index', (req, res) => {
    const postIndex = parseInt(req.params.index, 10);
    if (isNaN(postIndex) || postIndex < 0 || postIndex >= posts.length) {
        return res.status(400).json({ error: 'Invalid post index' });
    }

    const deletedPost = posts.splice(postIndex, 1)[0];
    // Optionally, delete the file from the filesystem
    const filePath = path.join(__dirname, '../client', deletedPost.imagePath);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Failed to delete file:', err);
        }
    });

    res.status(200).json({ message: 'Post deleted successfully!' });
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
