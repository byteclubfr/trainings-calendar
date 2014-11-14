"use strict";

/* eslint-env node */
/* globals open:true */ // allows overriding open

var connect = require("connect");
var optimist = require("optimist");
var http = require("http");
var path = require("path");
var open = require("open");
var serveStatic = require("instant");
var serveFavicon = require("serve-favicon");
var logger = require("morgan");
var compression = require("compression");
var errorHandler = require("errorhandler");


var argv = optimist(process.argv);
var root = path.resolve("src");

var app = connect();

app.use(serveStatic(root));
app.use(serveFavicon(path.join(root, "images", "favicon.png")));
app.use(logger("combined"));
app.use(compression());
app.use(errorHandler());

http.createServer(app).listen(argv.port || 8080).on("listening", function () {
  var url = "http://localhost:" + this.address().port;
  console.log("Server ready: %s", url);
  if (argv.open) {
    open(url);
  }
});
