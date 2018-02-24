let settings;
let blacklist;

GetSettings();

function GetSettings() {
    const getSettings = browser.storage.local.get('blacklist');

    getSettings.then(function (result) {
        settings = result;
        blacklist = settings.blacklist.split(',').map((user) => user.trim());

        ProcessTopics();
    });
}

function ProcessTopics() {
    const topics = document.querySelectorAll('tr');

    topics.forEach((topic) => {
        if (settings.blacklist)
            BlockBlacklistedUsers(topic);

        CreateLink_LastPost(topic);
    });
}

function BlockBlacklistedUsers(topic) {
    const temp = topic.querySelectorAll('td')[1];
    if (temp == null) return;
    username = temp.querySelector('a').innerHTML;

    if (blacklist.includes(username)) {
        topic.style = 'display: none;';
    }
}

function CreateLink_LastPost(topic) {
    const td = topic.querySelector('td');

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
}