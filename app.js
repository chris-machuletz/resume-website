const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const csp = require('express-csp-header');
const { body } = require('express-validator');
const { sanitizeBody } = require('express-validator');
var favicon = require('serve-favicon');
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

app.use(express.json());

app.use(csp({
    policies: {
        'default-src': [csp.SELF, 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'],
        'img-src': ['data:', csp.SELF],
    }
}));
app.use(favicon(path.join(__dirname, 'public', 'assets/favicon.ico')))

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
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist/umd'));

// Font Awesome
app.use('/css', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use('/assets/fontawesome', express.static(__dirname + '/node_modules/font-awesome/scss'));

// Static folders
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/assets', express.static(__dirname + '/public/assets'));

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
    var date = new Date().getFullYear();
    res.render('index', {year: date});
});

app.post('/', [
    body('fullname').isAlpha().withMessage('Der Name von Ihnen eingegebene Name ist ungültig.'),
    body('email').isEmail().withMessage('Der Name von Ihnen eingegebene E-Mail Adresse ist ungültig.'),
    body('subject').isAlpha(),
    body('message').isAlpha(),
    sanitizeBody('notifyOnReply').toBoolean()
],(req, res) => {
    const output = `
        <h3>Kontaktanfrage über Nodemail-Client</h3>
        <p>
            Von: <b>${req.body.fullname}</b><br>
            E-Mail: <b>${req.body.email}</b>
        </p>
        <h2>${req.body.subject}</h2>
        <p style="white-space: pre-wrap;">${req.body.message}</p>
    `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.hs-fulda.de',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'fdai4340', // generated ethereal user
            pass: 'Jammingonf1re'  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"${req.body.fullname}" <christoph.machuletz@informatik.hs-fulda.de>`, // sender address
        to: 'machuletz.christoph@gmail.com', // list of receivers
        subject: `${req.body.subject}`, // Subject line
        text: output, // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(200).send('Fehler beim Senden der Nachricht.');
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.status(200).send('<meta http-equiv="refresh" content="3;url=http://localhost:3000/#contact">Nachricht erfolgreich versendet. Sie werden automatisch weitergeleitet. Falls nicht, klicken Sie auf den Zurück-Button Ihres Browsers.');
    });
});

app.get('/impressum', (req, res) => {
    var date = new Date().getFullYear();
    res.render('impressum', {year: date});
});
app.get('/datenschutz', (req, res) => {
    var date = new Date().getFullYear();
    res.render('datenschutz', {year: date});
});

app.listen(3000, () => console.log('Server started on port 3000...'));