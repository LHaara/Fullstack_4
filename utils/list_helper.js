const dummy = (blogs) => {
  return 1
}
  


const totalLikes = (blogs) => {
    const allLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)    
    return allLikes
}

module.exports = {
    dummy,
    totalLikes
}