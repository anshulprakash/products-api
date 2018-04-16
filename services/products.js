'use strict';
const request = require('request');
const async = require('async');
const _ = require('underscore');
const productData = require('./data.json');

class Products {
  constructor() { };
  getProducts(req, res) {
    this.prepareRecord()
    .then(data => res.status(200).send(data)).catch(err=> res.send(err));
  };
  getProduct(req, res) {
    this.prepareRecord(req.params.productName).then(data => res.status(200).send(data))
  }
  prepareRecord(productName) {
    let self = this;
    return new Promise((resolve, reject) => {
      let result;
      self.executeRequest().then((data) => {
        console.log(data);
        result = _.map(data[0], (item) => {
          return _.extend(item, _.findWhere(data[1], { name: item.name }));
        });
        if (productName) {
          let matchedProduct = result[_.indexOf(_.pluck(result, 'name'), productName)];
          matchedProduct = matchedProduct ? matchedProduct : { status: false, message: 'Data not found' };
          resolve(matchedProduct);
        } else {
          resolve(result);
        }
      }).catch(err=> reject(err))
    })
  }
  executeRequest() {
    return new Promise((resolve, reject) => {
      async.parallel([
        (callback) => {
          request({
            method: 'GET',
            uri: 'http://autumn-resonance-1298.getsandbox.com/products'
          },
            (error, response, body) => {
              let obj={};
              if (typeof body === 'string')
                body = JSON.parse(body);
              obj.products=body;
              obj=_.each(obj.products,(item)=>{
                if(!item.price) item.price='N/A'
              })
              if (error) callback(err);
              else callback(null, obj);
            });
        },
        (callback) => {
          request({
            method: 'GET',
            uri: 'http://autumn-resonance-1298.getsandbox.com/inventory'
          },
            (error, response, body) => {
              if (typeof body === 'string')
                body = JSON.parse(body);
                body=_.each(body.inventory,(item)=>{
                  if(!item.inventory) item.inventory='N/A'
                })
              if (error) callback(err);
              else callback(null, body);
            });
        }
      ],
        // optional callback
        (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(results);
          }
          // the results array will equal ['one','two'] even though
          // the second function had a shorter timeout.
        });
    })
  }
}
module.exports = new Products();