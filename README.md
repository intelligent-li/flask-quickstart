flask-quickstart
================

This is an example Intelligent.li application using Python Flask running on RedHat's Openshift platform. It serves as both an example Intelligent.li application and a template for you to quickly get started building your own Intelligent.li application. [Flask](http://flask.pocoo.org/) is a micro framework for quickly building web applications in Python.

These instructions assume you are familiar with, git and *NIX type systems, I'll be using OSX but the instructions should work for other systems such as Ubuntu and even Cygwin.

First we'll need to setup an account on Openshift (if you don't already have one), to do this follow the instructions [here](https://openshift.redhat.com/app/account/new).

Now, we'll install the Openshift client tools and update them:

     $ sudo gem install rhc
     $ gem update roc

and then setup your environment by running the following command and following the prompts

     $ rhc setup

When asked for a domain, choose one that is appropriate for your application, I used `Intelligentli`. We now create our application, I'm using the creative name of `flaskexample` but you can use whatever suits you. We'll be using a DIY Openshift cartridge with the code from the Intelligent.li github flask-quickstart.

    $ rhc create-app flaskexample python-2.7 --from-code https://github.com/intelligent-li/flask-quickstart.git
     
    Application Options
    -------------------
    Namespace:   intelligentli
    Cartridges:  python-2.7
    Source Code: https://github.com/intelligent-li/flask-quickstart.git
    Gear Size:   default
    Scaling:     no

    Creating application 'flaskexample' ... done

    Waiting for your DNS name to be available ... done
    
    Cloning into 'flaskexample'...
    Warning: Permanently added the RSA host key for IP address '54.234.174.227' to the list of known hosts.

    Your application 'flaskexample' is now available.

      URL:        http://flaskexample-intelligentli.rhcloud.com/
      SSH to:     5259beb94382ecb1c8000060@flaskexample-intelligentli.rhcloud.com
      Git remote: ssh://5259beb94382ecb1c8000060@flaskexample-intelligentli.rhcloud.com/~/git/flaskexample.git/
      Cloned to:  /Users/manderson/Documents/pscion/bigd/comfort-o-meter/flaskexample

    Run 'rhc show-app flaskexample' for more details about your app.


This step will clone the repository locally into a directory with the name of your application, e.g. `flask example`. Now point your browser to the URL `http://flaskexample-intelligentli.rhcloud.com/` (replacing the application and domain with the ones you have used) and see the front page of your new application up and running. 

There's one more thing we need to do, we need to give your application credentials to talk to Intelligent.li. To do this create a new key using the Intelligent.li management console, associate it with your scope, and download it locally. Copy the key into the root of your new repository as `client.pem` so that your application can connect to Intelligent.li. This key will determine which scope your Intelligent.li application has access to. 

     $ cd flaskexample
     $ cp ~/Downdloads/20c4c5e7-0331-4f40-8558-56debd9b33e7.pem ./client.pem
     $ git add ./client.pem

Now commit and push

     $ git commit
     $ git push origin master


    
