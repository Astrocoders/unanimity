'use strict';

var fetch = require('node-fetch');

function APIUnanimity(apis, _ref) {
  var _ref$dataMerger = _ref.dataMerger,
      dataMerger = _ref$dataMerger === undefined ? function (x) {
    return x;
  } : _ref$dataMerger;

  return {
    search: function search(searchParams) {
      return Promise.all(apis.map(function (api) {
        var url = api.queryHandler({
          url: api.url,
          search: searchParams
        });

        return fetch(url).then(function (response) {
          return response.json();
        }).then(function (data) {
          return api.responseHandler(data);
        });
      })).then(function (results) {
        return dataMerger(results);
      });
    }
  };
}

module.exports = APIUnanimity;