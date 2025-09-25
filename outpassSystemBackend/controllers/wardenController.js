import Outpass from "../models/Outpass.js";

// Get all students’ outpasses
export const getAllOutpasses = async (req, res) => {
  try {
    const outpasses = await Outpass.find()
      .populate("student", "name enrollmentNo hostelName")
      .sort({ createdAt: -1 });
    console.log(
      `Warden ${req.user?._id} fetched all outpasses: count=${outpasses.length}`
    );
    res.json(outpasses);
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
    res.json(pendingOutpasses);
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

    const outpass = await Outpass.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!outpass) return res.status(404).json({ message: "Outpass not found" });

    res.json(outpass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
