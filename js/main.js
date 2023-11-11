$(document).ready(function () {
  loadComments();
});
const path = window.location.pathname;
console.log(path);
/* eliminar slash y .html del path */
const pathName = path.substring(1, path.length - 5);
console.log(pathName);
let pathType = "";
!pathName ? (pathType = "index") : (pathType = pathName);
function loadComments() {
  $.ajax({
    url: `http://localhost/imago_mundi/comment/${pathType}`,
    type: "GET",
    dataType: "json",
    //loading
    beforeSend: function () {
      $("#comments_container").html(
        '<div class="d-flex justify-content-center"><div class="spinner-border text-info" role="status"><span class="visually-hidden">Loading...</span></div></div>'
      );
    },
    success: function (data) {
      $("#comments_container").html("");
      if (data.data.length == 0) {
        $("#comments_container").html(
          `<div class="alert alert-warning" role="alert">
          <h4 class="alert-heading">No hay comentarios!</h4>
          <p>Se el primero en comentar.</p>
         
        </div>`
        );
        return;
      }
      showComments(data.data, $("#comments_container"));
    },
    error: function (error) {
      console.log(error);
      $("#comments_container").html(
        `<div class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Error!</h4>
        <p>${error.responseJSON.message}</p>
        <hr>
        <p class="mb-0">Por favor contacte al administrador.</p>
      </div>`
      );
    },
  });
}
function showComments(comments, container) {
  $.each(comments, function (index, comment) {
    var commentTemplate = `<div class="d-flex flex-column" id="comment_container_${comment.id_comment}">`;
    commentTemplate += `<span class="">${comment.user_name}</span>`;
    commentTemplate += `<div class="d-flex flex-column" id="comment_${comment.id_comment}">`;
    commentTemplate +=
      "<p class='p-2 comment_bubble mb-0 tiny-text'>" +
      comment.comment +
      comment.id_comment +
      "</p>";
    commentTemplate += `<div class="d-flex flex-row align-items-center mt-0">`;
    commentTemplate += `<span class="tiny-text">${comment.comment_date} ${comment.comment_time}</span>`;
    commentTemplate += `<button class="btn btn-sm btn-link" id="id_resp_${comment.id_comment}" onclick="display_reply_form(${comment.id_comment}, '${comment.user_name}')">Responder</button>`;
    commentTemplate += "</div>";
    const replyForm = replyComment(comment.id_comment);
    commentTemplate += replyForm;
    commentTemplate += "</div>";
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
function display_reply_form(id_comment) {
  // toggle display none
  $(`#id_resp_${id_comment}`).addClass("d-none");
  $(`#form_reply_${id_comment}`).removeClass("d-none");
}
function cancelReply(id_comment) {
  // toggle display none
  $(`#id_resp_${id_comment}`).removeClass("d-none");
  $(`#form_reply_${id_comment}`).addClass("d-none");
}
function replyComment(id_comment) {
  // id resp display none

  var formTemplate = `<div class="d-none flex-column " id="form_reply_${id_comment}" >`;
  formTemplate += `<div class="form-group">`;
  formTemplate += `<label for="reply_comment_input${id_comment}">Nombre <span id="validation_reply_comment_input_${id_comment}" class="validation-error d-none">requerido</span> </label>`;
  formTemplate += `<input type="text" class="form-control" id="reply_comment_input${id_comment}">`;
  formTemplate += `</div>`;
  formTemplate += `<div class="form-group">`;
  formTemplate += `<label for="reply_comment_textarea${id_comment}">Respuesta <span id="validation_reply_comment_textarea_${id_comment}" class="validation-error d-none">requerido</span></label>`;
  formTemplate += `<textarea class="form-control" id="reply_comment_textarea${id_comment}" rows="3"></textarea>`;
  formTemplate += `</div>`;
  formTemplate += `<div class="d-flex flex-row col-12 justify-content-end">`;
  formTemplate += `<button onclick="submitAnswer(${id_comment})" type="submit" class="btn btn-link">Responder</button>`;
  formTemplate += `<div class="btn btn-link btn-link-cancel" onclick="cancelReply(${id_comment})">cancelar</div>`;
  formTemplate += `</div>`;
  formTemplate += `</div>`;
  return formTemplate;
}
function sendComment() {
  var name = $("#principal_comment_input").val();
  var comment = $("#principal_comment_textarea").val();
  if (name === "" || comment === "") {
    name === ""
      ? $("#validation_principal_comment_input").removeClass("d-none")
      : $("#validation_principal_comment_input").addClass("d-none");
    comment === ""
      ? $("#validation_principal_comment_textarea").removeClass("d-none")
      : $("#validation_principal_comment_textarea").addClass("d-none");
    return;
  }
  var data = {
    user_name: name,
    comment: comment,
  };
  $.ajax({
    url: `http://localhost/imago_mundi/comment/${pathType}`,
    type: "POST",
    dataType: "json",
    data: data,
    success: function (data) {
      name = $("#principal_comment_input").val("");
      comment = $("#principal_comment_textarea").val("");
      loadComments();
    },
    error: function (error) {
      console.log(error);
    },
  });
}
function submitAnswer(id_comment) {
  var name = $(`#reply_comment_input${id_comment}`).val();
  var comment = $(`#reply_comment_textarea${id_comment}`).val();
  if (name === "" || comment === "") {
    name === ""
      ? $(`#validation_reply_comment_input_${id_comment}`).removeClass("d-none")
      : $(`#validation_reply_comment_input_${id_comment}`).addClass("d-none");
    comment === ""
      ? $(`#validation_reply_comment_textarea_${id_comment}`).removeClass(
          "d-none"
        )
      : $(`#validation_reply_comment_textarea_${id_comment}`).addClass(
          "d-none"
        );
    return;
  }
  var data = {
    id_comment: id_comment,
    user_name: name,
    comment: comment,
  };
  $.ajax({
    url: `http://localhost/imago_mundi/answer/${pathName}/${id_comment}`,
    type: "POST",
    dataType: "json",
    data: data,
    success: function (data) {
      name = $(`#reply_comment_input${id_comment}`).val("");
      comment = $(`#reply_comment_textarea${id_comment}`).val("");
      loadComments();
    },
    error: function (error) {
      console.log(error);
    },
  });
}
