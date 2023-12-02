const express = require('express')
const dotenv = require('dotenv');
dotenv.config();

const app = express()

const mongoose = require('mongoose')
const dbUrl = 'mongodb://127.0.0.1:27017/Call_Me'

mongoose.connect(dbUrl);

const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session')

const port = process.env.PORT 

app.use(session({
    secret: 'secrettttttttttttttttt',
    saveUninitialized : true,
    resave : false
  }));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

app.set('view engine','ejs')
app.set('views','./Views')
app.use(express.static('public'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Public/Profiles');
    },
    filename: (req, file, cb) => {
        // Use the current timestamp as the filename to make it unique
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

const userController = require('./Controller/userController')

app.get('/',(req,res)=>{
    res.render('register')
})

app.get('/home',userController.loadHome)
app.post('/register',upload.single('profile'),userController.Register)
app.get('/login',userController.loadLogin)
app.post('/verify',userController.verifyUser)
app.get('/createMeet',userController.loadMeeting)

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})