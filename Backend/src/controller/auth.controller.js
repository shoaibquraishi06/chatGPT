const userModel = require('../models/user.models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');




async function registerController(req,res){

       const { fullName: { firstName, lastName }, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email })

    if (isUserAlreadyExists) {
        res.status(400).json({ message: "User already exists" });
    }

    // if (!password) {
    //     return res.status(400).json({ message: "Password is required" });
    // }

    const hashPassword = await bcrypt.hash(password, 10);


    const user = await userModel.create({
        fullName: {
            firstName, lastName
        },
        email,
        password: hashPassword
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)


    res.cookie("token", token)


    res.status(201).json({
        message: "User registered successfully",
        user: {
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    })




}


async function loginController(req,res){

      const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({ message: "Invalid email " });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
        return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);


    res.cookie("token", token);


    res.status(200).json({
        message: "user logged in successfully",
        user: {
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    })

}



module.exports= {
 registerController,
 loginController


}