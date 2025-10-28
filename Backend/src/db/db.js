const mongoose =  require('mongoose')



async function connectDB() {

    try{
         await mongoose.connect(process.env.MONGODB_URI)
         console.log("mongodb connected successfully");
         
    }catch(err){
        console.log("error connection to mongodb", err);
        
    }
    
}

module.exports = connectDB