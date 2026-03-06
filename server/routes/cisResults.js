const express = require("express");
const router = express.Router();

const { runCISChecks } = require("../services/cisChecks");
const { storeResults } = require("../services/storageService");

router.get("/", async (req, res) => {
  try {
    console.log("Starting CIS checks...");
    const results = await runCISChecks();
    console.log("CIS checks completed, storing results...");
    
    const id = await storeResults(results);
    console.log(`Results stored with ID: ${id}`);

    res.json({
      scanId: id,
      results
    });
  } catch (error) {
    console.error("Error in /cis-results route:", error);
    res.status(500).json({ 
      error: error.message,
      details: "Failed to run CIS checks. Check AWS permissions and configuration."
    });
  }
});

module.exports = router;
