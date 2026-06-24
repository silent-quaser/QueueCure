const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

const getAnalytics = async (req, res) => {
  try {
    const totalPatients =
      await Patient.countDocuments();

    const waitingPatients =
      await Patient.countDocuments({
        status: "waiting",
      });

    const servingPatients =
      await Patient.countDocuments({
        status: "serving",
      });

    const priorityPatients =
      await Patient.countDocuments({
        priority: true,
      });

    const completedPatients =
      await Patient.find({
        status: "completed",
      });

    const activeDoctors =
      await Doctor.countDocuments({
        active: true,
      });

    let averageConsultationTime = 0;

    const validConsultations =
      completedPatients.filter(
        (patient) =>
          patient.consultationDuration > 0 &&
          patient.consultationDuration <= 120
      );

    if (validConsultations.length > 0) {
      const totalTime =
        validConsultations.reduce(
          (sum, patient) =>
            sum +
            patient.consultationDuration,
          0
        );

      averageConsultationTime =
        Math.round(
          totalTime /
            validConsultations.length
        );
    }

    const queueEfficiency =
      totalPatients > 0
        ? Math.round(
            (completedPatients.length /
              totalPatients) *
              100
          )
        : 0;

    const doctorUtilization =
      activeDoctors > 0
        ? Math.min(
            100,
            Math.round(
              ((waitingPatients +
                servingPatients) /
                activeDoctors) *
                20
            )
          )
        : 0;

    res.json({
      success: true,
      analytics: {
        totalPatients,
        waitingPatients,
        servingPatients,
        completedPatients:
          completedPatients.length,
        priorityPatients,
        activeDoctors,
        averageConsultationTime,
        queueEfficiency,
        doctorUtilization,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};