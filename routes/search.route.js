const router = require("express").Router();
const { search } = require("../controller/search.controller");

router.get("/", search);

module.exports = router;