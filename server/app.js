require('dotenv').config({ path: '../.env' });
const express = require("express");
const cors = require("cors");
const path = require("path");

const instancesRoute = require("./routes/instances");
const bucketsRoute = require("./routes/buckets");
const cisRoute = require("./routes/cisResults");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

app.use("/instances", instancesRoute);
app.use("/buckets", bucketsRoute);
app.use("/cis-results", cisRoute);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}`);
});