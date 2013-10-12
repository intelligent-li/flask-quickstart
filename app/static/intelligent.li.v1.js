/*
 * FeedSocket Copyright Percepscion Pty. Ltd.
 *
 * Provides a class for connecting to the Intelligent.li service  via
 * web sockets.
 *
 */

function ili_Observer() {
    this.feeds = {}
    this.subscribed = function(guid) {
        return guid in this.feeds;
    }

    this.update = function(feed) { 
        console.log('no update function for this observer'); 
    }
    this.respondNoData = function() {}
}

function ili_Feed(guid, seconds) {
    this.observerCount = 0;
    this.id = guid
    this.start = ((new Date() / 1000) | 0) - seconds; 
    this.values = {}
}

function ili_FeedSocket(observers, url)
{
    if (!("WebSocket" in window)) {
        console.log("No WebSocket found.  Abort");
        return;
    }

    var that = this;
    var heartBeatTimer;
    this.observers = observers;

    this.feeds = {};
    observers.forEach(function(observer) {
        Object.keys(observer.feeds).forEach(function(key) {
            if (!key in feeds) feeds[key] = observer.feeds[feed]
            feeds[key].observerCount++;
        });
    });

    this.open = function()
    {
        console.log("Opening remote websocket url",url);
        this.ws = new WebSocket(url);
        this.ws.parent = this;
        var that = this;

        heartBeatTimer = setInterval(function() {
            if (that.ws) {
                var message = JSON.stringify({
                    'action' : 'heartbeat'
                })
                console.log("sending heartbeat " + message);
                that.ws.send(message);
            }
            else {
                console.log('not currently connected');
            }
        }, 10000);

        this.ws.onmessage = function (msg)
        {
            console.log('got message ' + msg.data);
            var message = JSON.parse(msg.data);
            if (!message.guid in feeds) {
              console.log("onMessage: Incoming feed data for id "+message.id+" does not have an entry in config");
              return;
            }
            var feed = feeds[message.guid];

            console.log("new msg",feed);
            for (var val in message.values)
            {
                var time = parseFloat(val);
                if (feed.aggregated) {
                    // aggregated samples are for the previous period
                    time -= feed.step;
                    if (time < 0)
                        time = 0;
                }
                var val = message.values[val];
                if (val === "NaN")
                    val = 0.0
                if (val)
                    val = parseFloat(val);
                feed.values[time] = val
            }

            if (!Util.is_empty(feed.values)) {
                observers.forEach(function(observer) {
                  if (observer.subscribed(feed.id)) {
                    observer.update(feed);
                  }
                });
            } else {
                console.log("feed contained no values");
                observers.forEach(function(observer) {
                    if (observer.respondNoData && observer.subscribed(feed.id)) {
                        observer.respondNoData();
                    }
                });
            }
        };

        this.ws.onopen = function()
        {
            console.log("web socket has opened")
            this.parent.subscribeMany(this.parent.feeds);
        };

        this.ws.onclose = function(evt)
        {
            console.log("socket close occurred", evt.reason);
            var that = this;
            clearInterval(heartBeatTimer);
            setTimeout(function(){ that.parent.open();}, 10000);
        };

        this.ws.onerror = function(err)
        {
            console.log("socket error occurred",err.data);
            var that = this;
            /*clearInterval(that.hearBeatTimer);
            setTimeout(function(){ that.parent.open(); }, 1000);*/
        }
    }

    this.subscribe = function (feed) {
        var that = this;
        if (feed.start == 0) {
            feed.start = (new Date() / 1000) | 0;
        }
        if (that.ws) { 
            var message = JSON.stringify({
                'action' : 'subscribe',
                'guid'   : feed.id,
                'start'  : feed.start
            });
            console.log('sending subscription ', message);
            that.ws.send(message);
        }
        else {
            console.log('not currently connected');
        }
    }
    
    this.removeObserver = function(observerToRemove) {
        var index = this.observers.indexOf(observerToRemove); 
        if (index == -1) {
            return;
        }
        var that = this;
        Object.keys(observerToRemove.feeds).forEach(function(key) {
            var feed = that.feeds[key];
            feed.observerCount--;
            console.log('feed has ' + feed.observerCount + ' observers');
            if (feed.observerCount <= 0) {
                console.log('feed has no more observers, unsubscribing');
                that.unsubscribe(feed);
                delete that.feeds[key];
            }
        });
        this.observers.splice(index, 1);
    }
    
    this.removeAllObservers = function() {
        var that = this;

        observers.forEach(function(observer) {
            that.removeObserver(observer);
        });
    }


    this.addObserver = function(observerToAdd) {
        var index = this.observers.indexOf(observerToAdd);
        if (index != -1) {
            return;
        }   
        var that = this;

        Object.keys(observerToAdd.feeds).forEach(function(key) {
            var feed;
            if (key in that.feeds) {
                console.log("feed " + key + " is already subscribed to ");
                feed = that.feeds[key];
                /*if ((observerToAdd.feeds[key].start != 0) && (observerToAdd.feeds[key].start < feed.start)) {
                    feed.start = observerToAdd.feeds[key].start;
                }*/
            }
            else {
                console.log("feed " + key + " is not currently subscribed to, adding subscription");
                feed = new ili_Feed(key);
                feed.start = observerToAdd.feeds[key].start;

                that.feeds[key] = feed;
                that.subscribe(feed);
            }
            feed.observerCount++;
        }); 
        this.observers.push(observerToAdd);
    }

    this.subscribeMany = function(feeds) {
        var that = this;
        Object.keys(feeds).forEach(function(key) {
            that.subscribe(feeds[key]);
        });
    }

    this.unsubscribe = function(feed) {
        //todo: do not unsubscribe a feed if another observer is using it
        console.log('unsubscribing from feed: ' + feed.id)
        if (that.ws) {
            this.ws.send(JSON.stringify({'action' : 'unsubscribe', 'guid' : feed.id}));
        }
        else {
            console.log('not currently connected');
        }
    }

    this.unsubscribeMany = function(feeds) {
        var that = this;
        Object.keys(feeds).forEach(function(key) {
            that.unsubscribe(feeds[key]);
        });
    }

    this.unsubscribeAll = function()
    {
        this.unsubscribeMany(this.feeds);
    }

    this.close = function()
    {
        this.ws.onclose = function () {};
        this.ws.onerror = function () {};
        this.unsubscribeAll();
        this.ws.close();
    }
}

