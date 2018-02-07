const express=require('express');
const ejs=require('ejs');
const path=require('path');
const multer=require('multer');

const storage = multer.diskStorage({
    destination:'./public/uploads/',
    filename: function(req, file, cb){

        cb(null,file.fieldname+'-'+Date.now()+ path.extname(file.originalname));
    }
});

function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Images Only!');
    }
}

const upload = multer({
    storage:storage,
    limits:{fileSize:1000000},
    fileFilter: function (req,file,cb) {
        checkFileType(file,cb);
    }
}).single('myImage');

const app=express();
const port=3000;

app.set('view engine','ejs');

app.use(express.static(__dirname + "/public"));

app.get('/',function (req,res) {

    res.render('index');
});

app.post('/upload',function (req,res) {

    upload(req,res,function(err) {
        if(err){
            res.render('index', { msg: err});
        }
        else{

            if(req.file ==undefined){

                res.render('index',{msg:'Error: No File Selected!'});

            }else{

                res.render('index', {msg: 'File Uploaded!', file:'uploads/'+req.file.filename});

            }


        }
    });
});

app.listen(process.env.PORT || "3000", process.env.IP, function () {
    console.log("The Discussion App server is running at port: "+process.env.PORT);
});

