$(document).ready(function () {
  console.log("Hello World");
  // Code
  $.ajax({
    url: "http://localhost/imago_mundi/comment/prueba",
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      showComments(data.data, $("#comments_container"));
    },
    error: function (error) {
      console.log(error);
    },
  });
});
function showComments(comments, container) {
  console.log(comments, container);
  $.each(comments, function (index, comment) {
    var commentTemplate = '<div class="comment">';
    commentTemplate += "<h5>" + comment.user_name + "</h5>";
    commentTemplate +=
      "<p class='px-2'>" + comment.comment + comment.id_comment + "</p>";
    if (comment.replies.length > 0) {
      var repliesId = "replies_container_" + comment.id_comment;
      commentTemplate += `<div class="replies_container col-11 ms-auto me-0" id="${repliesId}">`;
      container.append(commentTemplate);
      var repliesContainer = $("#" + repliesId);

      showComments(comment.replies, repliesContainer);
    }
    commentTemplate += "</div>";
    // Solo agrega el comentario al contenedor si no hay respuestas
    if (comment.replies.length == 0) {
      container.append(commentTemplate);
    }
  });
}
