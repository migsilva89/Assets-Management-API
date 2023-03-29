const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: error.message
    })
  } else if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: error.message
    })
  } else {
    console.log(error.stack.red)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

module.exports = errorHandler
