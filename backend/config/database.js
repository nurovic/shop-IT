const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(con => {
        console.log(`MongoDb Database connected with HOST: ${con.connection.host}`)
    })
}

module.exports = connectDatabase