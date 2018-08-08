var options = {
  host: 'localhost',
  port: '3000'
};
const rest = require("./http-rest.js");
const fs = require('fs');

module.exports = async function(){
  return new Promise (function(resolve, reject){
      options.path = '/exchanges';
      //Get Exchanges
      rest(options).then(async function(result){
      //Get Market Lists from Exchanges
      var markets = {};
      for (var i = 0, len = result.length; i < len; i++) {
        options.path = '/markets/get_markets?exchange=' + result[i];
        markets[result[i]] = (await rest(options)).markets;
      }
      return markets;
    }).then(function(markets_by_exchange){
      //List exchanges based on market
      var exchanges_by_market={};
      var bq_market;
      var qb_market;
      for(var exchange in markets_by_exchange){
        for(var i=0; i<markets_by_exchange[exchange].length; i++){
          var market = markets_by_exchange[exchange][i];
          bq_market = market.base + "-" + market.quote;
          qb_market = market.quote + "-" + market.base;
          if(exchanges_by_market[bq_market]){
            exchanges_by_market[bq_market].push(exchange);
          } /*else if (exchanges_by_market[qb_market]){
            exchanges_by_market[qb_market].push(exchange);
          }*/ else {
            exchanges_by_market[bq_market] = [exchange];
          }
        }
      }
      return exchanges_by_market;
    }).then(async function(exchanges_by_market){
      var final_table = {};
      for(var market in exchanges_by_market){
        if(exchanges_by_market[market].length > 1){
          final_table[market] = exchanges_by_market[market];
        }
      }
      await fs.writeFile('./data/exchanges_by_market.json', JSON.stringify(final_table), 'utf8', function (err) {
          if (err) {
              return console.log(err);
          }

          console.log("exchanges_by_market.json has been updated");
      });
      resolve(true);
    });
  });
}
