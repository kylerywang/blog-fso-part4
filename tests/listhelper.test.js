const totalLikes = require('../utils/list_helper').totalLikes;
const favoriteBlog = require('../utils/list_helper').favoriteBlog;
const mostBlogs = require('../utils/list_helper').mostBlogs;
const mostLikes = require('../utils/list_helper').mostLikes;
const {
  listWithNoBlog,
  listWithOneBlog,
  listWithSixBlogs,
} = require('../tests/test_helper');


describe('totalLikes', ()=>{
  test('one blog in list should result in number of likes of that blog', () => {
    expect(totalLikes(listWithOneBlog)).toBe(5);
  });

  test('list with six blogs should evaluate to the sum of their likes', () => {
    expect(totalLikes(listWithSixBlogs)).toBe(36);
  });

  test('list with no blogs should evaluate to 0 likes', () => {
    expect(totalLikes(listWithNoBlog)).toBe(0);
  });
});

describe('favoriteBlog', () =>{
  test('list with six blogs should evaluate to blog with most likes', () =>{
    expect(favoriteBlog(listWithSixBlogs)).toEqual(
        {
          _id: '5a422b3a1b54a676234d17f9',
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: 12,
          __v: 0,
        },
    );
  });
});

describe(`mostBlogs`, () => {
  test(`author with most blogs in list of six is Martin `, () =>{
    expect(mostBlogs(listWithSixBlogs)).toEqual(
        {
          author: 'Robert C. Martin',
          blogs: 3,
        },
    );
  });
});

describe(`mostLikes`, () => {
  test(`author with most likes in list of six is Dijkstra `, () =>{
    expect(mostLikes(listWithSixBlogs)).toEqual(
        {
          author: 'Edsger W. Dijkstra',
          likes: 17,
        },
    );
  });
});
