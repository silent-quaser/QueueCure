const express = require("express");

const {
  seedDoctors,
  getDoctors,
  recommendDoctor,
  getDoctorPerformance,
} = require("../controllers/doctorController");

const router = express.Router();

router.get(
  "/seed",
  seedDoctors
);

router.get(
  "/all",
  getDoctors
);

router.get(
  "/performance",
  getDoctorPerformance
);

router.post(
  "/recommend",
  recommendDoctor
);

module.exports = router;