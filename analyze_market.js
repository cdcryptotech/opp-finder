var options = {
  host: 'localhost',
  port: '3000'
};
const rest = require("./http-rest.js");

module.exports = async function(market, exchanges){
  var price_data = [];
  for(var i=0; i<exchanges.length; i++){
    options.path = "/markets/get_ticker?market=" + market + "&exchange=" + exchanges[i];
    console.log(options);
    price_data.push({"exchange":exchanges[i], "last": parseFloat((await rest(options)).last), "timestamp": new Date()});
  }

  var arbitrage_data = [];
  for(var i=0; i<price_data.length-1; i++){
    for(var j=i+1; j<price_data.length; j++){
      var low_index;
      var high_index;
      if(price_data[i].last < price_data[j].last){
        low_index = i;
        high_index = j;
      } else {
        low_index = j;
        high_index = i;
      }
      arbitrage_data.push({
        "low": price_data[low_index],
        "high": price_data[high_index],
        "timestamp": Math.min(price_data[low_index].timestamp, price_data[high_index].timestamp),
        "difference": price_data[high_index].last/price_data[low_index].last - 1
      });
    }
  }
  console.log(arbitrage_data);
  return arbitrage_data;
}
