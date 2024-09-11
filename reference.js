const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

// Set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configure the storage engine
const storage = multer.diskStorage({
    // Destination function
    destination: function(req, file, cb) {
        cb(null, 'uploads'); // 'uploads' is the folder where files will be saved
    },
    // Filename function
    filename: function(req, file, cb) {
        // Generate a unique filename by appending timestamp
        cb(null, file.originalname.replace(/\.[^/.]+$/, '') + '_' + Date.now() + path.extname(file.originalname));
    }
});

// Maximum file size
const maxSize = 2 * 1000 * 1000; // 2 MB

// Initialize multer with storage, limits, and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    },
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf/;
        const mimetype = filetypes.test(file.mimetype); // e.g., 'image/jpeg'
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports the following filetypes: ' + filetypes));
    }
}).single('mypic');

// Route to render the signup page
app.get('/', (req, res) => {
    res.render('signup');
});

// Route to handle file uploads
app.post('/upload', (req, res, next) => {
    upload(req, res, function(err) {
        if (err) {
            if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).send('File size should be less than 2MB');
            }
            // For other types of errors, return a generic message
            return res.status(400).send(err.message);
        }
        res.send('Success. Image uploaded!');
    });
});

// Start the server
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});