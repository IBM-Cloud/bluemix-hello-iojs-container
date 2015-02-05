#-------------------------------------------------------------------------------
# build:
#   docker build -t  <userid>/hello-iojs .
#
# run locally:
#   docker run -d -P <userid>/hello-iojs
#   docker ps      # get port
#   boot2docker ip # get ip address
#   curl http:<ip-address>:port
#
# deploy on bluemix:
#   docker tag <userid>/hello-iojs registry-ice.ng.bluemix.net/<userid>/hello-iojs
#   ice --local push               registry-ice.ng.bluemix.net/<userid>/hello-iojs
#   ice run --name hello-iojs      registry-ice.ng.bluemix.net/<userid>/hello-iojs
#   ice ip request # get ip-address
#   ice ip bind <ip-address> hello-iojs
#   open http://<ip-address>/
#   open http://hello-iojs.muellerware.org/ # with DNS A-record
#-------------------------------------------------------------------------------

FROM iojs/iojs

RUN mkdir /app

COPY package.json /app/package.json
COPY server.js    /app/server.js

RUN cd /app; npm install

EXPOSE   80
ENV PORT 80

CMD iojs /app/server.js
