// var newrelic      = require('newrelic');
var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCrossDomain);


var port = process.env.PORT || 1337;

app.use(express.static(__dirname));

var router = express.Router();

app.use('/', router);

app.listen(port);
console.log('Listening on port: ' + port);

router.route('/dist/send').post(function(req, res) {

    var MailChimpAPI = require('mailchimp').MailChimpAPI;

    var apiKey = '6051441b51ee6d8f868d99bbfa4b4ca8-us4';

    try {
        var api = new MailChimpAPI(apiKey, { version : '2.0' });
    } catch (error) {
        console.log(error.message);
    }


    var userChimp = {
        FNAME: req.body.nome,
        WHATSAPP: req.body.wpp,
        ALLOWWPP: req.body.allowWpp,
        ALLOWGNT: req.body.allowGnt,
        ORIGIN: req.body.canal
    };

    api.call('lists', 'subscribe', { id: 'f539834ddf',  email:{"email": req.body.email}, merge_vars:userChimp }, function (err, data) {
      if (err) {
        //console.log(err);

        if(err.code ===  214) { // Already Subscribed
        res.json({ error: true, errorType: 'already-registered' });
        } else if(err.code === -100) { // Invalid email
        res.json({ error: true, errorType: 'invalid-email' });
        } else {
        res.json({ error: true, errorType: 'generic-error' });
        }

      } else
        res.json({ success: 'Email registered' }); 
    });


    /////mailgun

    //var user = {
        //subscribed: false,
        //address: req.body.email,
        //name: req.body.nome,
        //vars: {
            //whatsapp: req.body.wpp,
            //allowWpp: req.body.allowWpp,
            //allowGnt: req.body.allowGnt
        //}
    //};


    //// XXX change domain from mailgun to a TLD
    //var api_key = 'key-1w-hfo0td1ezibvew4762265vc0vgj-3';
    //var domain = 'wesense.us';
    //var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

    //var user = {
      //subscribed: true,
      //address: req.body.email,
      //name: req.body.nome,
      //vars: {
        //whatsapp: req.body.wpp,
        //allowWpp: req.body.allowWpp,
        //allowGnt: req.body.allowGnt
      //}
    //};

    //var list = mailgun.lists('gnt@wesense.us');

    //list.members().create(user, function(err, data) {
      //if(err) {

        //if(err.message.indexOf('already exists') !== -1) {
          //res.json({ error: true, errorType: 'already-registered' });
        //} else if(err.message.indexOf('valid email') !== -1) {
          //res.json({ error: true, errorType: 'invalid-email' });
        //} else {
          //res.json({ error: true, errorType: 'generic-error' });
        //}

      //} else {
        //res.json({ success: 'Email registered' }); 
      //}
    //});

});
