var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Connect to yahoo fantasy
// var YahooFantasy = require('yahoo-fantasy');
// // you can get an application key/secret by creating a new application on Yahoo!
// var yf = new YahooFantasy(
//   "dj0yJmk9ZWFNU3YxOVRnTUF3JmQ9WVdrOVZHRXdUV1ZRTm1zbWNHbzlNVFU1T0RjNU56WTJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD1jZA--",
//   "04e4a60185f9217d3a90c1f55f0d3400a30df2c1"
// );

// if a user has logged in (not required for all endpoints)
// yf.setUserToken(
//   Y!CLIENT_TOKEN,
//   Y!CLIENT_SECRET
// );



//=========================================================
// Bots Dialogs
//=========================================================

// bot.dialog('/', [
//     function (session) {
//         // query a resource/subresource
//         // yf.teams (
//         // {"league_key":'364.l.15190'},
//         // function cb(err, data) {
//         //     // handle error
//         //     // callback function
//         //     // do your thing
//         // }
//         // );
//         session.send('Hello!');
//     },
//     function (session, results) {
//         session.send('Hello %s!', results.response);
//     }
// ]);

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));