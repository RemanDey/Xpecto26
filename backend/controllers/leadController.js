import Lead from "../models/Lead.js";

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req, res, next) => {
  try {
    const { passType } = req.body;
    
    // Determine the amount based on pass type and date
    const now = new Date();
    const earlyBirdDeadline = new Date("2026-02-15T23:59:59");
    
    let amount;
    let actualPassType;
    
    if (now <= earlyBirdDeadline) {
      amount = 2299;
      actualPassType = "early_bird";
    } else {
      amount = 2499;
      actualPassType = "regular";
    }

    // Check if user already has a pending or completed lead
    const existingLead = await Lead.findOne({
      user: req.user._id,
      paymentStatus: { $in: ["pending", "completed"] },
    });

    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending or completed registration",
        lead: existingLead,
      });
    }

    const lead = await Lead.create({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.contactNumber || "",
      collegeName: req.user.collegeName || "",
      passType: actualPassType,
      amount,
    });

    res.status(201).json({
      success: true,
      message: "Registration initiated successfully",
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's lead
// @route   GET /api/leads/my-lead
// @access  Private
export const getMyLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads (Admin only)
// @route   GET /api/leads
// @access  Private/Admin
export const getAllLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find()
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead payment status (Admin only)
// @route   PUT /api/leads/:id
// @access  Private/Admin
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentVerified, transactionId, notes } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus,
        paymentVerified,
        transactionId,
        notes,
      },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead stats (Admin only)
// @route   GET /api/leads/stats
// @access  Private/Admin
export const getLeadStats = async (req, res, next) => {
  try {
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalLeads = await Lead.countDocuments();
    const verifiedLeads = await Lead.countDocuments({ paymentVerified: true });

    res.status(200).json({
      success: true,
      totalLeads,
      verifiedLeads,
      stats,
    });
  } catch (error) {
    next(error);
  }
};
