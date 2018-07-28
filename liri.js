require("dotenv").config();
var Twitter = require('twitter');
var keys = require("./keys.js");
var client = new Twitter(keys.twitter);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require("request");
var nodeArgs = process.argv;

var requestStuff = nodeArgs[2] || "my-tweets";
var doStuff = nodeArgs[3] || "";

var fs = require("fs");
function callWhat() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }else{
            var doArray = data.split(",");
            requestStuff = doArray[0];
            doStuff = doArray[1];
            requestSpotify(doStuff);
        }
    })
};

function startApp() {
    switch (requestStuff) {
        case "my-tweets":
            callTweets();
            break;
        case "spotify-this-song":
            requestSpotify(doStuff)
            break;
        case "movie-this":
            callMovie(doStuff);
            break;
        case "do-what-it-says":
            callWhat()
            break;
    }
        
}
startApp();


function requestSpotify(userRequest){
    var query = userRequest;
        if(!query){
            query = "The Sign Ace of Base";
        }
        spotify.search({type: 'track', query: query, limit: 1
        }, function (err, data) {
            if (!err) {
                var data = data.tracks.items[0];
                var artistName = data.album.artists[0].name;
                console.log(`
            Artist: ${artistName}
            Song name: ${query}
            Album Name: ${data.album.name}
            Preview link: ${data.preview_url}`);
        
            } else {
                console.log(`Error: ${err}`);
            }
        })
}

function callMovie(userRequest) {
        var query = userRequest;
        if(!query){
            query = 'Mr. Nobody';
        }
        
        request(`http://www.omdbapi.com/?t=${query}&apikey=trilogy`, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                var movieObj = JSON.parse(body);
                console.log(`
                Movie Title: ${movieObj.Title}
                Year Released: ${movieObj.Year}
                IMDB Rating: ${movieObj.Ratings[0].Value}
                Rotten Tomtoes Rating: ${movieObj.Ratings[1].Value}
                Country Produced: ${movieObj.Country}
                Languages: ${movieObj.Language}
                Plot: ${movieObj.Plot}
                Actors: ${movieObj.Actors}
                 `);
 
            }
        });
};

function callTweets(){
    client.get('statuses/user_timeline', function(error, tweets, response) {
    if (!error) {
        for (var i = 0; i < tweets.length; i++) {
            var j=i+1;
            console.log( j+"- Tweet content: " + tweets[i].text + " Created At: " + tweets[i].created_at);
        } 
    }else {
        console.log(error);
  }
});
}
