var express = require("express"),
    bodyParser = require("body-parser"), //get the params from the request body
    app = express();
var fetch = require('node-fetch');


app.set("view engine", "ejs"); //so that I don't have to write .ejs again and again
app.use(express.static("public")); //serve the contents of my public directory
app.use(bodyParser.urlencoded({ extended: true }));
//Vars
var dataurl = "http://data.c100.hasura.me";
var authurl = "http://auth.c100.hasura.me";
var headers = { 'Content-Type': 'application/json' };
//Routes
app.get('/', function(req, res) {
    var schemaFetchUrl = dataurl + '/v1/query';
    var options = {
        method: 'POST',
        headers,
        body: JSON.stringify({
            type: 'select',
            args: {
                table: 'topic',
                columns: ['*'],

            }
        })
    };
    fetch(schemaFetchUrl, options)
    	.then(function(res) {
        return res.json();
    }).then(function(json) {
        res.render("home",{data:json});
    });
        /*.then(
            (response) => {
                response.text()
                    .then(
                        (body) => {
                            var data = JSON.parse(body);
                            res.render("home", { data: data });
                            
                        },
                        (e) => {
                            res.send('Error in fetching current schema: ' + err.toString());
                        })
                    .catch((e) => {
                        e.stack();
                        res.send('Error in fetching current schema: ' + e.toString());
                    });
            },
            (e) => {
                console.error(e);
                res.send('Error in fetching current schema: ' + e.toString());
            })
        .catch((e) => {
            e.stackTrace();
            res.send('Error in fetching current schema: ' + e.toString());
        });*/
});



app.get('/signup', function(req, res) {

});

app.post('/signup', function(req, res) {

});

app.get('/login', function(req, res) {

});

app.post('/login', function(req, res) {

});



app.listen(8080, function() {
    console.log("listening on port 8080");
});
