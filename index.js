const fetch = require('node-fetch')

type API = {
  url: string,
  responseHandler: () => any,
  queryHandler: () => any,
}

function APIUnanimity(apis: Array<API> = [], { dataMerger = x => x }){
  return {
    search(searchParams){
      return Promise
        .all(
          apis.map(api => {
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
