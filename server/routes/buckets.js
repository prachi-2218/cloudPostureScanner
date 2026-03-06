const express = require("express");
const router = express.Router();
const { getBuckets } = require("../services/s3Service");

router.get("/", async (req, res) => {
  try {
    const buckets = await getBuckets();
    res.json(buckets);
  } catch (error) {
    console.error("Error in /buckets route:", error);
    res.status(500).json({ 
      error: error.message,
      details: "Failed to fetch S3 buckets. Check AWS permissions and configuration."
    });
  }
});

module.exports = router;
