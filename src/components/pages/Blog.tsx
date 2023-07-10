import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import BlogService from '../../services/BlogService';


function BlogPost() {
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Replace 'postID' with the ID of the post you want to fetch
    BlogService.getPost('-N_0PjcueXnvqzAK1TW_').then(setPost);
  }, []);

  return (
    <div>
      {post ? (
        <>
          <h2>{post.title}</h2>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </>
      ) : (
        'Loading...'
      )}
    </div>
  );
}

export default BlogPost;
