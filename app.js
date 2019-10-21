const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.engine(
    'handlebars',
    exphbs({
       extname: "handlebars",
       defaultLayout: "",
       layoutsDir: "",
    })
 );

 // SASS Middleware
app.use(sassMiddleware({
    src: path.join(__dirname, 'public/scss'),
    dest: path.join(__dirname, 'public/css'),
    outputStyle: 'compressed',
    prefix: '/css'
}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Bootstrap
app.use('/css', express.static(__dirname+'/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname+'/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname+'/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname+'/node_modules/popper.js/dist/umd'));

// Font Awesome
app.use('/css', express.static(__dirname+'/node_modules/font-awesome/css'));
app.use('/assets/fontawesome', express.static(__dirname+'/node_modules/font-awesome/scss'));

// Static folders
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname+'/public/css'));
app.use('/js', express.static(__dirname+'/public/js'));
app.use('/assets', express.static(__dirname+'/public/assets'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => console.log('Server started on port 3000...'));