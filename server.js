// Licensed under the Apache License. See footer for details.

"use strict"
// use strict required for usage of `let`

let Hapi = require("hapi")

// get the port to use
let port = process.env.PORT || "3000"

// create the hapi server
let server = new Hapi.Server()

// have it listen on the specified port
server.connection({ port })

// add a route for the main page
server.route({
  method: "GET",
  path:   "/",
  handler: (request, reply) =>
    reply("Hello, world!")
})

// start the server
server.start()

console.log (`server started on port ${port}`)

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
