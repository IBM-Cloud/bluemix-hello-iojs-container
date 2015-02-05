// Licensed under the Apache License. See footer for details.

"use strict"

let pkg     = require("./package.json")
let express = require("express")
let ports   = require("ports")

// create the express app
let app = express()

let port = process.env.PORT || ports.getPort(pkg.name)

// have all GET requests handled by the onRequest function
app.get("*", onRequest)

// start the server, writing a message once it's actually started
app.listen(port, function() {
  log(`server starting on http://localhost:${port}`)
})

// all done! server should start listening and responding to requests!

//------------------------------------------------------------------------------
// when a request is sent to the server, respond with "Hello World" text
//------------------------------------------------------------------------------
function onRequest(request, response) {
  log(`request ${request.method} ${request.url}`)

  let html = "<h1>Hello, world!</h1>"

  response.send(html)
}

//------------------------------------------------------------------------------
// log a message with a common prefix of the package name
//------------------------------------------------------------------------------
function log(message) {
  console.log(`${pkg.name}: ${message}`)
}

//------------------------------------------------------------------------------
// Copyright 2014 Patrick Mueller
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------
