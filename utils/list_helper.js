const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((s,p) => s + p.likes, 0)
}

const favoriteBlog = (blogs) => {
    const max = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
    delete max._id
    delete max.__v
    delete max.url
    return max
}

const mostBlogs = (blogs) => {  
    const dict = {}
  
    blogs.forEach((blog) => dict[blog.author] ? dict[blog.author] += 1 : dict[blog.author] = 1)
  
    const authorFreq = Object.keys(dict).sort(
      (a, b) => dict[b] - dict[a]
    )[0]
  
    return {
      author: authorFreq,
      blogs: dict[authorFreq],
    }
  }
  
const mostLikes = (blogs) => {
    const dict = {}
    
    blogs.forEach((blog) => dict[blog.author] ? dict[blog.author] += blog.likes: dict[blog.author] = blog.likes)
    
      const authorLikes = Object.keys(dict).sort(
        (a, b) => dict[b] - dict[a]
      )[0]
    
      return {
        author: authorLikes,
        likes: dict[authorLikes],
      }
    
}
  
module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
  