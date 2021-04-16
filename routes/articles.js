const express = require("express");
const Article = require("./../models/articleSchema");
const router = express.Router();

router.get("/new", (req, res) => {
  //here we are passing a default article which is empty
  res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  res.render("articles/show", { article: article });

  if (article == null) res.redirect("/");
});

router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

//function
function saveArticleAndRedirect(path) {
  return async (req, res) => {
    // Here we are posting the data into the database

    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (error) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}

module.exports = router;
