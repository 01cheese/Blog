// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id')
    };
}

// Function to load post by ID
function loadPostById(postId) {
    fetch('posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error loading posts');
            }
            return response.json();
        })
        .then(data => {
            const posts = data.posts;
            const postContainer = document.getElementById('post-content');

            // Find the post with the matching id
            const post = posts.find(p => p.id === parseInt(postId, 10));

            if (post) {
                postContainer.innerHTML = `
                    <div class="post">
                        <div class="container">
                            <div class="post-content">${post.content}</div>
                        </div>
                    </div>
                `;
            } else {
                postContainer.innerHTML = 'Post not found.';
            }
        })
        .catch(error => {
            console.error('Error loading post:', error);
            document.getElementById('post-content').innerHTML = 'Error loading post.';
        });
}

// When the document is ready, load the post by id from the URL
document.addEventListener('DOMContentLoaded', () => {
    const params = getUrlParams();
    if (params.id) {
        loadPostById(params.id);
    } else {
        document.getElementById('post-content').innerHTML = 'No post ID found in URL.';
    }
});
