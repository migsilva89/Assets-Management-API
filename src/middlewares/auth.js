module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization
  
  //verificar se ha token
  if (!authHeader)
    return res.status(401).send({ error: 'No token provided' })
  next()
}