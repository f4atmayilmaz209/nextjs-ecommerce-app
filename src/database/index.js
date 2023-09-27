import mongoose from "mongoose";


const configOptions={
    useNewUrlParser:true,
    useUnifiedTopology:true
}


const connectToDB=async()=>{

    const connectionUrl=process.env.MONGO_URL
    mongoose.connect(connectionUrl,configOptions).then(()=>console.log("Ecommerce database successfully!")).catch((err)=>console.log(`Getting Error from DB connection ${err.message}`))
}

export default connectToDB;