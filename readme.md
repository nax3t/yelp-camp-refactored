# Collapsible Comment Section Upgrade

![Comment Section Screenshot](https://i.imgur.com/qZZJxNX.png)

This tutorial uses technologies that we've learned in the course to make an upgraded comment section with collapsible new comment and edit comment forms on the campground's show page.

To make the tutorial as straightforward as possible, all the changes are made only to the show.ejs file.

### Markup
- Open the `views/campgrounds/show.ejs` page file and edit the comment section code to look like the following:

```
<!--COMMENT SECTION START-->
<div class="well">
  <!--Setting up the add new comment button that is used for collapsing-->
  <div class="text-right">
    <a class="btn btn-success pull-right" role="button" data-toggle="collapse" href="#collapseComment" aria-expanded="false" aria-controls="collapseComment">
      <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add new comment</a>
  </div>
```

- For starters, we will place all our content inside of a div element with the Bootstrap class of 'well'.
- After that, we are adding the 'Add new comment button' code, which will have the ability to collapse the new comment form.

```
  <!--Comment section title-->
  <h4><strong>Comments <span class="glyphicon glyphicon glyphicon-comment" aria-hidden="true"></span></strong></h4>

  <!--Collapse Add a comment form START-->
  <div class="collapse" id="collapseComment">
    <div class="well" style="border-left: 5px solid #00C851;">
        <% if(!currentUser) { %>
      <!--If the user is not logged in, direct him to the login page-->
      <h5>You need to login before you can comment. <a href="/login">Click here</a> to go to the login page.</h5>
        <% } %>
        <% if(currentUser) { %>
      <!--If the user is logged in, show the new comment form-->
      <h4>Write your comment <span class="glyphicon glyphicon glyphicon-pencil" aria-hidden="true"></span></h4>
      <form id="add-comment-form" action="/campgrounds/<%= campground._id %>/comments" method="POST">
        <div class="form-group">
          <input class="form-control" type="text" disabled value="<%= currentUser.username %>">
        </div>
        <div class="form-group">
          <textarea class="form-control" name="comment[text]" placeholder="Write your comment..." form="add-comment-form" rows="5" cols="70"></textarea>
        </div>
        <div class="form-group">
          <button class="btn btn-success btn-sm">Comment <span class="glyphicon glyphicon-comment" aria-hidden="true"></span></button>
        </div>
      </form>
        <% } %>
    </div>
  </div>
  <!--Collapse Add a comment form END-->
```

- The comment section title is added via an h4 element.
- After, the new comment form is added which is a familiar piece of code from our `views/campgrounds/new.ejs`.
- We also make a check if the user is logged in before showing the form.

```
  <hr>

  <!--Check if there are comments, if there are none say no comments.-->
    <% if (campground.comments.length === 0) { %>
  <em style="color: grey;">No comments yet.</em>
    <% } %>

  <!--Display comments by looping through them-->
    <% campground.comments.forEach(function(comment) { %>
  <div class="row">
    <div class="col-md-12">
      <strong>
          <% if (currentUser && currentUser._id.equals(comment.author.id)) { %>
        <!--If the current user owns the comment, change the color of the user icon-->
        <span style="color: orange;" class="glyphicon glyphicon-user" aria-hidden="true"></span>
          <% } else { %>
        <!--Else just display it black-->
        <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
          <% } %>
        <!--Print out the author username-->
          <%= comment.author.username %>
      </strong>

      <!--Show when the comment was made-->
      <span class="pull-right"><%= moment(comment.createdAt).fromNow() %></span>

      <!--Printing the comment-->
      <p><%= comment.text %></p>

      <!--If the visitor is logged in and the owner of the comment, show the edit and delete buttons-->
        <% if (currentUser && currentUser._id.equals(comment.author.id)) { %>
```

- In the above part of the code, we are dealing with showing the existing comments.
- First, we check if the campground has any comments - if it doesn't, we make our page say: `No comments yet`.
- After, we write a forEach loop similar to the one that we've had before, to print all the comments.
- We also add some small details, like changing the user icon color if the current user owns a particular comment.
- If you haven't still implemented Moment.js in your code, please see [Ian's tutorial on how to implement it.](http://slides.com/nax3t/yelpcamp-refactor-moment#/)

```
<!--Edit button used for collapsing the edit comment form-->
      <a class="btn btn-xs btn-warning" role="button" data-toggle="collapse" href="#collapseEdit<%= comment._id %>" aria-expanded="false" aria-controls="collapse<%= comment._id %>">
        Edit</a>

      <!--Delete comment button-->
      <form id="delete-form" action="/campgrounds/<%= campground._id %>/comments/<%= comment._id %>?_method=DELETE" method="POST" style="display: inline;">
        <button class="btn btn-xs btn-danger">Delete</button>
      </form>

      <!--Edit comment form-->
      <div class="collapse" id="collapseEdit<%= comment._id %>">
        <div class="well" style="border-left: 5px solid #ffbb33; margin-top: 15px;">
          <h4>Edit your comment <span class="glyphicon glyphicon-edit" aria-hidden="true"></span></h4>
          <form id="edit-comment-form" action="/campgrounds/<%= campground._id %>/comments/<%= comment._id %>?_method=PUT" method="POST">
            <div class="form-group">
              <input class="form-control" type="text" disabled value="<%= currentUser.username %>">
            </div>
            <div class="form-group">
              <textarea class="form-control" name="comment[text]" placeholder="Your comment text..." form="edit-comment-form" rows="5" cols="70"><%= comment.text %></textarea>
            </div>
            <div class="form-group">
              <button class="btn btn-warning btn-sm">Edit comment <span class="glyphicon glyphicon-comment" aria-hidden="true"></span></button>
            </div>
          </form>
        </div>
      </div>
        <% } %>
      <hr>
    </div>
  </div>
    <% }) %>
</div>
<!--COMMENT SECTION END-->
```

- We end the comment section refactor by adding the edit comment and delete comment buttons.
- Also, we add the edit comment form (familiar from `views/campgrounds/edit.ejs` which is collapsible when the comment owner presses the edit comment button.

- The tricky part worth mentioning here was the bug that happened when there were multiple comments that the current user owns:
- The problem was that the connection of the collapsible content and the button is made by an id.
- A collapse bug would happen because there would be multiple elements with the same id that triggers it, and the collapse button wouldn't work.
- It's also against the rules to use id more than once in a page as we know, so I used the power of EJS and this nifty trick to make each `id` attribute unique for the edit comment collapsible forms (more precisely, the parent div element holding the form):

`<div class="collapse" id="collapseEdit<%= comment._id %>">`

- Now we are generating an id attribute based on the comment._id field from MongoDB, which will ensure it's uniqueness.

# And that would be it!
Now we have a new comment section with some smooth collapsible create/edit forms. I tried to keep all the code inside this one file, but feel free to refactor the code further and put the CSS styles in it's own file, for example.

[Click here](https://github.com/fewsion/yelp-camp-refactored/blob/comment-section/views/campgrounds/show.ejs) to see the full, updated `views/campgrounds/show.ejs` file.
