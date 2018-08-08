const init = require("./init.js");
const local_endpoint = "localhost:3030";

console.log("Opportunity Finder")

init();

setTimeout(function(){
    console.log("Waited for Sync");
}, 10000);
