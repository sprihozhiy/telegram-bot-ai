const express = require("express");
const app = express();

const PORT = process.env.PORT || 4001;
app.use(express.static("public"));

app.get("/", (req, res, next) => { 
    res.status(200).send("RM Fella Bot");
});

app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
});