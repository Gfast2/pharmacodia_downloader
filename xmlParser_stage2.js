"use strict";

const http = require("http");
const fs   = require("fs");
const xml2js = require('xml2js');
const readline = require('readline');
const XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;

const server = http.createServer();
const PORT   = 3000;

const WORKING_TARGET = "parserResults.txt";

let writerFlag = false;
let n = 30; // from 1 to 421; // page to starting with

let rs = undefined; // results hook

var parser = new xml2js.Parser();

fs.readFile(__dirname + '/' + WORKING_TARGET, 'utf8', (err, data) => {
    console.log(data);
    parser.parseString(data, (err, result) => {
        console.log(result);
        rs = result; // pass the result
    })
    console.log("DONE 1");
});

const resultWriter = line => {
  fs.appendFile(
    "./parserResults_stage2.txt", // target file
    line + '\n', // content to be write
    {encoding:"utf8"}, // options
    () => { // callback
      // console.log("Append one line");
    }
  );
};

const lineReader = readline.createInterface(
  {
    input: fs.createReadStream(__dirname + '/' + WORKING_TARGET)
  }
);

server
  .on("request", (req, res) => {

  const url = req.url; // What is the request
  switch(url){
    case "/":
    case "/state":
    // res.writeHead(200, {"Content-Type": "plain/text"});
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write('<!DOCTYPE html>');
    res.write('<head>');
    res.write('<meta charset="UTF-8">');
    res.write('</head>');
    res.write('<html>');
    res.write('<body>');
    res.write('<h1>API Pharmacodia (parser stage 2)!!!</h1>');
    res.write('<h5>a nodejs parser parse data from www.pharmacodia.com</h5>');
    res.write('<div id="pageForm" /div>');
    res.write('</body>');
    res.write('</html>');
    res.end();
    break;
    case "/tester":
    res.writeHead(200, {'Content-Type':'text/html'});
    res.write('<!DOCTYPE html>');
    res.write('<head>');
    res.write('<meta charset="UTF-8">');
    res.write('</head>');
    res.write('<html>');
    res.write('<body>');
    res.write('<h1>This is a test</h1>');
    res.write('</body>');
    res.write('</html>');
    res.end();
    break;
  }
  })
  .listen(PORT);

console.log("Server started on port ", PORT);