"use strict";

const fs = require("fs");
const readline = require('readline');

const subS = "javascript:commitForECMA"; // substring that only exist in the lines which I need
const str1 = "null)>"; // substring which define the start of name of the medicine, before this, is only codes
const str2 = "</p>"; // substring defined the end position of each result line where I'd like to cut to.

let n = 0; // counter for how many lines are found

const lineTrimmer = line => {
  const start = line.indexOf(str1) + 6;
  const stop  = line.indexOf(str2);
  const trimmed = line.substring(start, stop);

  const mid = trimmed.split("(");
  let name = mid[0];
  name = name.substring(0, name.length-1);
  const number = name.split(".")[0];
  name = name.split(".")[1];
  
  const arrFirma = mid[1].split(" ");
  const firma = arrFirma.reduce((acc, val, index) => {
    if(index !== 0 && index !== 1 && index !== arrFirma.length-1)
      if(index === 2)
        return val;
      else
        return acc +" "+ val;
    else
      return acc;
  }, "");
  return (number + ";" + name + ";" + firma + "\n"); // "Divider is here"
};

const resultWriter = line => {
  fs.appendFile(
    "./parserResults.txt", // target file
    lineTrimmer(line), // content to be write
    {encoding:"utf8"}, // options
    () => { // callback
      // console.log("Append one line");
    }
  );
};

var lineReader = readline
  .createInterface({
  input: fs.createReadStream("./results.txt")
});

lineReader.on('line', line => {
  console.log("Found Line: ", n++);
  // console.log('Line from file:', line);
  const yes = line.indexOf(subS) !== -1 ? true : false;
  if(yes) resultWriter(line);
});