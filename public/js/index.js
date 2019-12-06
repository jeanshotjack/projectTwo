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
  },
  updateUser: function(user) {
    $.ajax({
      method: "PUT",
      url: "/api/users",
      data: user
    }).then(getUsers);
  }
};

// pulls new posts from db, repopulates feed on refresh
var refreshPosts = function() {
  API.getPosts().then(function(data) {
    $postList.empty();

    // var $posts = data.map(function(post) {
    for (var i = 0; i < data.length; i++) {
      var $cardDiv = $("<div>").addClass("card mb-4");

      var $title = $("<h3>")
        .html(data[i].title)
        .attr({
          class: "card-title",
          "data-title": data[i].title
        });

      var $text = $("<p>")
        .html(data[i].body)
        .attr({
          class: "card-text",
          "data-body": data[i].body
        });

      var $icon = $("<i>").attr({
        class: "material-icons float-right flag",
        text: "outlined-flag"
      });

      var $userButton = $("<button>").attr({
        type: "button",
        class: "btn btn-link float-right",
        "data-toggle": "modal",
        "data-target": "#viewOtherBioModal",
        "data-whatever": data[i].accountId
      });

      var $card = $("<div>")
        .attr({
          class: "card-body",
          "data-id": data[i].id
        })
        .append($title);

      $card.append($icon);

      $card.append($text);

      $card.append($userButton);

      $cardDiv.append($card);

      $postList.prepend($cardDiv);
    }

    //   return $cardDiv;
    // });

    // console.log($cardDiv);
    // $postList.prepend($posts);
  });
};
refreshPosts();

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var newPost = {
    title: $postName.val().trim(),
    body: $postBody.val().trim(),
    accountId: user.id
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

  $("#newPostModal").hide();
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
// $postList.on("click", ".delete", handleDeleteBtnClick);
// here there should be a call to a flag function probably
