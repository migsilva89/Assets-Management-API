// const errorHandler = (error, req, res, next) => {
//
//   console.log(error.stack.red)
//
//   res.status(500).json({
//     success: false,
//     error: error.message
//   })
//   res.status(400).json({
//     success: false,
//     error: error.message
//   })
//   res.status(401).json({
//     success: false,
//     error: error.message
//   })
// }
//
// module.exports = errorHandler