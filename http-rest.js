//Opp finder

"use strict";
var http = require('http');

module.exports = function(options){
  return new Promise(function(resolve, reject) {
    http.get(options, function(resp){
      //do something with chunk
      let data = '';
        // A chunk of data has been recieved
       
      resp.on('data', (chunk) => {  
        data += chunk; 
        console.log(chunk);
      });

      resp.on('end', () => {  
        console.log(data); 

        //VVVVV This is the important line VVVVV
        resolve(JSON.parse(data));
        //^^^^^ This is the important line ^^^^^

      });
    }).on("error", function(e){
      console.log("Got error: " + e.message);
    });
  });
}
