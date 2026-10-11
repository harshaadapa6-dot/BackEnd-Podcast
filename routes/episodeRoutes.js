const express = require("express");
const router = express.Router();
const Episode = require("../models/episode");
const episodeController = require("../controllers/episodeController");
const { protect } = require("../middleware/auth");
router.get("", episodeController.getEpisodes);

router.get("/unlistened",episodeController.getUnlistened);

router.get("/:id", episodeController.getEpisodeById);

router.post("", protect,episodeController.createEpisode);

router.put("/:id",protect, episodeController.updateEpisode);

router.delete("/:id", protect, episodeController.deleteEpisode);

//Harsha Project

module.exports = router;