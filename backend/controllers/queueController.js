const Patient = require("../models/Patient");
const QueueSettings = require("../models/QueueSettings");
const Doctor = require("../models/Doctor");
const PDFDocument = require("pdfkit");


const addPatient = async (req, res) => {
  try {
  
   const {
  patientName,
  age,
  gender,
  phoneNumber,
  doctorName,
  symptoms,
  hospital,
  specialization,
} = req.body;
    if (!patientName) {
      return res.status(400).json({
        success: false,
        message: "Patient name is required",
      });
    }

    let settings = await QueueSettings.findOne();

    if (!settings) {
      settings = await QueueSettings.create({});
    }

    const tokenNumber =
      settings.lastTokenIssued + 1;

      let isPriority = false;

const symptomText =
  (symptoms || "")
    .toLowerCase()
    .trim();

const emergencyKeywords = [
  "chest pain",
  "heart attack",
  "stroke",
  "breathing",
  "difficulty breathing",
  "unconscious",
  "severe bleeding",
  "blood loss",
  "critical",
  "emergency",
];

if (
  emergencyKeywords.some(
    (keyword) =>
      symptomText.includes(
        keyword
      )
  )
) {
  isPriority = true;
}

    const patient =
  await Patient.create({
    patientName,
    age,
    gender,
    phoneNumber,
    tokenNumber,
    doctorName,
    symptoms,
    hospital,
    specialization,
    priority: isPriority,
  });
  
  const doctor =
  await Doctor.findOne({
    doctorName,
  });

if (doctor) {
  doctor.currentQueue += 1;

  if (
    doctor.currentQueue <= 2
  ) {
    doctor.availability =
      "Available";
  } else if (
    doctor.currentQueue <= 5
  ) {
    doctor.availability =
      "Busy";
  } else {
    doctor.availability =
      "Offline";
  }

  await doctor.save();
}

    settings.lastTokenIssued =
      tokenNumber;

    await settings.save();

    const io = req.app.get("io");
    io.emit("queueUpdated");

    res.status(201).json({
  success: true,
  patient,
  emergencyDetected:
    isPriority,
  message: isPriority
    ? "🚨 Emergency Case Detected. Priority Queue Activated."
    : "Patient Registered Successfully",
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getQueue = async (req, res) => {
  try {
    const patients =
      await Patient.find({
        status: "waiting",
      }).sort({
        priority: -1,
        tokenNumber: 1,
      });

    const queues = {
      "Dr. Kumar": [],
      "Dr. Priya": [],
      "Dr. Raj": [],
    };

    patients.forEach((patient) => {
      if (
        queues[patient.doctorName]
      ) {
        queues[
          patient.doctorName
        ].push(patient);
      }
    });

    res.json({
      success: true,
      queues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const callNextToken = async (
  req,
  res
) => {
  try {
    const currentPatient =
      await Patient.findOne({
        status: "serving",
      });

    if (currentPatient) {
      currentPatient.status =
        "completed";

      currentPatient.completedAt =
        new Date();

      const duration =
        Math.round(
          (currentPatient.completedAt -
            currentPatient.servedAt) /
            60000
        ) || 1;

      currentPatient.consultationDuration =
        duration;

      await currentPatient.save();
      const doctor =
  await Doctor.findOne({
    doctorName:
      nextPatient.doctorName,
  });

if (doctor) {
  doctor.currentQueue =
    Math.max(
      0,
      doctor.currentQueue - 1
    );

  if (
    doctor.currentQueue <= 2
  ) {
    doctor.availability =
      "Available";
  } else if (
    doctor.currentQueue <= 5
  ) {
    doctor.availability =
      "Busy";
  } else {
    doctor.availability =
      "Offline";
  }

  await doctor.save();
}
    }

    const nextPatient =
      await Patient.findOne({
        status: "waiting",
      }).sort({
        priority: -1,
        tokenNumber: 1,
      });

    if (!nextPatient) {
      return res.status(404).json({
        success: false,
        message:
          "No patients waiting",
      });
    }

    nextPatient.status = "serving";
    nextPatient.servedAt = new Date();

    await nextPatient.save();

    const settings =
      await QueueSettings.findOne();

    settings.currentToken =
      nextPatient.tokenNumber;

    await settings.save();

    const io = req.app.get("io");

    io.emit("tokenCalled", {
      tokenNumber:
        nextPatient.tokenNumber,
      patientName:
        nextPatient.patientName,
      doctorName:
        nextPatient.doctorName,
    });

    io.emit("queueUpdated");

    res.json({
      success: true,
      currentToken:
        nextPatient.tokenNumber,
      patient: nextPatient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getQueueStatus = async (
  req,
  res
) => {
  try {
    const settings =
      await QueueSettings.findOne();

    const currentToken =
      settings?.currentToken || 0;

    const waitingPatients =
      await Patient.find({
        status: "waiting",
      }).sort({
        priority: -1,
        tokenNumber: 1,
      });

    const completedPatients =
      await Patient.find({
        status: "completed",
        consultationDuration: {
          $gt: 0,
          $lte: 30,
        },
      });

    let averageConsultationTime = 10;

    if (completedPatients.length > 0) {
      const total =
        completedPatients.reduce(
          (sum, patient) =>
            sum +
            patient.consultationDuration,
          0
        );

      averageConsultationTime =
        Math.round(
          total /
            completedPatients.length
        );
    }

    const waitingPatientsWithETA =
      waitingPatients.map(
        (patient, index) => ({
          ...patient.toObject(),
          estimatedWaitTime:
            index *
            averageConsultationTime,
        })
      );

    res.json({
      success: true,
      currentToken,
      waitingPatients:
        waitingPatientsWithETA,
      averageConsultationTime,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const makePriorityPatient =
  async (req, res) => {
    try {
      const { patientId } = req.body;

      const patient =
        await Patient.findById(
          patientId
        );

      if (!patient) {
        return res.status(404).json({
          success: false,
          message:
            "Patient not found",
        });
      }

      patient.priority = true;

      await patient.save();

      const io =
        req.app.get("io");

      io.emit("queueUpdated");

      res.json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

const getQueueHistory = async (
  req,
  res
) => {
  try {
    const patients =
      await Patient.find({
        status: "completed",
      })
        .sort({
          completedAt: -1,
        })
        .limit(100);

    res.json({
      success: true,
      patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const generateReport = async (
  req,
  res
) => {
  try {
    const completedPatients =
      await Patient.find({
        status: "completed",
      });

    const waitingPatients =
      await Patient.find({
        status: "waiting",
      });

    const priorityPatients =
      await Patient.find({
        priority: true,
      });

    const settings =
      await QueueSettings.findOne();

    let avgConsultation = 0;

    const validPatients =
      completedPatients.filter(
        (p) =>
          p.consultationDuration > 0 &&
          p.consultationDuration < 120
      );

    if (validPatients.length > 0) {
      avgConsultation =
        Math.round(
          validPatients.reduce(
            (sum, p) =>
              sum +
              p.consultationDuration,
            0
          ) /
            validPatients.length
        );
    }

    const doc =
      new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=QueueCure_Report.pdf"
    );

    doc.pipe(res);

    doc
      .fontSize(24)
      .text(
        "QueueCure Daily Report",
        {
          align: "center",
        }
      );

    doc.moveDown();

    doc
      .fontSize(12)
      .text(
        `Generated At: ${new Date().toLocaleString()}`
      );

    doc.moveDown();

    doc.text(
      `Current Token: ${
        settings?.currentToken || 0
      }`
    );

    doc.text(
      `Completed Patients: ${completedPatients.length}`
    );

    doc.text(
      `Waiting Patients: ${waitingPatients.length}`
    );

    doc.text(
      `Priority Patients: ${priorityPatients.length}`
    );

    doc.text(
      `Average Consultation Time: ${avgConsultation} min`
    );

    doc.moveDown();

    doc
      .fontSize(18)
      .text(
        "Recent Consultations"
      );

    doc.moveDown();

    completedPatients
      .slice(0, 10)
      .forEach((patient) => {
        doc.text(
          `Token A-${patient.tokenNumber} | ${patient.patientName} | ${patient.consultationDuration} min`
        );
      });

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDoctorQueues = async (
  req,
  res
) => {
  try {
    const queues =
      await Patient.aggregate([
        {
          $match: {
            status: "waiting",
          },
        },
        {
          $group: {
            _id: "$doctorName",
            waitingPatients: {
              $sum: 1,
            },
            hospital: {
              $first: "$hospital",
            },
            specialization: {
              $first:
                "$specialization",
            },
          },
        },
        {
          $sort: {
            waitingPatients: -1,
          },
        },
      ]);

    res.json({
      success: true,
      queues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addPatient,
  getQueue,
  callNextToken,
  getQueueStatus,
  makePriorityPatient,
  getQueueHistory,
  generateReport,
  getDoctorQueues,
};