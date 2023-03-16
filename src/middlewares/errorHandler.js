const errorHandler = (error, req, res, next) => {
  
  console.log(error.stack.red)
  
  // res.status(500).json({
  //   success: false,
  //   error: err.message
  // })
}

module.exports = errorHandler