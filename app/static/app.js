/*
 * This function is called by the FeedSocket each time new data is available
 * for a feed.
 */
var previousValue = 0.0;

var update = function(feed) {

    //We've been notified about an updated value, let's 
    //update the value on the screen

    //find the most recent sample in the map
    var time = ili_timeNow(feed.attributes['interval']);
    var value = 0.0; 

    while (time > feed.attributes['lastSample']) {
        value = feed.values[time]; 
        if (value) {
            break; 
        }    
        time -= 5;
    }

    d3.select('.samplev')
        .text(previousValue)
        .transition()
        .duration(1000)
        .ease('linear')
        .tween("text", function() {
            var i = d3.interpolate(this.textContent, value);
            return function(t) {
                this.textContent = Number(i(t)).toFixed(4);
            };
        });

    previousValue = value;
}

var feedSocket = null

function subscribeToFeed() {
    var guid = document.getElementById('guid').value;
    var feed = new ili_Feed(guid, 0);
    feed.loadAttributes(function() {
        console.log("interval: " + feed.attributes['interval']);
        feed.start = ili_timeNow(feed.attributes['interval']);

        var observer = new ili_Observer();
        observer.feeds[guid] = feed;
        observer.update = update;
        feedSocket.removeAllObservers();
        feedSocket.addObserver(observer);
    });
}

$(function() {
    document.getElementById("subscribe").addEventListener ("click", subscribeToFeed, false);
    feedSocket = new ili_FeedSocket([], "ws://" + document.domain + ":8000/feeds");
    console.log('connecting to ili');
    window.onbeforeunload = function()
    {
        feedSocket.close();
    }
    feedSocket.open();

    console.log('done');
});


