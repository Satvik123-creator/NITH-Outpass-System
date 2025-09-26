import Outpass from "../models/Outpass.js";

// Get all students’ outpasses
export const getAllOutpasses = async (req, res) => {
  try {
    const outpasses = await Outpass.find()
      .populate("student", "name enrollmentNo hostelName")
      .sort({ createdAt: -1 });

    // Restrict to outpasses for students in the warden's hostel
    const wardenHostel = req.user?.hostelName;
    if (!wardenHostel) {
      console.log(`Warden ${req.user?._id} has no hostel assigned`);
      return res.status(403).json({ message: "Warden has no hostel assigned" });
    }

    const filtered = outpasses.filter(
      (op) => op.student && op.student.hostelName === wardenHostel
    );

    console.log(
      `Warden ${req.user?._id} fetched outpasses for hostel=${wardenHostel}: count=${filtered.length}`
    );
    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get only pending outpasses
export const getPendingOutpasses = async (req, res) => {
  try {
    const pendingOutpasses = await Outpass.find({ status: "pending" })
      .populate("student", "name enrollmentNo hostelName")
      .sort({ createdAt: -1 });

    const wardenHostel = req.user?.hostelName;
    if (!wardenHostel) {
      console.log(`Warden ${req.user?._id} has no hostel assigned`);
      return res.status(403).json({ message: "Warden has no hostel assigned" });
    }

    const filtered = pendingOutpasses.filter(
      (op) => op.student && op.student.hostelName === wardenHostel
    );

    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single outpass by id (with student details)
export const getOutpassById = async (req, res) => {
  try {
    const { id } = req.params;
    const outpass = await Outpass.findById(id).populate(
      "student",
      "name enrollmentNo hostelName email"
    );
    if (!outpass) return res.status(404).json({ message: "Outpass not found" });
    res.json(outpass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update status of an outpass
export const updateOutpass = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // fetch the outpass and populate student to verify hostel
    const outpass = await Outpass.findById(id).populate(
      "student",
      "hostelName"
    );
    if (!outpass) return res.status(404).json({ message: "Outpass not found" });

    const wardenHostel = req.user?.hostelName;
    if (!wardenHostel)
      return res.status(403).json({ message: "Warden has no hostel assigned" });

    if (!outpass.student || outpass.student.hostelName !== wardenHostel) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this outpass" });
    }

    outpass.status = status;
    await outpass.save();
    res.json(outpass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
