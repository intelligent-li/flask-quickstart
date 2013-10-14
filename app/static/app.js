/*
 * This function is called by the FeedSocket each time new data is available
 * for a feed.
 */
var previousValue = 0.0;

var update = function(feed) {

    var numSamples = Object.keys(feed.values).length;
    //We've been notified about an updated value, let's 
    //update the value on the screen
    var time = ili_timeNow(feed.attributes['interval']);
    var value = feed.values[time];
    if (!value)
    {
        previousValue = 0;
        document.getElementById('samplevalue').innerHTML = "--.--";
    }
    else
    {
        var svg = d3.select("#samplewrapper.samplev"); 

        d3.select('.samplev')
            .text(previousValue)
            .transition()
            .duration(1000)
            .ease('linear')
            .tween("text", function() {
                var i = d3.interpolate(this.textContent, value);
                return function(t) {
                    this.textContent = i(t).toFixed(4);
                };
            });

        previousValue = value;
    }
}

var feedSocket = null

function subscribeToFeed() {
    var guid = document.getElementById('guid').value;
    var feed = new ili_Feed(guid, 0);
    feed.loadAttributes(function() {
        console.log("interval: " + feed.attributes['interval']);
        feed.attributes['interval'] = 20; //temporary hack to get around comfortometer posting every 20 seconds but the feed wanting 5
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


