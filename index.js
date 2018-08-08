const init = require("./init.js");
const analyze = require("./analyze_market.js");
const fs = require('fs');
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
  fs.writeFile('./data/arbitrage_opps.json', JSON.stringify(arbitrage_data), 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }

      console.log("exchanges_by_market.json has been updated");
  });
  console.log(arbitrage_data);
}
