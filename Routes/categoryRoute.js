import express from "express";
import { isAdmin, requiredSignIn } from "../Middlewares/authMiddleware.js";
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../Controllers/categoryController.js";

const router = express.Router()

//routes
//create category
router.post('/create-category',requiredSignIn,isAdmin,createCategoryController)

//update category
router.put('/update-category/:id',requiredSignIn,isAdmin,updateCategoryController)

//get all Category
router.get('/get-category',categoryController)

//single category
router.get('/single-category/:slug',singleCategoryController)

//Delete Category
router.delete('/delete-category/:id',requiredSignIn,isAdmin,deleteCategoryController)

export default router;