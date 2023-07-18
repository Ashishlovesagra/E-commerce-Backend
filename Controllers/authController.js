import { comparePassword, hashPassword} from "../Helpers/authHelper.js";
import userModel from "../Models/userModel.js";
import JWT from 'jsonwebtoken';

export const registerController = async (req,res) =>{
    try {
        const {name,email,password,phone,address,answer} = req.body
        //Validations
        if(!name){
            return res.send({message:'Name is Required'})
        }
        if(!answer){
            return res.send({message:'Answer is Required'})
        }
        if(!email){
            return res.send({message:'Email is Required'})
        }
        if(!password){
            return res.send({message:'Password is Required'})
        }
        if(!phone){
            return res.send({message:'Phone Number is Required'})
        }
        if(!address){
            return res.send({message:'Address is Required'})
        }
        //Check User
        const exisitingUser = await userModel.findOne({email})
        //exisiting User
        if(exisitingUser){
            return res.status(200).send({
                success:false,
                message:'Already User Register Please Login'
            })
        }
        //Register User
        const hashedPassword = await hashPassword(password)
        //Save
        const user = await new userModel({name,email,phone,address,answer,password:hashedPassword}).save()

        res.status(201).send({
            success:true,
            message:'User Register Successfully',
            user
        })
    } catch (error) {
        console.log(error)
    }
};

// POST    LOGIN
export const loginController = async (req,res) =>{
    try {
        const {email,password} = req.body
        //Validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:'Invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not Registered'
            })
        }

        console.log(user)
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invaild Password'
            })
        }
        //Token
        const token =  await JWT.sign({_id:user._id},process.env.JWT_SECRET , {
            expiresIn:"7d",
        })
        res.status(200).send({
            success:true,
            message:'Login Successfully',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in login',
            error
        })
    }
}
//forgotPasswordController
export const forgotPasswordController = async (req,res) =>{
    try {
        const {email,answer,newPassword} = req.body 
        if(!email){
            res.status(400).send({message:"Email is required"})
        }
        if(!answer){
            res.status(400).send({message:"Answer is required"})
        }
        if(!newPassword){
            res.status(400).send({message:"New Password is required"})
        }
        //check
        const user = await userModel.findOne({email,answer});
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Wrong Email & Answer"
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:"Password Reset Successfully"
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
    }
}


//test Controller
export const testController = (req,res) =>{
    res.send("protected Route")
}

//update profile
export const updateProfileController = async (req,res) =>{
    try {
        const {name,password,email,phone,address} = req.body
        const user = await userModel.findById(req.user._id);
        //password
        if(password && password.length < 6){
            return res.json({error:"password is required and min 6 character long"});
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name:name || user.name,
                password : hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            {new:true}
        );
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:"Error while update proflie",
            error
        })
    }
}