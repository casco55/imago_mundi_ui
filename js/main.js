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
    var commentTemplate = `<div class="d-flex flex-column" id="comment_container_${comment.id_comment}">`;
    commentTemplate += `<span class="text-info">${comment.user_name}</span>`;
    commentTemplate += `<div class="d-flex flex-column" id="comment_${comment.id_comment}">`;
    commentTemplate +=
      "<p class='px-2'>" + comment.comment + comment.id_comment + "</p>";
    commentTemplate += `<span>${comment.comment_date} ${comment.comment_time}</span>`;
    commentTemplate += "</div>";
    commentTemplate += `<button class="btn btn-sm btn-primary col-2" id="id_resp_${comment.id_comment}" onclick="replyComment(${comment.id_comment}, '${comment.user_name}')">Responder</button>`;
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
function replyComment(id_comment, user_name) {
  // id resp display none
  $("#id_resp_" + id_comment).css("display", "none");
  var formTemplate = `<div class="d-flex flex-column" id="form_reply_${id_comment}" onsubmit="submitAnswer(${id_comment})">`;
  formTemplate += `<div class="form-group">`;
  formTemplate += `<label for="reply_comment_${id_comment}">Responder a ${user_name}</label>`;
  formTemplate += `<textarea class="form-control" id="reply_comment_textarea${id_comment}" rows="3"></textarea>`;
  formTemplate += `</div>`;
  formTemplate += `<div class="d-flex flex-row col-12 justify-content-end">`;
  formTemplate += `<button class="btn btn-primary">Responder</button>`;
  formTemplate += `<button class="btn btn-danger" onclick="cancelReply(${id_comment})">cancelar</button>`;
  formTemplate += `</div>`;
  formTemplate += `</div>`;
  $("#comment_" + id_comment).append(formTemplate);
}
function cancelReply(id_comment) {
  $("#form_reply_" + id_comment).remove();
  $("#id_resp_" + id_comment).css("display", "flex");
}
