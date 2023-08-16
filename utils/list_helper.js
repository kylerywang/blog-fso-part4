const _ = require('lodash');
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => {
    return acc + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((topBlog, blog) => {
    return (blog.likes > topBlog.likes) ? blog : topBlog;
  });
};

const mostBlogs = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, `author`);
  const authorsWithBlogCount = _.map(groupedByAuthor, (blogs, author) => {
    return {author, blogs: blogs.length};
  });
  return _.maxBy(authorsWithBlogCount, 'blogs');
};

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, `author`);
  const authorsWithLikeCount = _.map(groupedByAuthor, (blogs, author) => {
    return {
      author,
      likes: blogs.reduce((total, blog) => {
        return total + blog.likes;
      }, 0)};
  });
  return _.maxBy(authorsWithLikeCount, 'likes');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
