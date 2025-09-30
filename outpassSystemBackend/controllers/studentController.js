import Outpass from "../models/Outpass.js";

// ================= Create Outpass =================
export const createOutpass = async (req, res) => {
  try {
    const { reason, fromDate, toDate, roomNumber, addressOnLeave } = req.body;

    const outpass = new Outpass({
      student: req.user._id,
      reason,
      fromDate,
      toDate,
      roomNumber,
      addressOnLeave,
      status: "pending",
    });

    await outpass.save();
    console.log(`Outpass created by user ${req.user._id}:`, {
      outpassId: outpass._id,
      reason,
      fromDate,
      toDate,
    });
    res.status(201).json(outpass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= Get All Outpasses (History) =================
export const getStudentOutpasses = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [outpasses, total] = await Promise.all([
      Outpass.find({ student: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Outpass.countDocuments({ student: req.user._id }),
    ]);

    res.json({ data: outpasses, page, limit, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= Get Pending Outpasses (for student) =================
export const getPendingOutpasses = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [pendingOutpasses, total] = await Promise.all([
      Outpass.find({ student: req.user._id, status: "pending" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Outpass.countDocuments({ student: req.user._id, status: "pending" }),
    ]);

    res.json({ data: pendingOutpasses, page, limit, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single outpass by id for the logged-in student
export const getOutpassById = async (req, res) => {
  try {
    const { id } = req.params;
    const outpass = await Outpass.findById(id).populate(
      "student",
      "name enrollmentNo hostelName email"
    );
    if (!outpass) return res.status(404).json({ message: "Outpass not found" });

    // ensure the requesting student owns this outpass
    if (String(outpass.student._id) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this outpass" });
    }

    res.json(outpass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
