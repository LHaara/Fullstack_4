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
  console.log(countByAuthorArray)
  if (countByAuthorArray === undefined || countByAuthorArray.length == 0) {
    return {undefined}
  }
  else {
    const indexOfMaxValue = countByAuthorArray.reduce((iMax, x, i, array) => x > array[iMax] ? i : iMax, 0)
    const returnObject = 
      {
        author: countByAuthorArray[indexOfMaxValue][0],
        blogs: countByAuthorArray[indexOfMaxValue][1]
      } 
    return returnObject
  }
}


module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs
}

