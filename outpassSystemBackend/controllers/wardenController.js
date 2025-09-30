import Outpass from "../models/Outpass.js";
import User from "../models/User.js";

// Get all students’ outpasses
export const getAllOutpasses = async (req, res) => {
  try {
    const wardenHostel = req.user?.hostelName;
    if (!wardenHostel) {
      console.log(`Warden ${req.user?._id} has no hostel assigned`);
      return res.status(403).json({ message: "Warden has no hostel assigned" });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    // find student ids for this hostel
    const studentIds = await User.find(
      { hostelName: wardenHostel, role: "student" },
      { _id: 1 }
    ).lean();
    const ids = studentIds.map((s) => s._id);

    const [outpasses, total] = await Promise.all([
      Outpass.find({ student: { $in: ids } })
        .populate("student", "name enrollmentNo hostelName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Outpass.countDocuments({ student: { $in: ids } }),
    ]);

    console.log(
      `Warden ${req.user?._id} fetched outpasses for hostel=${wardenHostel}: count=${outpasses.length}`
    );
    res.json({ data: outpasses, page, limit, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get only pending outpasses
export const getPendingOutpasses = async (req, res) => {
  try {
    const wardenHostel = req.user?.hostelName;
    if (!wardenHostel) {
      console.log(`Warden ${req.user?._id} has no hostel assigned`);
      return res.status(403).json({ message: "Warden has no hostel assigned" });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const studentIds = await User.find(
      { hostelName: wardenHostel, role: "student" },
      { _id: 1 }
    ).lean();
    const ids = studentIds.map((s) => s._id);

    const [outpasses, total] = await Promise.all([
      Outpass.find({ status: "pending", student: { $in: ids } })
        .populate("student", "name enrollmentNo hostelName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Outpass.countDocuments({ status: "pending", student: { $in: ids } }),
    ]);

    res.json({ data: outpasses, page, limit, total });
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
