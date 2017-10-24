"use strict";

// Webpage Downloader from www& Dumpter 

const http = require("http");
const fs   = require("fs");
const XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;

const server = http.createServer();
const PORT   = 3000;

let n = 30; // from 1 to 421; // page to starting with

const cb = (readyState, status, responseText) => {
  if(readyState===4 && status===200){ // Only in this state get hte correct payload from server
    console.log("Get response from server");
    // console.log(status);
    // console.log(readyState);
    console.log("Gotten Page Number:", n);
    // console.log(responseText);
    // TODO: Process the payload, call the next recursion
    writeResults(responseText);
  }
};

const writeResults = newData => {
  fs.appendFile(
    "./results.txt", // file name
    newData,         // data to be appended
    {encoding:"utf8"}, // Opention
    () => {       // callback
      setTimeout(()=>{
        console.log("start to asking the next one.");
        n === 37
          ? console.log("Finish")
          : commitForECMA(cb, ++n); // 37 is the last page
      }
      , 5000); // do it slowly
      
    }
  );
};

const commitForECMA = (callback,num) => {  
  
  const request = new XMLHttpRequest();
  request.onreadystatechange= () => callback(request.readyState, request.status, request.responseText);

  /*
   * If turned on, it will ignore the timeout feature
   */
//   // request.timeout = 1000;
//   // request.ontimeout = () => {
//   //   console.log('REQUEST TIMED OUT!!!');
//   //   writeResults("MISSING PAGE:", n);
//   // };

//   const fromEle = ("http://app1.sfda.gov.cn/datasearcheng/face3/search.jsp?\
// tableId=85&State=1&bcId=136489131226659132460942000667&State=1&curstart="
//     + num +
//     "&State=1&tableName=TABLE85&State=1&viewtitleName=COLUMN1040&State=1\
// &viewsubTitleName=COLUMN1041,COLUMN1042,COLUMN1043,COLUMN1047&State=1&tableView=\
// Database%20of%20approved%20Active%20Pharmaceutical%20Ingredients%20(APIs)%20and\
// %20API%20manufacturers%20in%20China&State=1");

  const fromEle = "https://www.pharmacodia.com/web/drug/query";

//   console.log("Waiting for page:", num);
//   console.log();
//   console.log(fromEle);

  request.open("POST",fromEle);

  request.setRequestHeader("cache-control","no-cache"); 
  request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  
  // https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_forms_through_JavaScript
  const formData = "ns=1&page=" + num + "&size=80&records=2957&total=148&q.isq=true&q.field=highest_status&q.fieldShowName=Status&q.val=5&q.valShowName=Approved";

  request.send(formData); // TODO: Here I add "form data" into function send()
}

commitForECMA( cb, 1 ); // Initiation of the first request.

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
    res.write('<h1>API Pharmacodia!!!</h1>');
    res.write('<h5>a nodejs software get info from www.pharmacodia.com</h5>');
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