const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const seedDoctors = async (
  req,
  res
) => {
  try {
    const count =
      await Doctor.countDocuments();

    if (count > 0) {
      return res.json({
        success: true,
        message:
          "Doctors already exist",
      });
    }

   const doctors = [
  // APOLLO CHENNAI

  { doctorName: "Dr. Rajesh", specialization: "Cardiology", experience: 15, rating: 4.9, hospital: "Apollo Chennai" },
  { doctorName: "Dr. Vinay", specialization: "Cardiology", experience: 12, rating: 4.8, hospital: "Apollo Chennai" },
  { doctorName: "Dr. Suresh", specialization: "Cardiology", experience: 10, rating: 4.7, hospital: "Apollo Chennai" },

  { doctorName: "Dr. Priya", specialization: "Dermatology", experience: 12, rating: 4.8, hospital: "Apollo Chennai" },
  { doctorName: "Dr. Kavya", specialization: "Dermatology", experience: 10, rating: 4.7, hospital: "Apollo Chennai" },
  { doctorName: "Dr. Nisha", specialization: "Dermatology", experience: 8, rating: 4.6, hospital: "Apollo Chennai" },

  { doctorName: "Dr. Rahul", specialization: "Neurology", experience: 14, rating: 4.9, hospital: "Apollo Chennai" },
  { doctorName: "Dr. Meera", specialization: "Neurology", experience: 11, rating: 4.8, hospital: "Apollo Chennai" },
  { doctorName: "Dr. Arjun", specialization: "Neurology", experience: 9, rating: 4.7, hospital: "Apollo Chennai" },

  { doctorName: "Dr. Meena", specialization: "Orthopedics", experience: 16, rating: 4.9, hospital: "Apollo Chennai" },
  { doctorName: "Dr. Ashok", specialization: "Orthopedics", experience: 12, rating: 4.8, hospital: "Apollo Chennai" },
  { doctorName: "Dr. Harish", specialization: "Orthopedics", experience: 10, rating: 4.7, hospital: "Apollo Chennai" },

  { doctorName: "Dr. Kumar", specialization: "General Medicine", experience: 13, rating: 4.9, hospital: "Apollo Chennai" },
  { doctorName: "Dr. Lakshmi", specialization: "General Medicine", experience: 11, rating: 4.8, hospital: "Apollo Chennai" },
  { doctorName: "Dr. Anand", specialization: "General Medicine", experience: 9, rating: 4.7, hospital: "Apollo Chennai" },

  // FORTIS CHENNAI

  { doctorName: "Dr. Senthil", specialization: "Cardiology", experience: 15, rating: 4.9, hospital: "Fortis Chennai" },
  { doctorName: "Dr. Ramesh", specialization: "Cardiology", experience: 13, rating: 4.8, hospital: "Fortis Chennai" },
  { doctorName: "Dr. Karthik", specialization: "Cardiology", experience: 10, rating: 4.7, hospital: "Fortis Chennai" },

  { doctorName: "Dr. Divya", specialization: "Dermatology", experience: 12, rating: 4.9, hospital: "Fortis Chennai" },
  { doctorName: "Dr. Keerthi", specialization: "Dermatology", experience: 10, rating: 4.8, hospital: "Fortis Chennai" },
  { doctorName: "Dr. Swetha", specialization: "Dermatology", experience: 8, rating: 4.7, hospital: "Fortis Chennai" },

  { doctorName: "Dr. Naveen", specialization: "Neurology", experience: 14, rating: 4.9, hospital: "Fortis Chennai" },
  { doctorName: "Dr. Deepak", specialization: "Neurology", experience: 12, rating: 4.8, hospital: "Fortis Chennai" },
  { doctorName: "Dr. Vivek", specialization: "Neurology", experience: 9, rating: 4.7, hospital: "Fortis Chennai" },

  { doctorName: "Dr. Prakash", specialization: "Orthopedics", experience: 15, rating: 4.9, hospital: "Fortis Chennai" },
  { doctorName: "Dr. Manoj", specialization: "Orthopedics", experience: 12, rating: 4.8, hospital: "Fortis Chennai" },
  { doctorName: "Dr. Dinesh", specialization: "Orthopedics", experience: 10, rating: 4.7, hospital: "Fortis Chennai" },

  { doctorName: "Dr. Balaji", specialization: "General Medicine", experience: 14, rating: 4.9, hospital: "Fortis Chennai" },
  { doctorName: "Dr. Sanjay", specialization: "General Medicine", experience: 11, rating: 4.8, hospital: "Fortis Chennai" },
  { doctorName: "Dr. Joseph", specialization: "General Medicine", experience: 9, rating: 4.7, hospital: "Fortis Chennai" },

  // MIOT CHENNAI

  { doctorName: "Dr. Krishnan", specialization: "Cardiology", experience: 16, rating: 4.9, hospital: "MIOT Chennai" },
  { doctorName: "Dr. Pradeep", specialization: "Cardiology", experience: 13, rating: 4.8, hospital: "MIOT Chennai" },
  { doctorName: "Dr. Gokul", specialization: "Cardiology", experience: 11, rating: 4.7, hospital: "MIOT Chennai" },

  { doctorName: "Dr. Janani", specialization: "Dermatology", experience: 13, rating: 4.9, hospital: "MIOT Chennai" },
  { doctorName: "Dr. Rekha", specialization: "Dermatology", experience: 11, rating: 4.8, hospital: "MIOT Chennai" },
  { doctorName: "Dr. Gayathri", specialization: "Dermatology", experience: 9, rating: 4.7, hospital: "MIOT Chennai" },

  { doctorName: "Dr. Mohan", specialization: "Neurology", experience: 15, rating: 4.9, hospital: "MIOT Chennai" },
  { doctorName: "Dr. Sriram", specialization: "Neurology", experience: 12, rating: 4.8, hospital: "MIOT Chennai" },
  { doctorName: "Dr. Naren", specialization: "Neurology", experience: 10, rating: 4.7, hospital: "MIOT Chennai" },

  { doctorName: "Dr. Bharath", specialization: "Orthopedics", experience: 15, rating: 4.9, hospital: "MIOT Chennai" },
  { doctorName: "Dr. Akash", specialization: "Orthopedics", experience: 12, rating: 4.8, hospital: "MIOT Chennai" },
  { doctorName: "Dr. Rohit", specialization: "Orthopedics", experience: 10, rating: 4.7, hospital: "MIOT Chennai" },

  { doctorName: "Dr. Ramya", specialization: "General Medicine", experience: 14, rating: 4.9, hospital: "MIOT Chennai" },
  { doctorName: "Dr. Aarthi", specialization: "General Medicine", experience: 12, rating: 4.8, hospital: "MIOT Chennai" },
  { doctorName: "Dr. Shalini", specialization: "General Medicine", experience: 10, rating: 4.7, hospital: "MIOT Chennai" },

  // GLOBAL HOSPITAL

  { doctorName: "Dr. Vikram", specialization: "Cardiology", experience: 16, rating: 4.9, hospital: "Global Hospital" },
  { doctorName: "Dr. Surya", specialization: "Cardiology", experience: 13, rating: 4.8, hospital: "Global Hospital" },
  { doctorName: "Dr. Kiran", specialization: "Cardiology", experience: 11, rating: 4.7, hospital: "Global Hospital" },

  { doctorName: "Dr. Anjali", specialization: "Dermatology", experience: 13, rating: 4.9, hospital: "Global Hospital" },
  { doctorName: "Dr. Bhavya", specialization: "Dermatology", experience: 11, rating: 4.8, hospital: "Global Hospital" },
  { doctorName: "Dr. Shruthi", specialization: "Dermatology", experience: 9, rating: 4.7, hospital: "Global Hospital" },

  { doctorName: "Dr. Lokesh", specialization: "Neurology", experience: 15, rating: 4.9, hospital: "Global Hospital" },
  { doctorName: "Dr. Pranav", specialization: "Neurology", experience: 12, rating: 4.8, hospital: "Global Hospital" },
  { doctorName: "Dr. Aditya", specialization: "Neurology", experience: 10, rating: 4.7, hospital: "Global Hospital" },

  { doctorName: "Dr. Naveena", specialization: "Orthopedics", experience: 15, rating: 4.9, hospital: "Global Hospital" },
  { doctorName: "Dr. Hemanth", specialization: "Orthopedics", experience: 12, rating: 4.8, hospital: "Global Hospital" },
  { doctorName: "Dr. Varun", specialization: "Orthopedics", experience: 10, rating: 4.7, hospital: "Global Hospital" },

  { doctorName: "Dr. Preethi", specialization: "General Medicine", experience: 14, rating: 4.9, hospital: "Global Hospital" },
  { doctorName: "Dr. Monica", specialization: "General Medicine", experience: 12, rating: 4.8, hospital: "Global Hospital" },
    { doctorName: "Dr. Jennifer", specialization: "General Medicine", experience: 10, rating: 4.7, hospital: "Global Hospital" }
];

const doctorsWithStatus =
  doctors.map((doctor, index) => ({
    ...doctor,

    availability:
      index % 7 === 0
        ? "Offline"
        : index % 3 === 0
        ? "Busy"
        : "Available",

    currentQueue:
      index % 7 === 0
        ? 0
        : Math.floor(
            Math.random() * 10
          ) + 1,
  }));

await Doctor.insertMany(
  doctorsWithStatus
);

    res.json({
      success: true,
      message:
        "Doctors seeded successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDoctors = async (
  req,
  res
) => {
  try {
    const doctors =
  await Doctor.find();
    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const recommendDoctor = async (req, res) => {
  try {
    const {
      symptoms,
      hospital,
    } = req.body;

    let specialization =
      "General Medicine";

    const text =
      symptoms.toLowerCase();

    if (
      text.includes("chest") ||
      text.includes("heart") ||
      text.includes("blood pressure")
    ) {
      specialization =
        "Cardiology";
    } else if (
      text.includes("skin") ||
      text.includes("allergy")
    ) {
      specialization =
        "Dermatology";
    } else if (
      text.includes("headache") ||
      text.includes("brain") ||
      text.includes("migraine")
    ) {
      specialization =
        "Neurology";
    } else if (
      text.includes("bone") ||
      text.includes("fracture") ||
      text.includes("joint")
    ) {
      specialization =
        "Orthopedics";
    }

    const doctors =
      await Doctor.find({
        specialization,
        hospital,
        availability: {
          $ne: "Offline",
        },
      });

    const rankedDoctors =
      doctors
        .map((doctor) => {
          const predictedWaitTime =
            doctor.currentQueue *
            doctor.averageConsultationTime;

          const aiScore =
            Math.round(
              doctor.rating * 12 +
                doctor.experience *
                  1.5 -
                doctor.currentQueue *
                  2
            );

          return {
            ...doctor.toObject(),
            aiScore,
            predictedWaitTime,
          };
        })
        .sort(
          (a, b) =>
            b.aiScore -
            a.aiScore
        );

    const topDoctors =
      rankedDoctors.slice(
        0,
        3
      );

    res.json({
      success: true,
      specialization,
      doctors: topDoctors,
      recommendedDoctor:
        topDoctors[0] || null,
      reason:
        topDoctors.length > 0
          ? `${topDoctors[0].doctorName} was selected based on availability, experience, rating and predicted waiting time.`
          : "",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

const getDoctorPerformance = async (
  req,
  res
) => {
  try {
    const doctors =
      await Doctor.find();

    const performance =
      await Promise.all(
        doctors.map(
          async (doctor) => {
            const servedPatients =
              await Patient.countDocuments(
                {
                  doctorName:
                    doctor.doctorName,
                  status:
                    "completed",
                }
              );

            const waitingPatients =
              await Patient.countDocuments(
                {
                  doctorName:
                    doctor.doctorName,
                  status:
                    "waiting",
                }
              );

            return {
              doctorName:
                doctor.doctorName,
              specialization:
                doctor.specialization,
              hospital:
                doctor.hospital,
              rating:
                doctor.rating,
              patientsServed:
                servedPatients,
              currentQueue:
                waitingPatients,
            };
          }
        )
      );

    performance.sort(
      (a, b) =>
        b.patientsServed -
        a.patientsServed
    );

    res.json({
      success: true,
      performance,
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
  seedDoctors,
  getDoctors,
  recommendDoctor,
  getDoctorPerformance,
};