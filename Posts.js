AddPostNumber();

function AddPostNumber() {
    var pageNumber = GetUrlParameter("page");
    if (pageNumber == null)
        pageNumber = 1;
    var postFloor = (pageNumber - 1) * 50;

    var posts = document.getElementsByClassName('message-container');

    for (var i = 0; i < posts.length; i++) {
        var postNumber = document.createTextNode(' | #' + (postFloor + i + 1));

        posts[i].getElementsByClassName('message-top')[0].appendChild(postNumber);
    }
}
