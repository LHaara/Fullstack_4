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

    //jos halutaan lähettää  tyhjä taulukko, eikä "undefined" objekti
/*     if (mostLikes === undefined || mostLikes.length == 0){
      return mostLikes
    }
    else {
      return formatBlog(mostLikes)  
    } */
    
}

const mostBlogs = (blogs) => {

  const count = (array, auth) => {

    return array.reduce((counter, blog) => {
      const p = auth(blog)
      counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1
      return counter
    }, {})
  }  
  const countByAuthor = count(blogs, blog => {
    return blog.author    
  })
 
  const countByAuthorArray = Object.entries(countByAuthor)
  if (countByAuthorArray === undefined || countByAuthorArray.length == 0) {
    return {undefined}
  }
  else {
    const authorsObjects = []
    countByAuthorArray.forEach(function(line){
      authorsObjects.push({author: line[0], blogs: line[1]})
    })
    //console.log(authorsObjects)
    const mostBlogs = authorsObjects.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, [])
    //console.log(mostBlogs)

    return mostBlogs

  }
}


const mostLikes = (blogs) => {
  const countLikes = (array, auth) => {

    return array.reduce((counter, blog) => {
      const p = auth(blog)
      counter[p] = counter.hasOwnProperty(p) ? counter[p] + blog.likes : blog.likes
      return counter
    }, {})
  }  
  const countLikesByAuthor = countLikes(blogs, blog => {
    return blog.author    
  })
 
  const countByAuthorArray = Object.entries(countLikesByAuthor)

  if (countByAuthorArray === undefined || countByAuthorArray.length == 0) {

    return {undefined}
  }
  else {

    const authorsObjects = []
    countByAuthorArray.forEach(function(line){
      authorsObjects.push({author: line[0], likes: line[1]})
    })
    //console.log(authorsObjects)

    const mostLikes = authorsObjects.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, [])
   // console.log(mostLikes)

    return mostLikes
  }


}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}

