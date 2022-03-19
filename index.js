require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://hoangviet:hoangviet123@task2.zbkzh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)

        console.log("MongoDB connected...");
    } catch (error) {
        console.log("ERROR when connect to MongoDB.", error);
        process.exit(1)
    }
}

connectDB()

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    return res.json("/")
})

app.use('/user', require('./routes/user'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})