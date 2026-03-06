const express = require("express");
const router = express.Router();
const { getEC2Instances } = require("../services/ec2Service");

router.get("/", async (req, res) => {
  try {
    const instances = await getEC2Instances();
    res.json(instances);
  } catch (error) {
    console.error("Error in /instances route:", error);
    res.status(500).json({ 
      error: error.message,
      details: "Failed to fetch EC2 instances. Check AWS permissions and configuration."
    });
  }
});

module.exports = router;
