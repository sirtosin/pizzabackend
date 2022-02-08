const Order = require("../../Models/Order");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    console.log("order", order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

//single Order
router.get("/:id", async (req, res) => {
  //console.log(req.params.id);
  try {
    const single = await Order.findById(req.params.id);
    res.send(single);
  } catch (err) {
    console.log(err);
  }
});

//update Order info
router.put("/:id", async (req, res) => {
  try {
    const update = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(update);
  } catch (error) {
    console.log(error);
  }
});

//delete Order
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Order.findByIdAndDelete(id)
    .then((order) => {
      if (!order) {
        res.status(405).send({
          message: `cannot delete order with ID ${id}, order not found!!!`,
        });
      } else {
        return res.send("deleted");
      }
    })
    .catch((err) => res.send(err.message));
});
module.exports = router;

// export default async function handler(req, res) {
//   const { method, cookies } = req;

//   const token = cookies.token;

//   if (method === "GET") {
//     try {
//       const products = await Product.find();
//       res.status(200).json(products);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }

//   if (method === "POST") {
//     if (!token || token !== process.env.token) {
//       return res.status(401).json("Not authenticated!");
//     }
//     try {
//       const product = await Product.create(req.body);
//       res.status(201).json(product);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// }
