//grabbing from keys//
require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys");
var request = require("request");

var twitter = require("twitter");

var spotify = new Spotify(keys.spotify);
var client = new twitter(keys.twitter);

var fs = require("fs");
//array storing//
var nodeArgv = process.argv;
var action = process.argv[2];
var userChoice = process.argv[3];
//movie or song
var x = "";
// multiple words
for (var i = 3; i < nodeArgv.length; i++) {
    if (i > 3 && i < nodeArgv.length) {
        x = x + "+" + nodeArgv[i];
    } else {
        x = x + nodeArgv[i];
    }
}



function runAction(action, userChoice) {
    //switching
    switch (action) {
        case "my-tweets":
            showTweets();
            break;

        case "spotify-this-song":
            if (userChoice) {
                spotifySong(userChoice);
            } else {
                spotifySong("The Sign");
            }
            break;

        case "movie-this":
            if (userChoice) {
                console.log("userChoice: " + userChoice);
                omdbData(userChoice);
            } else {
                omdbData("Mr. Nobody")
            }
            break;

        case "do-what-it-says":
            doThing();
            break;

        default:
            console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
            break;
    }
}

function showTweets() {
    // last 20 Tweets
    var screenName = {
        screen_name: 'fakeclasstweets'
    };
    client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@fakeclasstweets: " + tweets[i].text + " Sent At: " + date.substring(0, 19));
                console.log("-----------------------");

                //adding text to file
                fs.appendFile('log.txt', "@fakeclasstweets: " + tweets[i].text + " Sent At: " + date.substring(0, 19));
                fs.appendFile('log.txt', "-----------------------");
            }
        } else {
            console.log('Error occurred');
        }
    });
}

function spotifySong(song) {
    spotify.search({
        type: 'track',
        query: song
    }, function (error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log("Artist: " + songData.artists.name);
                console.log("Song: " + songData.name);
                console.log("Preview URL: " + songData.preview_url);
                console.log("Album: " + songData.album.name);
                console.log("-----------------------");

                //appending 
                fs.appendFile('log.txt', songData.artists[0].name);
                fs.appendFile('log.txt', songData.name);
                fs.appendFile('log.txt', songData.preview_url);
                fs.appendFile('log.txt', songData.album.name);
                fs.appendFile('log.txt', "-----------------------");
            }
        } else {
            console.log('Error occurred.');
        }
    });
}

function omdbData(movie) {
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&tomatoes=true&apikey=trilogy';

    request(omdbURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);

            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
           

            //adds text 
            fs.appendFile('log.txt', "Title: " + body.Title);
            fs.appendFile('log.txt', "Release Year: " + body.Year);
            fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating);
            fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
            fs.appendFile('log.txt', "Country: " + body.Country);
            fs.appendFile('log.txt', "Language: " + body.Language);
            fs.appendFile('log.txt', "Plot: " + body.Plot);
            fs.appendFile('log.txt', "Actors: " + body.Actors);
            
            

        } else {
            console.log('Error occurred.')
        }
        if (movie === "Mr. Nobody") {
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");

            //adds text to log.txt
            fs.appendFile('log.txt', "-----------------------");
            fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            fs.appendFile('log.txt', "It's on Netflix!");
        }
    });

}

function doThing() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var txt = data.split(',');

        spotifySong(txt[1]);
    });
}

runAction(action, userChoice);