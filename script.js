const authenticate = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem('currentUser', username);
        showBlog();
    } else {
        alert('Invalid credentials');
    }
};

const signUp = () => {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(user => user.username === username)) {
        alert('Username already exists');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    showLogin();
};

const showLogin = () => {
    document.getElementById('auth').style.display = 'block';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('blog').style.display = 'none';
};

const showSignUp = () => {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('signup').style.display = 'block';
    document.getElementById('blog').style.display = 'none';
};

const showBlog = () => {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('signup').style.display = 'none';
    document.getElementById('blog').style.display = 'block';

    const currentUser = localStorage.getItem('currentUser');
    document.getElementById('currentUser').textContent = currentUser;
    loadPosts();
};

const createPost = () => {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    posts.push({ title, content, user: localStorage.getItem('currentUser'), comments: [] });
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
};

const loadPosts = () => {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';

    posts.forEach((post, postIndex) => {
        if (post.user === localStorage.getItem('currentUser')) {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h4>${post.title}</h4>
                <p>${post.content}</p>
                <small>By ${post.user}</small>
                <div class="comments">
                    <h5>Comments</h5>
                    ${post.comments.map((comment, commentIndex) => `
                        <p>${comment}</p>
                        <button class="editCommentBtn" onclick="editComment(${postIndex}, ${commentIndex})">Edit</button>
                        <button class="deleteBtn" onclick="deleteComment(${postIndex}, ${commentIndex})">Delete</button>
                    `).join('')}
                    <textarea class="commentBox" placeholder="Add a comment"></textarea>
                    <button class="commentBtn" onclick="addComment(${postIndex}, this)">Add Comment</button>
                </div>
                <button class="editBtn" onclick="editPost(${postIndex})">Edit</button>
                <button class="deleteBtn" onclick="deletePost(${postIndex})">Delete</button>
            `;
            postsContainer.appendChild(postElement);
        }
    });
};

const editPost = (index) => {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[index];

    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;

    deletePost(index);  // Temporarily delete the post so it can be re-added with the updated content
};

const addComment = (postIndex, btn) => {
    const commentBox = btn.previousElementSibling;
    const comment = commentBox.value;
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    posts[postIndex].comments.push(comment);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
};

const editComment = (postIndex, commentIndex) => {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const newComment = prompt("Edit your comment:", posts[postIndex].comments[commentIndex]);

    if (newComment !== null) {
        posts[postIndex].comments[commentIndex] = newComment;
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
};

const deleteComment = (postIndex, commentIndex) => {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[postIndex].comments.splice(commentIndex, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
};

const deletePost = (index) => {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.splice(index, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
};

const logout = () => {
    localStorage.removeItem('currentUser');
    showLogin();
};

// Show login on page load if user is not authenticated
if (localStorage.getItem('currentUser')) {
    showBlog();
} else {
    showLogin();
}
