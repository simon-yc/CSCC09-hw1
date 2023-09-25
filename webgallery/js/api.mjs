if (!localStorage.getItem("gallery")) {
    localStorage.setItem("gallery", JSON.stringify({ nextImageId: 0, images: [], currImageIndex: 0 }));
}

/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */

// check if the current image is the first image in the gallery
export function isFirstImage() {
    const gallery = JSON.parse(localStorage.getItem("gallery"));
    return gallery.currImageIndex === 0;
}

// check if the current image is the last image in the gallery
export function isLastImage() {
    const gallery = JSON.parse(localStorage.getItem("gallery"));
    return gallery.currImageIndex === gallery.images.length - 1;
}

// get current image from the gallery
export function getCurrentImage() {
    const gallery = JSON.parse(localStorage.getItem("gallery"));
    if (gallery.images.length === 0) return null;
    return gallery.images[gallery.currImageIndex];
}

// get previous image from the gallery
export function getPreviousImage() {
    const gallery = JSON.parse(localStorage.getItem("gallery"));
    if (gallery.images.length === 0) return null;
    gallery.currImageIndex = (gallery.currImageIndex - 1 + gallery.images.length) % gallery.images.length;
    localStorage.setItem("gallery", JSON.stringify(gallery));
    return getCurrentImage();
}

// get next image from the gallery 
export function getNextImage() {
    const gallery = JSON.parse(localStorage.getItem("gallery"));
    if (gallery.images.length === 0) return null;
    gallery.currImageIndex = (gallery.currImageIndex + 1) % gallery.images.length;
    localStorage.setItem("gallery", JSON.stringify(gallery));
    return getCurrentImage();
}

// add an image to the gallery
export function addImage(title, author, url) {
    const gallery = JSON.parse(localStorage.getItem("gallery"));
    const image = {
        imageId: `img${gallery.nextImageId++}`,
        title,
        author,
        url,
        date: new Date(),
        comments: { nextCommentId: 0, list: [], currCommentPage: 0}
    };
    gallery.images.push(image);
    localStorage.setItem("gallery", JSON.stringify(gallery));
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
    const gallery = JSON.parse(localStorage.getItem("gallery"));
    const index = gallery.images.findIndex(function (image) {
        return image.imageId === imageId;
    });
    if (index === -1) return null;
    gallery.images.splice(index, 1);
    gallery.currImageIndex = gallery.images.length > 0 ? gallery.currImageIndex % gallery.images.length : 0;
    localStorage.setItem("gallery", JSON.stringify(gallery));
}

// add a comment to an image
export function addComment(imageId, author, content) {
    const gallery = JSON.parse(localStorage.getItem("gallery"));
    const image = gallery.images.find(function (image) {
        return image.imageId === imageId;
    });
    if (!image) return null;

    const commentId = `comment${imageId}.${image.comments.nextCommentId++}`;
    const comment = {
        commentId,
        author,
        content,
        date: new Date(),
    };
    image.comments.list.unshift(comment);
    localStorage.setItem("gallery", JSON.stringify(gallery));
}

// delete a comment to an image
export function deleteComment(commentId) {
    const gallery = JSON.parse(localStorage.getItem("gallery"));
    const image = gallery.images.find(function (image) {
        return image.comments.list.find(function (comment) {
            return comment.commentId === commentId;
        });
    }
    );
    const index = image.comments.list.findIndex(function (comment) {
        return comment.commentId === commentId;
    });
    if (index === -1) return null;
    image.comments.list.splice(index, 1);
    localStorage.setItem("gallery", JSON.stringify(gallery));
}

// get current page of comments
export function getCommentsPage() {
    const image = getCurrentImage();
    return image.comments.list.slice(image.comments.currCommentPage * 10, (image.comments.currCommentPage + 1) * 10);
}

// get next page of comments
export function getNextCommentsPage() {
    const gallery = JSON.parse(localStorage.getItem("gallery"));
    const image = gallery.images[gallery.currImageIndex];
    if (isLastCommentsPage()) return getCommentsPage();
    image.comments.currCommentPage++;
    localStorage.setItem("gallery", JSON.stringify(gallery));
    return getCommentsPage();
}

// get previous page of comments
export function getPreviousCommentsPage() {
    const gallery = JSON.parse(localStorage.getItem("gallery"));
    if (gallery.images.length === 0) return null;
    const image = gallery.images[gallery.currImageIndex];
    if (isFirstCommentsPage()) return getCommentsPage();
    image.comments.currCommentPage--;
    localStorage.setItem("gallery", JSON.stringify(gallery));
    return getCommentsPage();
}

// see if we are on the first page of comments
export function isFirstCommentsPage() {
    const image = getCurrentImage();
    return image.comments.currCommentPage === 0;
}

// see if we are on the last page of comments
export function isLastCommentsPage() {
    const image = getCurrentImage();
    return image.comments.currCommentPage === Math.max(0, Math.ceil(image.comments.list.length/10)-1);
}