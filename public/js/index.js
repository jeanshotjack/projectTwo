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
  getOneUser: function(id) {
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
      console.log(data);
      var $cardDiv = $("<div>").addClass("card mb-4");

      var $title = $("<h5>")
        .html(data[i].title)
        .attr({
          class: "card-title bolder-text",
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
        class: "btn btn-link float-right bio bio-modal",
        "data-toggle": "modal",
        "data-target": "#viewOtherBioModal",
        "data-id": data[i].account.id
      }).text("@" + data[i].account.username);

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

$(document).on("click", ".bio", function() {
  API.getOneUser($(this).attr("data-id")).then(function(data) {
    $("#viewOtherBioModalLabel").text("@" + data.username);
    $("#bioUser").text("Username: " + data.username);
    $("#bioPro").text("Pronouns: " + data.pronouns);
    $("#bioInsta").text("Insta: @" + data.insta);
    console.log(data);
  })
})

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var newPost = {
    title: $postName.val().trim(),
    body: $postBody.val().trim(),
    accountId: $submitBtn.attr("data-id")
  };

  if (!(newPost.title && newPost.body && newPost.accountId)) {
    alert("Please fill out both fields!");
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
