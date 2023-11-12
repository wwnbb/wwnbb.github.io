import { useState, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import BlogService, { BlogPost } from '../../services/BlogService';

const POSTS_PER_PAGE = 10; // Adjust as needed

function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    BlogService.getPosts()
      .then((data) => {
        setPosts(data);
        setTotalPages(Math.ceil(data.length / POSTS_PER_PAGE));
      })
      .catch((error) => {
        console.error('Failed to load posts:', error);
      });
  }, []);

  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-10 mb-60">
      {paginatedPosts.length > 0 ? (
        <>
          {paginatedPosts.map((post) => {
            const date = new Date(post.date);
            return (
              <div key={post.id} className="mx-5 ml-36 my-20">
                <h1 className="text-5xl">
                  <Link to={`/blog/${post.url}`}>{post.title}</Link>
                </h1>
                <p className="text-xl mt-2">{date.toLocaleString()}</p>
                <p className="text-3xl mt-2">{post.short_content}</p>
              </div>
            );
          })}
          <div className="w-full flex mb-40 text-5xl text-scyan justify-end px-10">
            <span>[
              {Array.from({ length: totalPages }, (_, index) => (
                <React.Fragment key={index}>
                  <button
                    key={index}
                    onClick={() => changePage(index + 1)}
                    disabled={currentPage === index + 1}
                    className="hover:underline"
                  >
                    {index + 1}
                  </button>
                  {index < totalPages - 1 && ' '}
                </React.Fragment>
              ))}
              ]</span>
          </div>
        </>
      ) : (
        'Loading...'
      )}
    </div>
  );
}

export default BlogPosts;
