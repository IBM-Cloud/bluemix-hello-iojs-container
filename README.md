<!-- using Docker containers on Bluemix -->

One of the cool new services available in Bluemix is the Containers service. The Containers service is a way to run a Docker container on the Bluemix platform.  In this blog post, I'll show how to use an "off the shelf" (off the hub?) Docker image to deploy an [io.js][] application in Bluemix.

Before getting started, you're going to have to install Docker, and learn the basics of how to use it.  To install Docker on your machine, follow the instructions at the [installation guide at the Docker docs site][docker-install].

Once you have Docker installed, you can learn how to use it by reading and following along with the following user guide pages.  Note, these pages are linked; a link to the next page is at the bottom of each page.

* [Dockerizing Applications: A "Hello world"][docker-intro-1]
* [Working with Containers][docker-intro-2]
* [Working with Docker Images][docker-intro-3]

After working through these pages, you'll have enough of an understanding of Docker to follow along with the rest of this blog post.

To run a Docker container on Bluemix, you'll also have to have the IBM Containers Extensionn package (aka the `ice` command) installed. Installation instructions for `ice` are available on the [Getting started with Containers **THIS LINK IS BROKEN**][containers-help] page at Bluemix.

As the last setup item, let's add the Containers service to our Bluemix Account.  Start at <https://console.ng.bluemix.net/>, click on the **CATALOG** page link, then in the **Integration** category select the **Containers** service.

Click the **CREATE** button when the **Add Service** dialog appears.  This will prompt you to create a short name for your registry.  I use my email address, eliding the characters which aren't legal.  We'll be referring to this short name later as `<userid>`.  Click **SAVE** and you'll be take to a page which displays your **Registry URL** and **API authentication key**.  We'll be referring to these later.

All right, now that you have Docker installed and know some basics, have `ice` installed, and the Containers service set up, let's get started!

We'll start by running the app locally without Docker, then building our Docker image and running it in Docker locally, and then once it's working, push it up to Bluemix and run it on Bluemix.



Running the app locally without Docker
--------------------------------------------------------------------------------

The app that we're going to publish is at the GitHub repo <https://github.com/IBM-Bluemix/bluemix-hello-iojs-container>, so let's start with a

    git clone https://github.com/IBM-Bluemix/bluemix-hello-iojs-container.git

You'll want to run install the pre-req packages, so run

    npm install

You can launch the server by running

    iojs --harmony_arrow_functions --harmony_object_literals /app/server.js

I'm going whole-hawg on the ES6 features here, sorry for the `--harmony_*` options.

This should start up a server on port 3000, which just displays the string "Hello, world!" when you visit the page at <http://localhost:3000>.  You can run it on a different port by setting the environment variable `PORT` to a different port number.

OK, the app is ready to go, so let's build a Docker image for it.



Bulding a Docker image
--------------------------------------------------------------------------------

To build a Docker image for our app, we'll need to start with a base image, and then add all the bits to it.  You can look for a suitable base image by perusing [Docker Hub][docker-hub] and then doing a search for the bits you need.  In this case, if you search for "iojs", you'll find a handy-looking [base image named "iojs"][docker-hub-iojs].  Looks good!

What we're going to do at this point is build our image with a `Dockerfile`; one has already been provided in the `bluemix-hello-iojs-container` project.

Here are the contents:

    # base image; see: https://registry.hub.docker.com/_/iojs/
    FROM iojs:1.2

    # we'll put our app contents in the /app directory
    RUN mkdir /app

    # copy our app to the /app directory
    COPY . /app

    # we'll need to run npm install to install pre-reqs
    RUN cd /app; npm install

    # lets run this app on port 80
    EXPOSE 80

    # tell the app to run the app on port 80 also
    ENV PORT 80

    # run the app
    CMD iojs --harmony_arrow_functions --harmony_object_literals /app/server.js

To build this docker image, you'll want to have docker fired up; if you're using [`boot2docker`][boot2docker], you'll use `boot2docker up` to get docker fired up. From the project directory, run the following command, which will create an image named `hello/iojs`.  

    sudo docker build -t hello/iojs .

This will use the file `Dockerfile` in the current directory to build an image named `hello/iojs` (via the `-t` option), with the contents of the current directory (via the `.` parameter)

*Note on the `sudo` command prefix above.  Depending on your environment, you may need to prefix `docker` and `ice` commands with `sudo`, or you may not have to.  For example, on my Mac, I have `/usr/local` set up as writable for my primary userid, so turns out I don't need `sudo`.  `sudo` is also not needed for Windows.*

The first time you run that docker command, the base image will need to be downloaded from the public Docker registry, which may take some minutes. Subsequent invokes of docker commands that reference that base image will be instantaneous, as the image will be cached locally.

Running `sudo docker images`, you should see the new images available:

    $ sudo docker images
    REPOSITORY  TAG    IMAGE ID      CREATED         VIRTUAL SIZE
    hello/iojs  latest 63f32d520034  2 minutes ago   709.6 MB
    iojs        1.2    17c7395715bc  11 days ago     697.9 MB



Running a Docker image locally
--------------------------------------------------------------------------------

