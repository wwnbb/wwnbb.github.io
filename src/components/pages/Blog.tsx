import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import BlogService from '../../services/BlogService';


function BlogPosts() {
  const [posts, setPost] = useState(null);

  useEffect(() => {
    BlogService.getPosts().then(setPost);
  }, []);

  return (
    <div>
      {posts ? (
        <>
          {posts.map((post) => {
            const date = new Date(post.date);  // Assuming post.date is in a format that JS can understand
            const readableDate = date.toLocaleString();
            return (
              <div key={post.id}>
                <h2>{post.title}</h2>
                <p>{readableDate}</p>
                <p>{post.short_content}</p>
              </div>
            );
          })}
        </>
      ) : (
        'Loading...'
      )}
    </div>
  );
}

export default BlogPosts;
