// Get references to page elements
var $postName = $("#post-text");
var $postBody = $("#post-description");
var $submitBtn = $("#submit");
var $postList = $("#post-list");
var $username = $("#username");

// request methods
var API = {
  // new post intake
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
  //method to pull from db
  getPosts: function() {
    return $.ajax({
      url: "api/posts",
      type: "GET"
    });
  },
  //delete
  deletePost: function(id) {
    return $.ajax({
      url: "api/posts/" + id,
      type: "DELETE"
    });
  },
  //user intake
  saveUser: function(user) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/users",
      data: JSON.stringify(user)
    });
  },
  //pulls users from db
  getUsers: function() {
    return $.ajax({
      url: "api/users",
      type: "GET"
    });
  },
  getOneUser: function() {
    var id = $(this).data("UserId");
    return $.ajax({
      method: "GET",
      url: "/api/users/" + id
    });
  }
};

// pulls new posts from db, repopulates feed on refresh
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

      //flag button
      var $button = $("<button>")
        .addClass("btn btn-outline-danger float-right flag")
        .text("ｘ");

      $list.append($button);

      return $list;
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
    title: $postName.val().trim(),
    body: $postBody.val().trim(),
    accountId: $username.val().trim()
  };

  if (!(newPost.title && newPost.body && newPost.accountId)) {
    alert("You must enter an example text, description, and user!");
    return;
  }

  API.savePost(newPost).then(function() {
    refreshPosts();
  });

  $postName.val("");
  $postBody.val("");
  $username.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
// var handleDeleteBtnClick = function() {
//   var idToDelete = $(this)
//     .parent()
//     .attr("data-id");

//   API.deletePost(idToDelete).then(function() {
//     refreshPosts();
//   });
// };

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
// $postList.on("click", ".delete", handleDeleteBtnClick);
// here there should be a call to a flag function probably
