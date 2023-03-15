const getAllAssets = (req, res) => {
  console.log('oi')
  res.send('all assets')
}

/**
 *
 * @param req
 * @param res
 */
const addAsset = (req, res) => {
  res.send('add asset')
}


module.exports = {
  getAllAssets,
  addAsset
}
