const express = require("express");
const Product = require("../../Models/Product");
const router = express.Router();
const { cloudinary } = require("../../utils/cloudinary");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const fileStr = req.body.image;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "ub5r39y6",
    });

    const product = new Product({
      title: req.body.title,
      image: uploadResponse.secure_url,
      price: req.body.price,
      description: req.body.description,
      sauce: req.body.sauce,
    });
    await product.save();

    console.log("image", product.image);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//single product
router.get("/:id", async (req, res) => {
  //console.log(req.params.id);
  try {
    const single = await Product.findById(req.params.id);
    res.send(single);
  } catch (err) {
    console.log(err);
  }
});

//update product info
router.put("/:id", async (req, res) => {
  try {
    const fileStr = req.body.image;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "ub5r39y6",
    });
    const id = req.params.id;

    const updateProduct = {
      title: req.body.title,
      image: uploadResponse.secure_url,
      price: req.body.price,
      description: req.body.description,
      sauce: req.body.sauce,
    };
    const update = await Product.findByIdAndUpdate(
      id,
      { $set: updateProduct },
      { new: true }
    );
    res.json(update);
  } catch (error) {
    console.log(error);
  }
});

//delete Product
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id)
    .then((product) => {
      if (!product) {
        res.status(405).send({
          message: `cannot delete product with ID ${id}, product not found!!!`,
        });
      } else {
        return res.send("deleted");
      }
    })
    .catch((err) => res.send(err.message));
});

router.get("/cloud", async (req, res) => {
  const { resources } = await cloudinary.search
    .expression("folder:ub5r39y6")
    .sort_by("public_id", "desc")
    .max_results(30)
    .execute();

  const publicIds = resources.map((file) => file.public_id);
  res.send(publicIds);
});

router.post("/cloud", async (req, res) => {
  try {
    const fileStr = req.body.data;
    console.log(req.body);
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "ub5r39y6",
    });
    console.log(uploadResponse);
    res.json({ msg: "File uploaded sucessfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = router;
