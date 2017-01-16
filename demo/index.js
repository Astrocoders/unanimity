const {
  groupBy,
  flow,
  mapValues,
  flatten,
  values,
} = require('lodash/fp')
const unanimity = require('./index')

const ArticleSearcher = unanimity([
  getCrossRefWorkSearcherForParam({ param: 'query.title' }),
  getCrossRefWorkSearcherForParam({ param: 'query.author' }),
  getDataCiteSearcher(),
], {
  dataMerger(results){
    return flow(
      flatten,
      groupBy('DOI'),
      mapValues(sameDOIArticles => Object.assign(...sameDOIArticles)),
      values,
    )(results)
  },
})

function getCrossRefWorkSearcherForParam({ param }){
  return {
    url: `https://api.crossref.org/works?${param}`,
    queryHandler: ({ search, url }) => `${url}=${search.replace(/\s+/, '+').toLowerCase()}&rows=3`,
    responseHandler(data){
      return data.message.items.map(article => ({
        DOI: article.DOI,
        title: article['title'][0] ||article['container-title'][0] || article['original-title'][0],
        publisher: article.publisher,
        type: article.type,
        createdAt: article.created.timestamp,
        source: article.source,
        url: article.URL,
      }))
    },
  }
}

function getDataCiteSearcher(){
  return {
    url: 'https://api.datacite.org/works?query',
    queryHandler: ({ search, url }) => `${url}=${search.replace(/\s+/, '+').toLowerCase()}`,
    responseHandler(data){
      return data.data.map(article => ({
        DOI: article.attributes.doi,
        title: article.attributes.title,
        authors: article.attributes.author.map(author => author.literal || `${author.given} ${author.family}`),
        abstract: article.attributes.description,
        publisher: article.attributes.publisher,
        type: article.type,
        createdAt: article.attributes.deposited,
        source: 'DataCite',
        url: article.url || article.id,
      }))
    },
  }
}

ArticleSearcher
  .search('magnetics')
  .then(results => console.log('Normalized results', results))
  .catch(e => console.log(e))
