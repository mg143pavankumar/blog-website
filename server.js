const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Article = require("./models/articleSchema");
const articlesRouter = require("./routes/articles");
const app = express();

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 5000;

const DB = process.env.DATABASE;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", function () {
    console.log("Conection has been made!");
  })
  .on("error", function (error) {
    console.log("Error is: ", error);
  });

app.set("view engine", "ejs");

//providing access
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });

  res.render("articles/index", {
    articles: articles,
  });
});

app.use("/articles", articlesRouter);

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
