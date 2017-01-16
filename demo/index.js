const {
  groupBy,
  flow,
  mapValues,
  flatten,
  values,
  omitBy,
  isUndefined,
} = require('lodash/fp')
const unanimity = require('../index')
const getCrossRefWorkSearcherForParam = require('./get_crossref_searcher')
const getDataCiteSearcher = require('./get_datacite_searcher')

const ArticleSearcher = unanimity([
  getCrossRefWorkSearcherForParam({ param: 'query.title' }),
  getCrossRefWorkSearcherForParam({ param: 'query.author' }),
  getDataCiteSearcher(),
], {
  dataMerger(results){
    return flow(
      flatten,
      groupBy('DOI'),
      mapValues(sameDOIArticles => {
        const cleanedUpArticles = sameDOIArticles.map(omitBy(isUndefined))
        return Object.assign(...cleanedUpArticles)
      }),
      values
    )(results)
  },
})

ArticleSearcher
  .search('magnetics')
  .then(results => console.log('Normalized results', results))
  .catch(e => console.log(e))
