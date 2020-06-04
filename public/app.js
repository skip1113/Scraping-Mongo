$.getJSON("/headlines", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#news").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].text + "<br />" + data[i].link + "</p>"
      + "<button class='save' data-id='" + data[i]._id + "'>" + 'Save' + "</button>" + "<button class='unSave'>" + "Unsave" + "</button>" + "<hr>");

  }
});
// $(document).on("click", "#deletenote", deletenote);
// $(document).on("click", ".save", function () {
//   var thisId = $(this).attr("data-id");
  
// })
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag

  var thisId = $(this).attr("data-id");
  console.log("thisId" + thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/headlines/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      // var data = data[0];
      console.log(data, " Line 30");
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' placeholder='Title'>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Your Note'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
      // If there's a note in the article
      console.log(data.note);
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note[0].title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note[0].body);
      }
    });
});
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  var title = $("#titleinput").val();
  var body = $("#bodyinput").val();
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/headlines/" + thisId,
    data: {
      // Value taken from title input
      title: title,
      // title: $("#titleinput").val();
      // Value taken from note textarea
      body: body
      // body: $("#bodyinput").val();
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#deletenote", function () {
  // Run a DELETE request to change the note, using what's entered in the inputs
  // var selected = $(this).parent();
  // console.log(JSON.stringify($(this).attr("data-id")));
  var thisId = $(this).attr("data-id");
  $.ajax({
    type: "PUT",
    url: "/notes/" + thisId,
    
      
    success: function (response) {
      // selected.re();
      $("#titleinput").val("");
      $("#bodyinput").val("");
      
  }
    
    
  });
});
//   $(document).on("click", ".markread", function() {
//     var thisId = $(this).attr("data-id");
//     $.ajax({
//       type: "PUT",
//       url: "/markread/" + thisId
//     });
//     $(this).parents("tr").remove();
//     getRead();
//   });

//   // Click event to mark a book as not read
//   $(document).on("click", ".markunread", function() {
//     var thisId = $(this).attr("data-id");
//     $.ajax({
//       type: "PUT",
//       url: "/markunread/" + thisId
//     });
//     $(this).parents("tr").remove();
//     getUnread();
//   });
//   // Load unread books and render them to the screen
// function getUnread() {
//   $("#unread").empty();
//   $.getJSON("/unread", function(data) {
//     for (var i = 0; i < data.length; i++) {
//       $("#unread").prepend("<tr><td>" + data[i].title + "</td><td>" + data[i].author +
//         "</td><td><button class='markread' data-id='" + data[i]._id + "'>Mark Read</button></td></tr>");
//     }
//     $("#unread").prepend("<tr><th>Title</th><th>Author</th><th>Read/Unread</th></tr>");
//   });
// }

// // Load read books and render them to the screen
// function getRead() {
//   $("#read").empty();
//   $.getJSON("/read", function(data) {
//     for (var i = 0; i < data.length; i++) {
//       $("#read").prepend("<tr><td>" + data[i].title + "</td><td>" + data[i].author +
//         "</td><td><button class='markunread' data-id='" + data[i]._id + "'>Mark Unread</button></td></tr>");
//     }
//     $("#read").prepend("<tr><th>Title</th><th>Author</th><th>Read/Unread</th></tr>");
//   });
// }

// // Calling our functions
// getUnread();
// getRead();