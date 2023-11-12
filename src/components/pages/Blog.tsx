import { useEffect, useState } from 'react';
import BlogService, { BlogPost } from '../../services/BlogService';
import { Link } from 'react-router-dom';

// Define a type for your posts

function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    BlogService.getPosts().then(data => {
      setPosts(data);
    }).catch(error => {
      console.error('Failed to load posts:', error);
    });
  }, []);

  return (
    <div>
      {posts ? (
        posts.map((post: BlogPost) => {
          const date = new Date(post.date);
          const readableDate = date.toLocaleString();
          return (
            <div key={post.id} className="mx-5 ml-36 my-20">
              <h1 className="text-5xl">
                <Link to={`/blog/${post.url}`}>{post.title}</Link>
              </h1>
              <p className="text-xl">{readableDate}</p>
              <p className="text-base">{post.short_content}</p>
            </div>
          );
        })
      ) : (
        'Loading...'
      )}
    </div>
  );
}

export default BlogPosts;
