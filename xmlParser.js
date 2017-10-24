"use strict";

// Stage one parser that read downloader lownloaded files and filter out from 
// original html file the table block that contain all the use full infomation
// and filter out all single line comments

const http = require("http");
const fs   = require("fs");
const xml2js = require('xml2js');
const readline = require('readline');
const XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;

const server = http.createServer();
const PORT   = 3000;

const WORKING_TARGET = "rawResultsSum.txt";

let writerFlag = false;

const resultWriter = line => {
  fs.appendFile(
    "./parserResults.txt", // target file
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

lineReader.on(
  'line', 
  line => {
    if( line.includes("列表样式begin") ){ // Start of the infomation block
      console.log("Start target.");
      writerFlag = true;
    }
    if( line.includes("列表样式end") ){ // End of the information block
      console.log("Stop target.");
      writerFlag = false;
    }

    if(writerFlag === true){ // When the information worth to be recorded
      if( !(/^\s*$/.test(line)) ) { // When the line is empty or filled with whitespace
        if(
          (line.includes("<!--") && line.includes("-->")) && 
          !line.includes("</div>") 
        ){
          // console.log(line);
        } else {
          // console.log(line);
          resultWriter(line);
        }
      }
    }
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
    res.write('<h1>API Pharmacodia (parser)!!!</h1>');
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