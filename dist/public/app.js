'use strict';

var scraped = false;
// Function to grab all articles stored in database
function getArticles() {
  $.getJSON('/articles', function (data) {
    if (data.length !== 0) {
      // create <p> tag for each article
      for (var i = 0; i < data.length; i++) {
        $('#articles').append('<p data-id=' + data[i]._id + ' class="ml-5"' + '>' + data[i].headline + '<br> ' + data[i].URLref + '</p><hr>');
      }
      $("#scrapeNow").text('News Pulled!');
      $("#scrapeNow").addClass('disabled');
      scraped = true;
    } else {
      $("#scrapeNow").text('No Articles stored: Pull News Now!');
      scraped = false;
    }
  });
}

// add comment behaviour 
// display form for user to enter a comment when user clicks headlines

$(document).on('click', 'p', function () {
  $("#comments").empty();
  var clickedId = $(this).attr('data-id');

  // GET request to retrieve article that was clicked 

  $.ajax({
    method: 'GET',
    url: '/articles/' + clickedId,
    dataType: 'json'
  }).then(function (articleData) {
    // article title 
    console.log(articleData);
    $("#comments").append("<h4>" + articleData.headline + "</h4>");
    $("#comments").append('<div class="form-group"><input class="form-control" id="inputTitle" type="text" name="title" placeholder="Give it a title"></div><div class="form-group"><textarea class="form-control" id="inputBody" name="body">Type your comment</textarea></div><button id="submitComment" data-id="' + articleData._id + '" type="submit" class="btn btn-primary">Comment Now</button>');

    // add current comment, if there is one 
    if (articleData.comment) {
      console.log(articleData.comment);
      $("#inputTitle").val(articleData.comment.title);
      $("#inputBody").val(articleData.comment.body);
    }
  });
});

// comment button click behaviour 
// must be an event delegation as button is created dynamically

$("#comments").on('click', 'button', function (e) {
  e.preventDefault();
  // grab id of article 
  var articleId = $(this).attr('data-id');
  console.log(articleId);
  // AJAX POST call to update comment 

  $.ajax({
    method: 'POST',
    url: '/articles/' + articleId,
    data: {
      title: $("#inputTitle").val(),
      body: $("#inputBody").val()
    }
  }).then(function (commentUpdateResponse) {
    console.log(commentUpdateResponse);
    // empty comments section 
    $("#comments").empty();
  });
  $("#inputTitle").empty();
  $("#inputBody").empty();
});

// add click behaviour to scrape button
// invoke getArticles on document load 

window.onload = function (e) {
  getArticles();
  $("#scrapeNow").on('click', function (e) {
    if (scraped) {
      return 0;
    }
    $("#scrapeNow").text('Loading...');
    $.ajax({
      method: 'GET',
      url: '/scrape'
    }).then(function (data) {
      getArticles();
    });
  });
};