var express = require('express');
var app = express();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var cors = require('cors')

var port = process.env.PORT || 8080;

app.use(cors())
var jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://dev-jctjjrzi.eu.auth0.com/.well-known/jwks.json'
    }),
    audience: 'test-api-endpoint',
    issuer: 'https://dev-jctjjrzi.eu.auth0.com/',
    algorithms: ['RS256']
});

app.use(jwtCheck);


const getManagementToken  = () => {
    var request = require("request");
    return new Promise(function(resolve,reject) {
        var options = { method: 'POST',
            url: 'https://dev-jctjjrzi.eu.auth0.com/oauth/token',
            headers: { 'content-type': 'application/json' },
            body: '{"client_id":"9Ko6pl5N6iYLBl9ChziCrGGWaTeJyn2U","client_secret":"2lkti_9aAH0H5nGQcflvb3XxZP5pv-TNubFmNrZ6ryckVH_PGBv_NxRtK4Dg380b","audience":"https://dev-jctjjrzi.eu.auth0.com/api/v2/","grant_type":"client_credentials"}' 
        }
        request(options, function (error, response, body) {
        if (error) {
            reject(error)
        } else{
            //console.log(body)
            resolve(JSON.parse(body))
        }
        });
    } )
}

app.get('/userlist', function (req, res) {
    var request = require("request");

    getManagementToken().then(data => {
        const token = data.access_token
        var options = { method: 'GET',
            url: 'https://dev-jctjjrzi.eu.auth0.com/api/v2/users?fields=user_id%2Cusername%2Cemail%2Ccreated_at%2Clast_login%2Cblocked&include_fields=true',
            headers: { 'authorization':'Bearer '+ token , 'content-type': 'application/json' },  //'scope': "read:users, read:user_idp_tokens",
        }
        request(options, function (error, response, body) {
            if (error) throw new Error(error)
            res.json(body)
        })
    })
})


app.get('/', function(req,res){
    res.json({message: "OK"})
})

app.listen(port);