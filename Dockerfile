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
