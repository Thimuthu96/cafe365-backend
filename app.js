const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cafe365Routes = require("./src/routes/routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1/cafe365", cafe365Routes);

const PORT = process.env.PORT || 3010;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
