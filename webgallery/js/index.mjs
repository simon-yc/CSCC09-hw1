import {
  getPreviousImage,
  isFirstImage,
  isLastImage,
  getCurrentImage,
  getNextImage,
  addImage,
  addComment,
  deleteComment,
  deleteImage,
  getCommentsPage,
  getNextCommentsPage,
  getPreviousCommentsPage,
  isFirstCommentsPage,
  isLastCommentsPage,
} from "/js/api.mjs";

function update() {
  const image = getCurrentImage();
  if (image === null) {
    document.querySelector("#image").innerHTML = "<p>No current images in the gallery.</p>";
    return;
  }
  const comments = getCommentsPage();
  const elmt = document.createElement("div");
  elmt.className = "image-container";
  elmt.innerHTML = `
      <div class="image">
          <div class="image_title">${image.title}</div>
          <div class="image_author">${image.author}</div>
          <img class="image_url" src="${image.url}" alt="${image.title}">
          <div class="image_date">${image.date}</div>
          <div class="image-buttons">
            <div class="image-previous-next-nav">
              ${
                !isFirstImage()
                  ? '<div class="previous-image-icon icon" id="prevImage"></div>'
                  : ''
              }
              ${
                !isLastImage()
                  ? '<div class="next-image-icon icon" id="nextImage"></div>'
                  : ''
              }
            </div>
            <div class="delete-image-icon icon" image-id="${image.imageId}"></div>
          </div>
      </div>
  `;
  
  const commentsContainer = document.createElement("div");
  commentsContainer.className = "comments-container"; 
  commentsContainer.innerHTML = `
    <div class="comments-container">
    <div class="comments">
      <h3>Comments</h3>
      <ul class="comment-list">
        ${comments
          .map(
            (comment) => `
              <li class="comment">
                <div class="comment-metadata">
                  <div class="comment_author">${comment.author}</div>
                  <div class="comment_date">${comment.date}</div>
                </div>
                <div class="comment_content">${comment.content}</div>
                <div class="delete-comment-icon icon" comment-id="${comment.commentId}"></div>
              </li>
            `
          )
          .join("")}
      </ul>
      <div class="comment-nav-buttons">
        ${
          !isFirstCommentsPage()
            ? '<div class="previous-comments-icon icon" id="previous-comments"></div>'
            : ''
        }
        ${
          !isLastCommentsPage()
            ? '<div class="next-comments-icon icon" id="next-comments"></div>'
            : ''
        }
      </div>
      <form class="add-comment-form">
        <input type="text" placeholder="Your name" class="comment-author" required>
        <input type="text" placeholder="Add a comment" class="comment-content" required>
        <button type="submit">Add Comment</button>
      </form>
    </div>
  </div>


  `;

  elmt
    .querySelector(".delete-image-icon")
    .addEventListener("click", function (e) {
      const imageId = e.target.getAttribute("image-id");
      deleteImage(imageId);
      update();
    });

  if (!isFirstImage()) {
    const prevImage = elmt.querySelector("#prevImage");
    prevImage.addEventListener("click", function (e) {
      getPreviousImage();
      update();
    });
  }

  if (!isLastImage()) {
    const nextImage = elmt.querySelector("#nextImage");
    nextImage.addEventListener("click", function (e) {
      getNextImage();
      update();
    });
  }

  const addCommentForm = commentsContainer.querySelector(".add-comment-form");
  addCommentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const author = addCommentForm.querySelector(".comment-author").value;
    const content = addCommentForm.querySelector(".comment-content").value;
    addComment(image.imageId, author, content);
    update();
  });

  const deleteCommentIcon = commentsContainer.querySelectorAll(".delete-comment-icon");
  deleteCommentIcon.forEach((deleteIcon) => {
    deleteIcon.addEventListener("click", function (e) {
      const commentId = e.target.getAttribute("comment-id");
      deleteComment(commentId);
      update();
    });
  });

  if (!isFirstCommentsPage()) {
    const prevComments = commentsContainer.querySelector("#previous-comments");
    prevComments.addEventListener("click", function (e) {
      getPreviousCommentsPage();
      update();
    });
  }
  
  if (!isLastCommentsPage()) {
    const nextComments = commentsContainer.querySelector("#next-comments");
    nextComments.addEventListener("click", function (e) {
      getNextCommentsPage();
      update();
    });
  }

  const imageContainer = document.querySelector("#image");
  imageContainer.innerHTML = "";
  imageContainer.appendChild(elmt);
  imageContainer.appendChild(commentsContainer);
}

document.querySelector("#add_image_form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("image_title").value;
  const author = document.getElementById("image_author").value;
  const url = document.getElementById("image_url").value;
  document.getElementById("add_image_form").reset();
  addImage(title, author, url);
  update();
});

document.querySelector("#toggle_image_form").addEventListener("click", function (e) {
  const imageForm = document.querySelector("#add_image_form");
  imageForm.classList.toggle("hidden");
  imageForm.classList.toggle("slide-down");
});

update();
