
// get articles function (wrapping this)
function getArticles () {
  console.log('Call get articles')
  $.getJSON('/articles', (data) => {
    // create an article for each returned item
    for (let i = 0; i < data.length; i++) {
      $('#articles').append(`<p data-id=` + data[i]._id + ` class="ml-5"` + `>` + data[i].headline  + `<br> `+ data[i].URLref + `</p>`)
    }
  })
}


$(document).on('click','p', function() {
  $("#comments").empty()
  let clickedId = $(this).attr('data-id')

  // go get the article
  $.ajax({
    method: 'GET', 
    url: '/articles/' + clickedId,
    dataType: 'json'
  })
    .then(function(articleData)  {
      // article title 
      console.log(articleData)
      $("#comments").append("<h4>" + articleData.headline + "</h2>")

    })
})

window.onload = function(e) {
  console.log('onload event fired')
  getArticles()
  $("#scrapeNow").on('click',function(e) {
    $("#scrapeNow").text('Loading...')
    $.ajax({
      method: 'GET',
      url: '/scrape'
    })
      .then(function(data) {
        getArticles()
        $("#scrapeNow").text('Done!')
        $("#scrapeNow").unbind('click')
        $("#scrapeNow").addClass('disabled')
        
        
      })
      
  })
}
  