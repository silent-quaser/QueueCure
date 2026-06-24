const express = require("express");

const {
  seedHospitals,
  getHospitals,
  getNearestHospitals,
} = require("../controllers/hospitalController");

const router = express.Router();

router.get(
  "/seed",
  seedHospitals
);

router.get(
  "/all",
  getHospitals
);

router.post(
  "/nearest",
  getNearestHospitals
);

module.exports = router;