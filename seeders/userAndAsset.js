const mongoose = require('mongoose')
const fs = require('fs')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

// Load User and Asset models
const User = require('../src/models/User')
const Asset = require('../src/models/Asset')

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Read users.json and assets.json files
const usersData = JSON.parse(
  fs.readFileSync(`${__dirname}/../_data/users.json`, 'utf-8')
)
const assetsData = JSON.parse(
  fs.readFileSync(`${__dirname}/../_data/assets.json`, 'utf-8')
)

// Seed users and assets
const seedData = async () => {
  try {
    // Delete existing users and assets
    await User.deleteMany()
    await Asset.deleteMany()
    
    // Seed users
    await User.create(usersData)
    console.log('Users seeded successfully!')
    
    // Seed assets
    await Asset.create(assetsData)
    console.log('Assets seeded successfully!')
    
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seedData()
