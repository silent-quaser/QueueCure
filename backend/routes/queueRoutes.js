const express = require("express");

const {
  addPatient,
  getQueue,
  callNextToken,
  getQueueStatus,
  makePriorityPatient,
  getQueueHistory,
  generateReport,
  getDoctorQueues,
} = require("../controllers/queueController");

const router = express.Router();

router.post(
  "/add-patient",
  addPatient
);

router.get(
  "/queue",
  getQueue
);

router.post(
  "/call-next",
  callNextToken
);

router.post(
  "/priority",
  makePriorityPatient
);

router.get(
  "/status",
  getQueueStatus
);

router.get(
  "/history",
  getQueueHistory
);

router.get(
  "/report",
  generateReport
);

router.get(
  "/doctor-queues",
  getDoctorQueues
);

module.exports = router;