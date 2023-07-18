import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
} from "../Controllers/authController.js";
import { isAdmin, requiredSignIn } from "../Middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//RIGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN  || METHOD POST
router.post("/login", loginController);

//FORGOT Password || POST
router.post('/forgot-password',forgotPasswordController);

//Test Routes
router.get("/test",requiredSignIn,isAdmin, testController);

//Protected User Auth Route
router.get('/user-auth',requiredSignIn, (req,res) =>{
  res.status(200).send({ok:true});
})
//Protected Admin Auth Route
router.get('/admin-auth',requiredSignIn,isAdmin, (req,res) =>{
  res.status(200).send({ok:true});
})

//update profile
router.put('/profile',requiredSignIn,updateProfileController)

export default router;
