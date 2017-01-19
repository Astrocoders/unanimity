const fetch = require('node-fetch')

function APIUnanimity(apis, { dataMerger = x => x }){
  return {
    search(searchParams){
      return Promise
        .all(
          apis.map(api => {
            if(api.promise) return api.promise

            const url = api.queryHandler({
              url: api.url,
              search: searchParams,
            })

            return fetch(url)
              .then(response => response.json())
              .then(data => api.responseHandler(data))
          })
        )
        .then(results => dataMerger(results))
    }
  }
}

module.exports = APIUnanimity
