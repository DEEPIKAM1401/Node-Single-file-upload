const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine',"ejs");

// Configure the storage engine
var storage = multer.diskStorage({
    // Destination function
    destination: function(req, file, cb)
    {
        // 'uploads' is the folder where files will be saved
        cb(null, 'uploads')
    },
    // Filename function
    filename:function(req, file, cb)
    {
        // Generate a unique filename by appending timestamp
        cb(null, file.originalname.replace(/\.[^/.]+$/, "")+'_'+Date.now()+path.extname(file.originalname))
    }
})   

 let maxSize = 2*1000*1000;

 let upload = multer({
    storage:storage,
    limits:{
        fileSize:maxSize
    },
    fileFilter:function(req, file, cb)
    {
        let filetypes = /jpeg|jpg|png|pdf/;
        let mimetype= filetypes.test(file.mimetype);//image/jpeg
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if(mimetype && extname)
        {
            return cb(null, true);
        }

        cb("Error:File upload only supports the folloeing filetpes:"+filetypes);
    }
 }).single('mypic');

 app.get('/',(req, res)=>{
    res.render('signup')
 })

 app.post('/upload',(req, res, next)=>{
    upload(req, res, function(err){
        if(err)
        {
            if(err instanceof multer.MulterError && err.code == "LIMIT_FILE_SIZE")
            {
               return res.send("File size should be less than 2mb");
            }
            // For other types of errors, return a generic message
            return res.status(400).send(err.message);
        }
        else 
        {
            res.send("Success. Image uploaded!");
        }
    })
 })

 app.listen(8080,()=>{
    console.log("Server is running");
 })