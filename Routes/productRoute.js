import express from "express";
import { isAdmin, requiredSignIn } from "../Middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, relatedProductController, searchProductController, updateProductController } from "../Controllers/productController.js";
import formidable from "express-formidable";


const router = express.Router()

//routes
router.post('/create-product',requiredSignIn,isAdmin,formidable(),createProductController)

//update product
router.put('/update-product/:pid',requiredSignIn,isAdmin,formidable(),updateProductController)

//Get Product
router.get('/get-product',getProductController)

//Get Single Product
router.get('/get-product/:slug',getSingleProductController)

//Delete Product
router.delete('/delete-product/:pid',deleteProductController)

//filter Products
router.post('/product-filters',productFilterController)

//Product Count
router.get('/product-count',productCountController)

//product per page
router.get('/product-list/:page',productListController)

//search product
router.get('/search/:keyword',searchProductController)

//similar Product
router.get('/related-product/:pid/:cid',relatedProductController)

//category wise products
router.get('/product-category/:slug',productCategoryController)

export default router;