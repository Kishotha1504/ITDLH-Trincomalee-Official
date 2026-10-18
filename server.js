const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const db = require('./db/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://via.placeholder.com", "https://*.openstreetmap.org", "https://*.tile.openstreetmap.org"],
        frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
        connectSrc: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// System Health & Database Connectivity Status
app.get('/api/status', async (req, res) => {
  const isPg = await db.isPostgres();
  res.json({
    status: 'online',
    institute: 'Zonal Information Technology and Distance Learning Hub, Trincomalee (ITDLH-Trincomalee)',
    tvec_reg: 'P19/0052',
    designer: 'Mrs. Kishotha Kumanan',
    database: isPg ? 'PostgreSQL (Connected)' : 'Resilient Data Store (Active)',
    timestamp: new Date().toISOString()
  });
});

// 1. GET /api/notices - Active announcements and batch notices
app.get('/api/notices', async (req, res) => {
  try {
    const notices = await db.getNotices(true);
    res.json({
      success: true,
      count: notices.length,
      data: notices
    });
  } catch (err) {
    console.error('Error fetching notices:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve notices' });
  }
});

// 2. GET /api/downloads - Download center resources
app.get('/api/downloads', async (req, res) => {
  try {
    const downloads = await db.getDownloads();
    res.json({
      success: true,
      count: downloads.length,
      data: downloads
    });
  } catch (err) {
    console.error('Error fetching downloads:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve downloadable resources' });
  }
});

// 3. POST /api/register - Student Registration Endpoint with comprehensive input validation
app.post(
  '/api/register',
  [
    body('full_name')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('Full Name is required (minimum 3 characters).'),
    body('name_with_initials')
      .trim()
      .notEmpty()
      .withMessage('Name with Initials is required (e.g. K. Perera).'),
    body('nic')
      .trim()
      .notEmpty()
      .withMessage('NIC or Birth Certificate Number is required.')
      .matches(/^([0-9]{9}[vVxX]|[0-9]{12}|[A-Za-z0-9\-\/]{4,20})$/)
      .withMessage('Please provide a valid Sri Lankan NIC (9 digits+V or 12 digits) or Certificate Number.'),
    body('dob')
      .notEmpty()
      .withMessage('Date of Birth is required.')
      .isISO8601()
      .withMessage('Valid Date of Birth is required (YYYY-MM-DD).'),
    body('gender')
      .trim()
      .isIn(['Male', 'Female', 'Other'])
      .withMessage('Please select a valid gender option.'),
    body('address')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Residential Address is required (minimum 5 characters).'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Contact phone/WhatsApp number is required.')
      .matches(/^(\+?94|0)?[0-9]{9,10}$/)
      .withMessage('Please enter a valid 10-digit phone number.'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email address is required.'),
    body('qualification')
      .trim()
      .notEmpty()
      .withMessage('Please select your highest educational qualification.'),
    body('course_name')
      .trim()
      .notEmpty()
      .withMessage('Please select the course or NVQ program you wish to apply for.'),
    body('batch_preference')
      .trim()
      .notEmpty()
      .withMessage('Please select your preferred batch time.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the highlighted fields.',
        errors: errors.array()
      });
    }

    try {
      const studentData = {
        full_name: req.body.full_name,
        name_with_initials: req.body.name_with_initials,
        nic: req.body.nic.toUpperCase(),
        dob: req.body.dob,
        gender: req.body.gender,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        qualification: req.body.qualification,
        course_name: req.body.course_name,
        batch_preference: req.body.batch_preference,
        status: 'Pending Verification'
      };

      const saved = await db.saveRegistration(studentData);

      // Generate a formatted registration reference (e.g. ITDLH-2026-0001)
      const regRef = `ITDLH-${new Date().getFullYear()}-${String(saved.id).padStart(4, '0')}`;

      res.status(201).json({
        success: true,
        message: 'Student application received successfully!',
        reference_no: regRef,
        data: saved
      });
    } catch (err) {
      console.error('Error submitting student registration:', err);
      res.status(500).json({
        success: false,
        message: 'An error occurred while processing your registration. Please try again.'
      });
    }
  }
);

// 4. POST /api/contact - General Inquiry Form Endpoint
app.post(
  '/api/contact',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Your name is required.'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required.'),
    body('phone').optional().trim(),
    body('subject').trim().isLength({ min: 3 }).withMessage('Subject is required.'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for contact inquiry.',
        errors: errors.array()
      });
    }

    try {
      const contactData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || '',
        subject: req.body.subject,
        message: req.body.message
      };

      const saved = await db.saveContactInquiry(contactData);

      res.status(201).json({
        success: true,
        message: 'Your inquiry has been successfully transmitted to ITDLH-Trincomalee administration.',
        data: saved
      });
    } catch (err) {
      console.error('Error saving contact inquiry:', err);
      res.status(500).json({
        success: false,
        message: 'Unable to submit your inquiry at this moment.'
      });
    }
  }
);

// 5. Admin / Staff portal data endpoint (for Manager Mrs. Mayuri Kuperan & Instructor Mrs. Kishotha Kumanan)
app.get('/api/admin/registrations', async (req, res) => {
  try {
    const registrations = await db.getRegistrations();
    res.json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (err) {
    console.error('Admin registrations fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve registrations' });
  }
});

app.get('/api/admin/inquiries', async (req, res) => {
  try {
    const inquiries = await db.getContactInquiries();
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (err) {
    console.error('Admin inquiries fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve inquiries' });
  }
});

// Fallback to index.html for single page navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🏛️  ITDLH Trincomalee Institutional Portal & Management System`);
  console.log(`📍  Address: Zonal ITDLH, Kanniya Road, Trincomalee`);
  console.log(`🏷️  TVEC Reg: P19/0052 | Affiliated: Zonal Education Office & MoE`);
  console.log(`👩‍🏫 Designed & Developed by: Mrs. Kishotha Kumanan`);
  console.log(`🌐 Server active on: http://localhost:${PORT}`);
  console.log(`================================================================`);
});
