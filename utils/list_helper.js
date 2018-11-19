const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    const allLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)    
    return allLikes
}

const favouriteBlog = (blogs) => {
    const formatBlog = (blog) => {
        return {
          title: blog.title,
          author: blog.author,
          likes: blog.likes
        }
    }
    const mostLikes = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, [])    
    //console.log(formatBlog(mostLikes))
    return formatBlog(mostLikes) 

    //jos halutaan tyhjstä taulukosta lähettää vastauksena tyhjä, eikä "undefined"
/*     if (mostLikes === undefined || mostLikes.length == 0){
      return mostLikes
    }
    else {
      return formatBlog(mostLikes)  
    } */
    
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}