Now lets run that image locally, by running `docker run`:

    $ sudo docker run -d -P hello/iojs
    97cce2ff2c88e67c092c2ce966f10752a3181d01f7a52fb4fef6e001daa927e8

That long "number" you see in the output is the container id; you can see a short version of that, which is all you would ever need, with the `docker ps` command:

    $ sudo docker ps
    CONTAINER ID  IMAGE              ...  PORTS                  ...
    97cce2ff2c88  hello/iojs:latest  ...  0.0.0.0:49155->80/tcp  ...

This status also tells us what port got mapped to port 80 in the container; in this case, it's port 49155.  Since I'm using `boot2docker`, I also need to figure out what the ip address is of the docker container, which you can do with the `boot2docker ip` command:

    $ boot2docker ip
    192.168.59.103

So, now I can access the web page at <http://192.168.59.103:49155> (your URL will probably be different).

    $ curl http://192.168.59.103:49155
    Hello, world!



Running a Docker image on Bluemix
--------------------------------------------------------------------------------

To use the Bluemix Containers service to run Docker containers, you'll need to do a one-time registration using the `ice` command, using the values previously assigned when you created the Containers service.  You can always get these values by navigating to the service in the Bluemix dashboard to view the information.  Remember that your **Registry URL** ends with your short name, which I will reference in examples as `<userid>`.

The one-time registry command is below, separated into separate lines with a backlash at the end of the line, for readability

    $ sudo ice login -k <API authentication key> \
              -H https://api-ice.ng.bluemix.net/v1.0/containers \
              -R registry-ice.ng.bluemix.net

Next, let's tag our image into the Bluemix docker image repository:

    $ sudo docker tag hello/iojs registry-ice.ng.bluemix.net/<userid>/hello-iojs

Next, we'll push the docker image into the Bluemix docker image repository:

    $ sudo docker push registry-ice.ng.bluemix.net/<userid>/hello-iojs

This will take some time, the first time, as the image gets pushed up to Bluemix; subsequent pushes will just push up diffs, not the entire set of images.

To make sure the image is available, run `ice images`, and you should see the image up there:

    $ sudo ice images
    Image Id ...  Image Name
    c87b5faf-...  <userid>/hello-iojs:latest
    e93227b7-...  ibmliberty:latest
    9afb8dc0-...  ibmnode:latest

Let's run the image in a container with the `ice run` command:

    $ sudo ice run --name hello-iojs registry-ice.ng.bluemix.net/<userid>/hello-iojs
    cb484579-582c-4c10-8b5c-61906fb57a30

Again, this gives us the container id, which we can also see with the `ice ps` command:

    $ sudo ice ps
    Container Id  ... Image                          Public IP Ports
    cb484579-582c-... <userid>/hello-iojs:lates                []

Notice that we don't have a public IP; we'll get that via the `ice ip request` command:

    $ sudo ice ip request
    Successfully obtained ip: "<ip-address>"

You'll get an an ip address printed where I have `<ip-address>` above.

We can then bind that ip address to our container:

    $ sudo ice ip bind <ip-address> hello-iojs

All done!  We can now access our container via the url `http://<ip-address>`

    $ curl <ip-address>
    Hello, world!

If you use a DNS service, you can bind that ip address to a domain you own, with an A record.  

And that's it!  You've successfully deployed a Docker container on Bluemix.



For more information
--------------------------------------------------------------------------------

For additional information on using the Containers service in Bluemix, here are some great references:

* [online help: !!! HELP FOR CONTAINERS NOT FOUND !!!][containers-help]
* [RedPaper: "Bluemix Architecture Series: Web Application Hosting on IBM Containers"][containers-book]
* [blog post: "Bluemix Launches IBM Containers Beta Based on Docker"][containers-blog-1]
* [blog post: "Docker, Bluemix and the IBM Containers service"][containers-blog-2]
* [blog post: "Choose IBM’s Docker-based Container Service on Bluemix for your I/O intensive code"][containers-blog-3]

<!-- ======================================================================= -->

[containers-help]:   https://www.ng.bluemix.net/docs/#services/Containers/index.html#container
[containers-book]:   http://www.redbooks.ibm.com/Redbooks.nsf/RedbookAbstracts/redp5181.html
[containers-blog-1]: https://developer.ibm.com/bluemix/2014/12/04/ibm-containers-beta-docker/
[containers-blog-2]: https://cloudleader.wordpress.com/2015/01/11/docker-bluemix-and-the-ibm-container-service/
[containers-blog-3]: http://www.cloudswithcarl.com/?p=63
[io.js]:             https://iojs.org/
[docker-hub]:        https://registry.hub.docker.com/
[docker-hub-iojs]:   https://registry.hub.docker.com/_/iojs/
[docker-install]:    https://docs.docker.com/installation/
[docker-intro-1]:    https://docs.docker.com/userguide/dockerizing/
[docker-intro-2]:    https://docs.docker.com/userguide/usingdocker/
[docker-intro-3]:    https://docs.docker.com/userguide/dockerimages/
[boot2docker]:       http://boot2docker.io/
[Bluemix dashboard]: https://console.ng.bluemix.net
