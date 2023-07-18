import slugify from "slugify";
import productModel from "../Models/productModel.js";
import categoryModel from "../Models/categoryModel.js";

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      rating,
      image,
      slug,
      price,
      oPrice,
      quantity,
      shipping,
      catagory,
    } = req.fields;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !rating:
        return res.status(500).send({ error: "Rating is Required" });
      case !image:
        return res.status(500).send({ error: "image is Required" });
      case !price:
        return res.status(500).send({ error: "price is Required" });
      case !oPrice:
        return res.status(500).send({ error: "oPrice is Required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is Required" });
      case !catagory:
        return res.status(500).send({ error: "catagory is Required" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error is Creating Product",
    });
  }
};

//get all product
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalProduct: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in Getting Product",
    });
  }
};

//get Single Product
export const getSingleProductController = async (req, res) => {
  try {
    const products = await productModel.find({ slug: req.params.slug });
    const category = await categoryModel.findOne({ _id: products[0].catagory });
    res.status(200).send({
      success: true,
      message: "Single Products",
      products,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in Getting Single Product",
    });
  }
};

//Delete Product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error while deleting Product",
    });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      rating,
      image,
      slug,
      price,
      oPrice,
      quantity,
      shipping,
      catagory,
    } = req.fields;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !rating:
        return res.status(500).send({ error: "Rating is Required" });
      case !image:
        return res.status(500).send({ error: "image is Required" });
      case !price:
        return res.status(500).send({ error: "price is Required" });
      case !oPrice:
        return res.status(500).send({ error: "oPrice is Required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is Required" });
      case !catagory:
        return res.status(500).send({ error: "catagory is Required" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error is Updating Product",
    });
  }
};

//filters
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.catagory = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

//product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Product Count",
      error,
    });
  }
};

//product per page
export const productListController = async (req, res) => {
  try {
    const perPage = 12;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
      res.status(200).send({
        success:true,
        products,
      })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Product per page controller",
      error,
    });
  }
};

//search product
export const searchProductController = async (req,res) =>{
  try {
    const {keyword} = req.params
    const result = await productModel.find({
      $or:[
        {name:{$regex: keyword, $options:"i"}},
        {price:{$regex: keyword, $options:"i"}}
      ]
    })
    res.json(result);
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Error in search product API',
      error,
    })
  }
}

//similar product
export const relatedProductController = async (req,res) =>{
  try {
    const {pid,cid} = req.params;
    const product = await productModel.find({
      catagory:cid,
      _id:{$ne:pid},
    }).limit(5).populate("catagory");
    res.status(200).send({
      success:true,
      product,
    });
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Error in similar product API',
      error,
    })
  }
}

//category wise products
export const productCategoryController = async (req,res) =>{
  try {
    const catagory = await categoryModel.findOne({slug:req.params.slug});
    const products = await productModel.find({catagory}).populate("catagory");
    res.status(200).send({
      success:true,
      catagory,
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:'Error in category wise product API',
      error,
  })
}
}