const Hospital = require("../models/Hospital");

const seedHospitals = async (
  req,
  res
) => {
  try {
    const count =
      await Hospital.countDocuments();

    if (count > 0) {
      return res.json({
        success: true,
        message:
          "Hospitals already seeded",
      });
    }

    await Hospital.insertMany([
      {
        name: "Apollo Chennai",
        latitude: 13.0604,
        longitude: 80.2496,
      },
      {
        name: "Fortis Chennai",
        latitude: 12.9909,
        longitude: 80.2206,
      },
      {
        name: "MIOT Chennai",
        latitude: 13.0427,
        longitude: 80.1858,
      },
      {
        name: "Global Hospital",
        latitude: 12.9249,
        longitude: 80.2067,
      },
    ]);

    res.json({
      success: true,
      message:
        "Hospitals seeded successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getHospitals = async (
  req,
  res
) => {
  try {
    const hospitals =
      await Hospital.find();

    res.json({
      success: true,
      hospitals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const Patient = require("../models/Patient");

const getNearestHospitals =
  async (req, res) => {
    try {
      const {
        latitude,
        longitude,
      } = req.body;

      const hospitals =
        await Hospital.find();

      const results =
        await Promise.all(
          hospitals.map(
            async (
              hospital
            ) => {
              const distance =
                Math.sqrt(
                  Math.pow(
                    hospital.latitude -
                      latitude,
                    2
                  ) +
                    Math.pow(
                      hospital.longitude -
                        longitude,
                      2
                    )
                );

              const waitingPatients =
                await Patient.countDocuments(
                  {
                    hospital:
                      hospital.name,
                    status:
                      "waiting",
                  }
                );

              return {
                ...hospital.toObject(),
                distance,
                waitingPatients,
              };
            }
          )
        );

      const rankedHospitals =
  results.map(
    (hospital) => {
      const aiScore =
  Math.round(
    70 -
      hospital.waitingPatients * 5 +
      Math.max(
        0,
        30 - hospital.distance * 100
      )
  );

      return {
        ...hospital,
        aiScore,
      };
    }
  );

rankedHospitals.sort(
  (a, b) =>
    b.aiScore -
    a.aiScore
);

      res.json({
  success: true,
  hospitals:
    rankedHospitals,
  recommended:
    rankedHospitals[0] ||
    null,
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
  seedHospitals,
  getHospitals,
  getNearestHospitals,
};