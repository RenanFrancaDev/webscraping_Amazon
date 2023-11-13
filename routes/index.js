var express = require("express");
const getCachedPage = require("../src/functions/scrape");
var validator = require("validator");

var router = express.Router();

router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

router.get("/api/scrape", async function (req, res, next) {
  const keyword = validator.escape(''+req.query.keyword).trim(); //cleaning input
  if (!keyword)
			return res
			.status(400)
			.json(
				"keyword query string required, example query: /api/scrape?keyword=hat"
			);

  getCachedPage(keyword).then((products) => {
    if (!products)
     	return res
        .status(400)
        .json(
          "something went wrong when scraping Amazon, contact the developer."
        );

    res.json({//returning the data
      keyword,
      products_count: products.length,
      products,
    });
  });
});

module.exports = router;