const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const complaintController = require('../controllers/complaint.controller');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

// All routes require authentication + admin role
router.use(authMiddleware);
router.use(requireRole('admin'));

// GET /api/admin/complaints — Get all complaints (with filters)
router.get('/complaints', adminController.getAllComplaints);

// PATCH /api/admin/complaints/:id/status — Update status + remark
router.patch('/complaints/:id/status', adminController.updateStatus);

// GET /api/admin/complaints/:id — Get single complaint detail (admin view)
router.get('/complaints/:id', complaintController.getComplaint);

// GET /api/admin/stats — Dashboard statistics
router.get('/stats', adminController.getStats);

module.exports = router;
