$.getJSON("/headlines", function (data) {
  $("#news").empty();
  // For each one
  $("#news").append("<tr><th>" + "News Feed" + "</th></tr>");
  for (let i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    
    $("#news").append("<tr><td style='text-align: center;'>" + "<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].text + "<br />" + "</p>" + "<a>" +"www.Time.com" + data[i].link + "</a>"
      + "<br />" + "<button class='save' data-id='" + data[i]._id + "'>" + 'Save' + "</button>" + "</td></tr>");

  }
});
// $(document).on("click", "#deletenote", deletenote);
// $(document).on("click", ".save", function () {
//   let thisId = $(this).attr("data-id");
  
// })
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag

  let thisId = $(this).attr("data-id");
  console.log("thisId" + thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/headlines/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      // let data = data[0];
      // console.log(data, " Line 30");
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
  let thisId = $(this).attr("data-id");
  let title = $("#titleinput").val();
  let body = $("#bodyinput").val();
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
  
  let thisId = $(this).attr("data-id");
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
// Save article
  $(document).on("click", ".save", function() {
    let thisId = $(this).attr("data-id");
    console.log(thisId);
    $.ajax({
      type: "PUT",
      url: "/saved/" + thisId
    });
    $(this).parents("tr").remove();
    getRead();
  });

  // Click event to unsave a article
  $(document).on("click", ".unsave", function() {
    let thisId = $(this).attr("data-id");
    $.ajax({
      type: "PUT",
      url: "/unsaved/" + thisId
    });
    $(this).parents("tr").remove();
    getUnread();
  });
  // Load unread books and render them to the screen
function getUnread() {
  $("#unread").empty();
  $.getJSON("/unsaved", function(data) {
    for (let i = 0; i < data.length; i++) {
      $("#unread").append("<tr><td>" + data[i].title + "</td><td>" +
        "</td><td><button class='markread' data-id='" + data[i]._id + "'>Save</button></td></tr>");
    }
    // $("#unread").prepend("<tr><th>Title</th><th>Author</th><th>Read/Unread</th></tr>");
  });
}

// Load read books and render them to the screen
function getRead() {
  $("#saved").empty();
  $.getJSON("/saved", function(data) {
    $("#saved").append("<tr><th>" + "Saved Articles" + "</tr></th>");
    for (let i = 0; i < data.length; i++) {
      
      $("#saved").append("<tr><td style='text-align: center;'>" + data[i].title + "<br />" + "<a>" +"www.Time.com" + data[i].link + "</a>" +
         "<br />" + "<button class='unsave' data-id='" + data[i]._id + "'>Unsave</button></td></tr>" + "<hr>");
    }
    
  });
}
getRead();
// Calling our functions
getUnread();
