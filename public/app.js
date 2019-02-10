// get articles 
$.getJSON('/articles', (data) => {
  // create an article for each returned item
  for (let i = 0; i < data.length; i++) {
    $('#articles').append(`<p data-id=` + data[i]._id + ` class="ml-5"` + `>` + data[i].headline  + `<br> `+ data[i].URLref + `</p>`)
  }
})

$(document).on('click','p', function() {
  let clickedId = $(this).attr('data-id')

  // go get the article
  $.ajax({
    method: 'GET', 
    url: '/articles/' + clickedId
  })
    .then((dbClickedArticle) => {
      console.log(dbClickedArticle)
    })
})