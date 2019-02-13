let scraped = false 

// tooltip event
// Function to grab all articles stored in database
function getArticles () {
  $.getJSON('/articles', (data) => {
    if (data.length !== 0) {
      // create <p> tag for each article
      for (let i = 0; i < data.length; i++) {
        $('#articles').append(`<p data-id=${data[i]._id} class="ml-5 mb-0"><span class="headline" data-toggle="tooltip" data-placement="top" title="Click to Comment!">${data[i].headline}</span><br><small>${data[i].summary}</small><br><small><a href=${data[i].URLref} target="_blank">${data[i].URLref}</a></p><hr>`)
      }
      $("#scrapeNow").text('News Pulled!')
      $("#scrapeNow").addClass('disabled')
      $('[data-toggle="tooltip"]').tooltip({
        delay: 250
      })

      scraped = true 

    }
    else {
      $("#scrapeNow").text('No Articles stored: Pull News Now!')
      scraped = false 
    }
  })
}

// add comment behaviour 
// display form for user to enter a comment when user clicks headlines

$(document).on('click','p', function() {
  $("#comments").empty()
  location.href="#comments"
  let clickedId = $(this).attr('data-id')

  // GET request to retrieve article that was clicked 

  $.ajax({
    method: 'GET', 
    url: '/articles/' + clickedId,
    dataType: 'json'
  })
    .then(function(articleData)  {
      // article title 
      console.log(articleData)
      $("#comments").append("<h4>" + articleData.headline + "</h4>")
      $("#comments").append(`<div id="commentForm" class="form-group"><input class="form-control" id="inputTitle" type="text" name="title" placeholder="Give it a title"></div><div class="form-group"><textarea class="form-control" id="inputBody" name="body" placeholder="Type your comment!"></textarea></div><button id="submitComment" data-id="${articleData._id}" type="submit" class="btn btn-primary">Comment Now</button>`)
      if (articleData.comment) {
        $("#comments").append(`<button class="btn btn-danger mx-3" data-id="1">Delete Comment</button>`)

      }
      // add current comment, if there is one 
      if (articleData.comment) {
        console.log(articleData.comment)
        $("#inputTitle").val(articleData.comment.title)
        $("#inputBody").val(articleData.comment.body)
      }
    })
})

// comment button click behaviour 
// must be an event delegation as button is created dynamically

$("#comments").on('click','button', function(e) {
  e.preventDefault() 
  // grab id of article 
  let articleId = $(this).attr('data-id')
  console.log(articleId)
  // AJAX POST call to update comment 
  
  $.ajax({
    method: 'POST',
    url: '/articles/' + articleId,
    data: {
      title: $("#inputTitle").val(),
      body: $("#inputBody").val()
    }
  })
    .then((commentUpdateResponse) => {
      console.log(commentUpdateResponse)
      // empty comments section 
      $("#comments").empty()
    })
$("#inputTitle").empty()
$("#inputBody").empty()
})

// button to compare to NYT 
$("#compareToNYT").on('click', function(e){
  e.preventDefault()
  window.open('http://www.newyorktimes.com/','_blank')
  
})

// add click behaviour to scrape button
// invoke getArticles on document load 

window.onload = function(e) {
  getArticles()
  $("#scrapeNow").on('click',function(e) {
    if (scraped) {
      return 0 
    }
    
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
  