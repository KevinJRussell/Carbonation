CreateLink_LastPost();

function CreateLink_LastPost() {
    var trs = document.getElementsByTagName('tr');

    for (var i = 1; i < trs.length; i++) {
        var tr = trs[i];

        var td = tr.querySelector('td');

        if (td) {
            var postCount = parseInt(td.parentNode.getElementsByTagName('td')[2].innerHTML.split(' ')[0]);
            // var postCount = parseInt(postCountTd.innerHTML.split(' ')[0]);
            var lastPage = Math.ceil(postCount / POSTS_PER_PAGE);
            var topic = td.parentNode.querySelector('td').querySelector('a');
            var url_LastPost = topic.href + '&page=' + lastPage;

            var link_LastPost = document.createElement('a');
            link_LastPost.href = url_LastPost;
            link_LastPost.id = 'lastPost';
            link_LastPost.innerHTML = '&gt;';
            link_LastPost.style = 'text-decoration: none;';

            // var spacer = document.createElement('span');
            // spacer.style = 'margin-left: 10px;';

            // td.getElementsByClassName('fr')[0].appendChild(spacer);
                td.querySelector('.fr').appendChild(link_LastPost);
        }
    }
}