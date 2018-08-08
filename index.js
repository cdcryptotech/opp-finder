const init = require("./init.js");
const analyze = require("./analyze_market.js");
var exchanges_by_market = require("./data/exchanges_by_market.json");
console.log("Opportunity Finder")
console.log(exchanges_by_market);
run();

async function run(){
  await init();
  exchanges_by_market = require("./data/exchanges_by_market.json");
  console.log(exchanges_by_market);
  var arbitrage_data = [];
  var i = 0;
  for(var market in exchanges_by_market){
    arbitrage_data = arbitrage_data.concat(await analyze(market, exchanges_by_market[market]));
    i++;
    if(i==5){
      break;
    }
  }
  console.log(arbitrage_data);
}
