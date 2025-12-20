// Create 
export const create = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All 
export const getAll = (Model) => async (req, res) => {
  try {
    const docs = await Model.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get By ID
export const getById = (Model) => async (req, res) => {
  try {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }
};

// Update 
export const update = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete 
export const deleteOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};