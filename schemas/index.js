//this file loads all schema files and exports as single object
var fs = require("fs");
var path = require("path");

var currentDir = __dirname;
//current file has to named as index.js. so that when requiring from other places will automatically 
//find this file.

currentFile = path.basename(__filename)
var schemas = {}

fs.readdirSync(currentDir).forEach(function(file) {
  if (file != currentFile) {
    //if file dont have ".", it returns empty string. so we have added || to give the filename in case of no "." in filename
    // var fileWithoutExtension = file.substr(0, file.lastIndexOf('.')) || file;
    //found an elegant way with path module
    var fileWithoutExtension = path.parse(file).name;
    schemas[fileWithoutExtension] = require('./' + file)
  }
});

module.exports = schemas;