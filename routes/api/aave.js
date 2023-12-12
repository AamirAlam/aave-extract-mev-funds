const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    return res.status(200).json("working...🍺");
  } catch (error) {
    console.log(" error ", error);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

module.exports = router;
