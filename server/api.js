const express = require("express");

const { createNewRoom, getRooms } = require("./utils");

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("test");
});

router.get("/room", (req, res) => {
    res.json(getRooms());
});

router.post("/room", (req, res) => {
    res.json(createNewRoom())
});

module.exports = router;