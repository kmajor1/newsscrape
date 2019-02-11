
// get articles function (wrapping this)
function getArticles () {
  console.log('Call get articles')
  $.getJSON('/articles', (data) => {
    if (data.length !== 0) {
      // create <p> tag for each article
      for (let i = 0; i < data.length; i++) {
        $('#articles').append(`<p data-id=` + data[i]._id + ` class="ml-5"` + `>` + data[i].headline  + `<br> `+ data[i].URLref + `</p>`)
      }
      $("#scrapeNow").text('News Pulled!')
      $("#scrapeNow").addClass('disabled')

    }
    else {
      $("#scrapeNow").text('No Articles stored: Pull News Now!')

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
  getArticles()
  $("#scrapeNow").on('click',function(e) {
    $("#scrapeNow").text('Loading...')
    $.ajax({
      method: 'GET',
      url: '/scrape'
    })
      .then(function(data) {
        getArticles()
      })
      
  })
}
  