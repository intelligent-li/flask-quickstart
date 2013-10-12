# coding: utf-8
import sys
import ssl
import logging
import gevent

from ws4py.client.geventclient import WebSocketClient

def handle_feedsocket(upws):
    logging.debug ('starting intelligent.li websocket proxying') 
    
    try:
        ws = WebSocketClient(
            'wss://au.intelligent.li/api/v1/live/feeds', 
            protocols = ['http-only', 'chat'],
            ssl_options = { 'certfile' : 'client.pem', 'cert_reqs' : ssl.CERT_REQUIRED, 'ca_certs' : 'ca.crt' })

        ws.connect()
        
        def incoming():
            while True:
                m = ws.receive()
                if m is not None:
                    #print "<<<<<<" + str(m)
                    upws.send(str(m))
        
        def outgoing():               
            while True: 
                m = upws.receive() 
                if m is not None:
                    #print ">>>>>>" + str(m)
                    ws.send(str(m))

        greenlets = [
            gevent.spawn(incoming),
            gevent.spawn(outgoing),
        ]
        gevent.joinall(greenlets)

    except KeyboardInterrupt:
        ws.close()
    except Exception as e:
        logging.error("websocket stopped: " + str(e))

