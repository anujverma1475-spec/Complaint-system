const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

// All routes require authentication + student role
router.use(authMiddleware);
router.use(requireRole('student'));

// POST /api/complaints — Submit new complaint (with optional image)
router.post(
  '/',
  complaintController.upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category').isIn(['Hostel', 'Academic', 'Infrastructure', 'Ragging', 'Other']).withMessage('Valid category is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  complaintController.createComplaint
);

// GET /api/complaints/my — Get logged-in student's complaints
router.get('/my', complaintController.getMyComplaints);

// GET /api/complaints/:id — Get single complaint detail (student can only view own)
// Note: Admin can also access this via admin routes, but this route checks ownership
router.get('/:id', complaintController.getComplaint);

module.exports = router;
