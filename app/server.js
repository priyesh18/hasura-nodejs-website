/*var express = require('express');
var app = express();
var fetch = require('node-fetch');

var DEVELOPMENT = (process.env.NODE_ENV == 'production') ? false : true;

// Talking to the database
var headers = {
    'Content-Type': 'application/json'
};
var url;

// When developing locally, need to access data APIs
// as if admin
if (DEVELOPMENT) {
    headers.Authorization = 'Bearer ' + process.env.ADMIN_TOKEN;
    url = `https://data.${process.env.PROJECT_NAME}.hasura-app.io`;
} else {
    url = 'http://data.hasura';
}

// Make a request to the data API as the admin role for full access
headers['X-Hasura-Role'] = 'admin';
headers['X-Hasura-User-Id'] = 1;

app.get('/', function (req, res) {
    var schemaFetchUrl = url + '/v1/query';
    var options = {
        method: 'POST',
        headers,
        body: JSON.stringify({
            type: 'select',
            args: {
                table: {
                    schema: 'hdb_catalog',
                    name: 'hdb_table'
                },
                columns: ['*.*'],
                where: {
                    table_schema: 'public'
                }
            }
        })
    };
    fetch(schemaFetchUrl, options)
        .then(
            (response) => {
                response.text()
                    .then(
                        (data) => {
                            res.send(data);
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
        });
});
*/ //original code of the template

/*
 * Sample endpoint to check the role of a user
 * When any user makes a request to this endpoint with
 * the path containing the roleName. Eg: /admin, /user, /anonymous
 * that path only gets served, if the user actually has that role.
 * To test, login to the console as an admin user. /admin, /user will work.
 * Make a request to /admin, /user from an incognito tab. They won't work, only /anonymous will work.
 */
/*app.get('/:role', function (req, res) {
  var roles = req.get('X-Hasura-Allowed-Roles');

  // Check if allowed roles contains the rolename mentioned in the URL
  if (roles.indexOf(req.params.role) > -1) {
    res.send('Hey, you have the <b>' + req.params.role + '</b> role');
  } else {
    res.status(403).send('DENIED: Only a user with the role <b>' + req.params.role + '</b> can access this endpoint');
  }
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
*/
var express = require("express"),
    bodyParser = require("body-parser"), //get the params from the request body not used in this app now since all requests are moved to the client side
    cookieParser = require('cookie-parser'),
    app = express(),
    fetch = require('node-fetch');


app.set("view engine", "ejs"); //so that I don't have to write .ejs again and again
app.use(express.static("public")); //serve the contents of my public directory
app.use(cookieParser());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://auth.c100.hasura.me');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.urlencoded({
    extended: true
}));
//Vars
var dataurl = "http://data.c100.hasura.me/v1/query";
var authurl = "http://auth.c100.hasura.me";

//Routes
app.get('/', function (req, res) {
    res.redirect("/topics");
});
app.get('/topics', function (req, res) {
    // headers.Authorization = 'Bearer ' + process.env.ADMIN_TOKEN;
    //console.log(req.cookies['id']);
    var headers = {
        'Content-Type': 'application/json'
    };
    var schemaFetchUrl = dataurl;
    var options = {
        method: 'POST',
        headers,
        body: JSON.stringify({
            type: 'select',
            args: {
                table: 'topic',
                columns: ['*']

            }
        })
    };
    fetch(schemaFetchUrl, options)
        .then(function (res) {
            //console.log("response for /topics "+res);
            return res.json();
        }).then(function (json) {
            //console.log(json);
            res.render("home", {
                data: json
            });
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
    });*/  // original fetch chain
});
//Second screen
app.get('/topics/:id', function (req, res) { //main page 
    
    var schemaFetchUrl = dataurl;
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: "select",
            args: {
                table: 'resource_info',
                columns: ['*'],
                where: {
                    topic: req.params.id
                },
                order_by: {
                    column: 'total_votes',
                    order: 'asc'

                }
            }
        })
    };
    fetch(schemaFetchUrl, options)
        .then(function (res) {
            //console.log("response for /topics "+res);
            return res.json();
        }).then(function (json) {
           // console.log(json);
            res.render("resources", {
                data: json
            });
        });

});


app.get('/resource/:topic', function (req, res) {
    res.render('resourceform', {
        topic: req.params.topic
    });
});
/*app.post('/resource', function (req, res) {
    var certificate = (req.body.cert == '1') ? true : false;
    var price = (req.body.paid == '1') ? true : false;

    var options = {
        method: 'POST',
        headers,
        body: JSON.stringify({
            type: 'insert',
            args: {
                table: 'resource',
                objects: [{
                    resource_url: req.body.r_url,
                    name: req.body.name,
                    topic: req.body.topic,
                    user_id: headers['X-Hasura-User-Id'],
                    type: req.body.type,
                    certificate: certificate,
                    cost: price,
                    description: req.body.desc
                }]
            }
        })
    }
    fetch(dataurl, options)
        .then(function (res) {
            return res.json();
        }).then(function (json) {
            console.log(json);
        })
    res.redirect("/");
});*/

app.get('/signup', function (req, res) {
    res.render('signup-page');
});

app.get('/login', function (req, res) {
    res.render('login');
});
/*app.post('/signup', function(req, res) {
    var newuser = req.body.user;
    var schemaFetchUrl = authurl + '/signup';
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: newuser['username'],
            password: newuser['pass'],
            email: newuser['email']
        })
    };
    fetch(schemaFetchUrl, options)
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            console.log(json);
            // 
            headers.Authorization = 'Bearer ' + json['auth_token'];
            var options2 = {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    type: 'insert',
                    args: {
                        table: 'profile',
                        objects: [{
                            'name': newuser['username'],
                            'user_id': json['hasura_id']
                        }]
                    }
                })
            };
            fetch(dataurl, options2)
                .then(function(res2) {
                    return res2.json();
                }).then(function(json2) {
                    console.log(json2);
                })


        });
    res.redirect("/");
    // console.log(newuser['username']);
});



app.post('/login', function(req, res) {
    var newuser = req.body.user;
    var schemaFetchUrl = authurl + '/login';
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: newuser['username'],
            password: newuser['pass']
        })
    };
    fetch(schemaFetchUrl, options)
        .then(function(res) {
            console.log(res.status);
            return res.json();
        }).then(function(json) {
            console.log(json);
            headers.Authorization = 'Bearer ' + json['auth_token'];
            headers['X-Hasura-User-Id'] = json['hasura_id'];
            headers['X-Hasura-Role'] = json['hasura_roles'][0];
            console.log(headers);

        })

    res.redirect("/");
});

app.post('/logout', function(req, res) {

    var schemaFetchUrl = authurl + '/user/logout';
    var options = {
        method: 'POST',
        headers
    }
    fetch(schemaFetchUrl, options)
        .then(function(res) {
            return res.json();
        }).then(function(json) {
            console.log(json);
            headers['X-Hasura-Role'] = 'anonymous';
            headers['X-Hasura-User-Id'] = null;
            console.log(headers);


        })

    res.redirect("/");

});*/  //logout login and signup post routes


app.listen(8080, function () {
    console.log("listening on port 8080");
});
