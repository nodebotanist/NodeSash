var secrets = require('./secrets'),
    twit = require('twitter'),
    util = require('util'),
    request = require('request'),
    _ = require('lodash'),
    parse = require('parse-color');

var twitter_api = new twit({
  consumer_key: secrets.twitter_consumer,
  consumer_secret: secrets.twitter_consumer_secret,
  access_token_key: secrets.twitter_access,
  access_token_secret: secrets.twitter_access_secret
});

var tweets_shown = [];

var css_colors = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgrey", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred ", "indigo ", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgrey", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"];

function getNewHashtagTweets(){
  twitter_api.get('search/tweets.json', { q: '#NodeSash' }, function(err, tweets, resp){
  //   console.log(err, tweets);

    var newTweets = tweets.statuses;

    newTweets.forEach(function(tweet){
      console.log('tweet', tweet.text);
      if(new Date(tweet.created_at).getTime() > (new Date().getTime() - 40000)){
        if(tweets_shown.indexOf(tweet.id) == -1){
          tweets_shown.push(tweet.id);
          color = tweet.text.match(/#[a-f0-9]{6}/i);
          if(!color) color = tweet.text.match(/#[a-f0-9]{3}/i);
          if(!color) color = tweet.text.match(/hsl\([\d.]+,\s*([\d.]+)%,\s*([\d.]+)%\)/i)
          if(!color) color = tweet.text.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/i);
          
          console.log(color);
          if(color){
            color = parse(color[0].toLowerCase()).hex;
            if(color){
              request("https://agent.electricimp.com/neAhNU4U7Kgm?color=" + encodeURIComponent(color));
            }
          } else {
            var words = _.words(tweet.text);
            words = _.map(words, function(word){
              return word.toLowerCase();
            });
            var colorsInSentence = _.intersection(words, css_colors);
            if(colorsInSentence.length >= 1){
              color = parse(colorsInSentence[0]).hex;
              request("https://agent.electricimp.com/neAhNU4U7Kgm?color=" + encodeURIComponent(color));
            }
          }
        } 
      }
    });
  });
}

setInterval(getNewHashtagTweets, 5000);
setInterval(function(){
  tweets_shown.shift();
}, 40000);