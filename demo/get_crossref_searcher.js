module.exports = function getCrossRefWorkSearcherForParam({ param }){
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
