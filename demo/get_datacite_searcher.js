module.exports = function getDataCiteSearcher(){
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
