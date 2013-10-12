# coding: utf-8
import os
import urllib2, httplib
import logging

class HTTPSClientAuthHandler(urllib2.HTTPSHandler):
    def __init__(self, cert):
        urllib2.HTTPSHandler.__init__(self)
        self.cert = cert

    def https_open(self, req):
        # Rather than pass in a reference to a connection class, we pass in
        # a reference to a function which, for all intents and purposes,
        # will behave as a constructor
        return self.do_open(self.getConnection, req)

    def getConnection(self, host, timeout=300):
        return httplib.HTTPSConnection(host, cert_file=self.cert)


def handle_request(path = ''):
    opener = urllib2.build_opener(HTTPSClientAuthHandler('client.pem') )
    response = opener.open("https://au.intelligent.li{0}".format(path))
    return response.read()




