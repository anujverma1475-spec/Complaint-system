const Complaint = require('../models/Complaint');

// @desc    Get all complaints (with optional filters)
// @route   GET /api/admin/complaints
// @access  Admin
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate('student', 'name email rollNo department');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update complaint status + add remark
// @route   PATCH /api/admin/complaints/:id/status
// @access  Admin
exports.updateStatus = async (req, res) => {
  try {
    const { status, remark } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['Pending', 'In Review', 'Resolved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.statusHistory.push({
      status,
      remark: remark || '',
      updatedBy: req.user._id,
      updatedAt: new Date(),
    });

    await complaint.save();

    const updated = await Complaint.findById(req.params.id)
      .populate('student', 'name email rollNo department')
      .populate('statusHistory.updatedBy', 'name role');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res) => {
  try {
    const [statusStats, categoryStats, totalStudents] = await Promise.all([
      Complaint.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      Complaint.distinct('student'),
    ]);

    const total = statusStats.reduce((sum, s) => sum + s.count, 0);

    res.json({
      total,
      totalStudents: totalStudents.length,
      byStatus: statusStats.reduce((obj, s) => ({ ...obj, [s._id]: s.count }), {}),
      byCategory: categoryStats.reduce((obj, s) => ({ ...obj, [s._id]: s.count }), {}),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
