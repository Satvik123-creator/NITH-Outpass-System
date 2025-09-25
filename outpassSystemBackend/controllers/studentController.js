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
    const outpasses = await Outpass.find({ student: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(outpasses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= Get Pending Outpasses (for student) =================
export const getPendingOutpasses = async (req, res) => {
  try {
    const pendingOutpasses = await Outpass.find({
      student: req.user._id,
      status: "pending",
    }).sort({ createdAt: -1 });

    res.json(pendingOutpasses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
