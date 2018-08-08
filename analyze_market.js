var options = {
  host: 'localhost',
  port: '3000'
};
const rest = require("./http-rest.js");
const exchange_data = require("./exchanges.json");
const fs = require('fs');

module.exports = async function(market, exchanges) {
  var price_data = [];
  for (var i = 0; i < exchanges.length; i++) {
    console.log("MKT: "+ market)
    options.path = "/markets/get_ticker?market=" + market + "&exchange=" + exchanges[i];
    console.log(options);
    price_data.push({
      "exchange": exchanges[i],
      "last": parseFloat((await rest(options)).last),
      "timestamp": new Date()
    });
  }

  var arbitrage_data = [];
  for (var i = 0; i < price_data.length - 1; i++) {
    for (var j = i + 1; j < price_data.length; j++) {
      var low_index;
      var high_index;
      if (price_data[i].last < price_data[j].last) {
        low_index = i;
        high_index = j;
      } else {
        low_index = j;
        high_index = i;
      }
      var low_data = price_data[low_index];
      var high_data = price_data[high_index];
    /*  //This needs to be cut down
      low_data.fees = exchange_data[low_data.exchange].fees;
      low_data.limits = exchange_data[low_data.exchange].limits;
      high_data.fees = exchange_data[high_data.exchange].fees;
      high_data.limits = exchange_data[high_data.exchange].limits;*/

      arbitrage_data.push({
        "market": market,
        "low": low_data,
        "high": high_data,
        "timestamp": Math.min(price_data[low_index].timestamp, price_data[high_index].timestamp),
        "difference": price_data[high_index].last / price_data[low_index].last - 1
      });

    }
  }
  console.log(arbitrage_data);
  return arbitrage_data;
}
