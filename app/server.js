/*var express = require('express');
var app = express();
var fetch = require('node-fetch');

var DEVELOPMENT = (process.env.NODE_ENV == 'production') ? false : true;

// Talking to the database
var headers = {'Content-Type': 'application/json'};
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
        where: { table_schema: 'public' }
    }})
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
    bodyParser = require("body-parser"), //get the params from the request body
    app = express();
var fetch = require('node-fetch');


app.set("view engine", "ejs"); //so that I don't have to write .ejs again and again
app.use(express.static("public")); //serve the contents of my public directory
app.use(bodyParser.urlencoded({
    extended: true
}));
//Vars
var dataurl = "http://data.c100.hasura.me/v1/query";
var authurl = "http://auth.c100.hasura.me";
var headers = {
    'Content-Type': 'application/json'
};
//Routes
app.get('/', function (req, res) {
    res.redirect("/topics");
});
app.get('/topics', function (req, res) {
    // headers.Authorization = 'Bearer ' + process.env.ADMIN_TOKEN;
    var schemaFetchUrl = dataurl;
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
        .then(function (res) {
            return res.json();
        }).then(function (json) {
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
    });*/
});
//Second screen
app.get('/topics/:id', function (req, res) {
    //console.log(req.params.id);
    res.send("show page for " + req.params.id);
});


app.get('/resource', function (req, res) {
    res.render('resourceform');
});
app.post('/resource', function (req, res) {
    //req.body.resource
});

app.get('/signup', function (req, res) {
    res.render('signup-page');
});

app.post('/signup', function (req, res) {
    var newuser = req.body.user;
    var schemaFetchUrl = authurl + '/signup';
    var options = {
        method: 'POST',
        headers,
        body: JSON.stringify({
            username: newuser['username'],
            password: newuser['pass'],
            email: newuser['email']
        })
    };
    fetch(schemaFetchUrl, options)
        .then(function (res) {
            return res.json();
        }).then(function (json) {
            console.log(json);
            // res.redirect("/");
            headers.Authorization = 'Bearer ' + json['auth_token'];
            var options2 = {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    type: 'insert',
                    args: {
                        table: 'profile',
                        objects: [
                            {
                                'name': newuser['username'],
                                'user_id': json['hasura_id']
              }
            ]
                    }
                })
            };
            fetch(dataurl, options2)
                .then(function (res2) {
                    return res2.json();
                }).then(function (json2) {
                    console.log(json2);
                })

        });
    // console.log(newuser['username']);
});

app.get('/login', function (req, res) {

});

app.post('/login', function (req, res) {

});

app.post('/logout', function (req, res) {
    var schemaFetchUrl = authurl + '/user/logout';
    fetch(schemaFetchUrl)
        .then(function (res) {
            return res.json();
        }).then(function (json) {
            console.log(json);
            res.redirect("/");
        });

});


app.listen(8080, function () {
    console.log("listening on port 8080");
});
