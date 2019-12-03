// Get references to page elements
var $postText = $("#post-text");
var $postDescription = $("#post-description");
var $submitBtn = $("#submit");
var $postList = $("#post-list");

// The api object contains methods for each kind of request we'll make
var api = {
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
  getPost: function() {
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

// refreshposts gets new posts from the db and repopulates the list
var refreshPost = function() {
  api.getposts().then(function(data) {
    var $posts = data.map(function(post) {
      var $a = $("<a>")
        .text(post.text)
        .attr("href", "/post/" + post.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": post.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $postList.empty();
    $postList.append($posts);
  });
};

// handleFormSubmit is called whenever we submit a new post
// Save the new post to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var post = {
    text: $postText.val().trim(),
    description: $postDescription.val().trim()
  };

  if (!(post.text && post.description)) {
    alert("You must enter an post text and description!");
    return;
  }

  api.savepost(post).then(function() {
    refreshPost();
  });

  $postText.val("");
  $postDescription.val("");
};

// handleDeleteBtnClick is called when an post's delete button is clicked
// Remove the post from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  api.deletePost(idToDelete).then(function() {
    refreshPost();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$postList.on("click", ".delete", handleDeleteBtnClick);
