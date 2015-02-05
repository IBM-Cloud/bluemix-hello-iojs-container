bluemix-hello-iojs-container
================================================================================

A "Hello World" server in [io.js](https://iojs.org/) sample for Bluemix
to run in a Container.

Before jumping into the code, make sure you have an IBM ID, by
registering at the
[IBM ID registration](https://www.ibm.com/account/profile/us?page=reg)
page.  You will need the IBM ID to login to BlueMix from the command line.

You will also need to install the `ice` command-line tool, along with
pre-reqs, with instructions available here:

* <http://www.ng.bluemix.net/docs/#services/Containers/index.html#container>



install the code for the sample program
--------------------------------------------------------------------------------

From a command/shell terminal
* `cd` into the parent directory you want to install the project in
* `git clone` the project into a child directory
* `cd` into that child directory
* run `npm install` to install dependencies

For example:

    $ cd Projects
    $ git clone https://hub.jazz.net/git/pmuellr/bluemix-hello-iojs-container

        ... git output here ...

    $ cd bluemix-hello-iojs-container

    $ npm install

        ... npm output here ...



run locally
--------------------------------------------------------------------------------

After installing, run the server using

    iojs server

This should print the following to the console.

    bluemix-hello-iojs-container: server starting on http://localhost:6088

(you will likely have a different port than 6088 in the message, use what's
in your message)

To use a different port on Mac and Linux, set the PORT environment variable
and restart the iojs server

    PORT=3001 iojs server

On Windows, set the PORT environment variable and restart the iojs server

    set PORT=3001
    iojs server

Once the server is running, test it by visiting the following URL in your
browser:

    http://localhost:6088/any/url

You should see the same content in the browser for every URL, which will be

    Hello World

In the command/shell terminal, you will see the following output:

    bluemix-hello-iojs-container: server starting on http://localhost:6088
    bluemix-hello-iojs-container: request GET /



building the Docker image for the Containers service
--------------------------------------------------------------------------------

    docker build -t  <userid>/hello-iojs .



running the Docker image locally
--------------------------------------------------------------------------------

    docker run -d -P <userid>/hello-iojs
    docker ps      # get port
    boot2docker ip # get ip address
    curl http:<ip-address>:port



running the Docker image on Bluemix
--------------------------------------------------------------------------------

    docker tag <userid>/hello-iojs registry-ice.ng.bluemix.net/<userid>/hello-iojs
    ice --local push               registry-ice.ng.bluemix.net/<userid>/hello-iojs
    ice run --name hello-iojs      registry-ice.ng.bluemix.net/<userid>/hello-iojs
    ice ip request # get ip-address
    ice ip bind <ip-address> hello-iojs
    open http://<ip-address>/
    open http://hello-iojs.muellerware.org/ # with DNS A-record



files in this repository
--------------------------------------------------------------------------------

`server.js`

The server written with [io.js](https://iojs.org/).  This server was adapted from the
*[example provided in the node.js docs](http://nodejs.org/api/synopsis.html)*,
but uses the [express package](https://www.npmjs.org/package/express)
for the web server.

Another difference is that the port, binding host, and url are determined
via the [`cfenv` package](https://www.npmjs.org/package/cfenv).  This will
return appropriate values both when running in Cloud Foundry and when running
locally.

---

`Dockerfile`

A standard Docker manifest used to build a Docker image.
[[user guide](https://docs.docker.com/userguide/dockerimages/)]
[[reference](https://docs.docker.com/reference/builder/)]
[[best practices](https://docs.docker.com/articles/dockerfile_best-practices/)]

---

`.gitignore`

List of file patterns that should **NOT** be stored in git.  If you aren't using
git, you don't need this file.  And the contents are personal preference.

See the npm google groups topic
*['node_modules in git' from FAQ](https://groups.google.com/forum/#!topic/npm-/8SRXhD6uMmk)*
for discussion.

---

`LICENSE`

The open source license for this sample; in this case, it's licensed under
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

---

`manifest.yml`

This file contains information that's used when you `cf push` the application.

See the Cloud Foundry doc
*[Deploying with Application Manifests](http://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html)*
for more information.

---

`package.json`

Standard package.json file for io.js packages.  You will need this file for two
reasons:

* identify your io.js package dependencies during `npm install`
* identify to BlueMix that this directory contains a io.js application

See the npm doc
*[package.json](https://npmjs.org/doc/json.html)*
for more information.

---

`README.md`

This file!
