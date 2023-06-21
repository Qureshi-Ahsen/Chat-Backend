const mongoose=require('mongoose')

const connectDb=async()=>{
   try {
    const conn=await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Database is connected at:${conn.connection.host}`)
    mongoose.connection.on('connected', () => {
      console.log('Mongo has connected succesfully')
    })
    mongoose.connection.on('reconnected', () => {
      console.log('Mongo has reconnected')
    })
    mongoose.connection.on('error', error => {
      console.log('Mongo connection has an error', error)
      mongoose.disconnect()
    })
    mongoose.connection.on('disconnected', () => {
      console.log('Mongo connection is disconnected')
    })
   } catch (error) {
      console.log(error)
    return error
   }
};
module.exports=connectDb
