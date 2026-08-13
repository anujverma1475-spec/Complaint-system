const multer = require('multer');
const path = require('path');
const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

exports.upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Student
exports.createComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, category, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const complaint = await Complaint.create({
      student: req.user._id,
      title,
      category,
      description,
      imageUrl,
      status: 'Pending',
      statusHistory: [{
        status: 'Pending',
        remark: 'Complaint submitted',
        updatedBy: req.user._id,
        updatedAt: new Date(),
      }],
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all complaints by logged-in student
// @route   GET /api/complaints/my
// @access  Student
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .populate('student', 'name email rollNo department');

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single complaint detail
// @route   GET /api/complaints/:id
// @access  Student (own) / Admin
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'name email rollNo department')
      .populate('statusHistory.updatedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Students can only view their own complaints
    if (req.user.role === 'student' && complaint.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
