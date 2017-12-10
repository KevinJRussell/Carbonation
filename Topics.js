CreateLink_LastPost();

function CreateLink_LastPost() {
    document.querySelectorAll('tr').forEach(function (tr) {
        const td = tr.querySelector('td');

        if (td) {
            const postCount = parseInt(td.parentNode.getElementsByTagName('td')[2].innerHTML.split(' ')[0]);
            const lastPage = Math.ceil(postCount / POSTS_PER_PAGE);
            const topic = td.parentNode.querySelector('td').querySelector('a');
            const url_LastPost = topic.href + '&page=' + lastPage;

            const link_LastPost = document.createElement('a');
            link_LastPost.href = url_LastPost;
            link_LastPost.id = 'lastPost';
            link_LastPost.innerHTML = '&gt;';
            link_LastPost.style = 'text-decoration: none;';

            td.querySelector('.fr').appendChild(link_LastPost);
        }
    });
}