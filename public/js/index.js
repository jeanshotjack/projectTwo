// Get references to page elements
var $postName = $("#post-text");
var $postBody = $("#post-description");
var $submitBtn = $("#submit");
var $postList = $("#post-list");

// The API object contains methods for each kind of request we'll make
var API = {
  savePost: function(post) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/posts",
      data: JSON.stringify(post)
    });
  },
  getPosts: function() {
    return $.ajax({
      url: "api/posts",
      type: "GET"
    });
  },
  deletePost: function(id) {
    return $.ajax({
      url: "api/posts/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshPosts = function() {
  API.getPosts().then(function(data) {
    var $posts = data.map(function(post) {
      var $link = $("<a>")
        .text(post.text)
        .attr("href", "/post/" + post.id);

      var $list = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": post.id
        })
        .append($link);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $list.append($button);

      return $li;
    });

    $postList.empty();
    $postList.append($posts);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var newPost = {
    name: $postName.val().trim(),
    body: $postBody.val().trim()
  };

  if (!(newPost.name && newPost.body)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.savePost(newPost).then(function() {
    refreshPosts();
  });

  $postName.val("");
  $postBody.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deletePost(idToDelete).then(function() {
    refreshPosts();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$postList.on("click", ".delete", handleDeleteBtnClick);
