const express = require('express');
const router = express.Router();


router.route("/")
    .get(async (req, res) => {
        //code here for GET
        res.sendFile('/index.html', { root: "static" });
    });


module.exports = router;