/*
 * This function is called by the FeedSocket each time new data is available
 * for a feed.
 */
var update = function(feed) {
    var numSamples = Object.keys(feed.values).length;
    console.log('hello');
}

var feedSocket = null

function subscribeToFeed() {
    var guid = document.getElementById('guid').value;
    var feed = new ili_Feed(guid, 0);
    feed.start = 1377064000;
    var observer = new ili_Observer();
    observer.feeds[guid] = feed;
    //observer.update = update;
    feedSocket.removeAllObservers();
    feedSocket.addObserver(observer);
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


