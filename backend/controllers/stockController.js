import Stock from "../models/Stock.js";

// Update stock quantity
export const updateStockQuantity = async (req, res) => {
  const { stockId } = req.params; // Get the stock ID from the route parameter
  const { quantity, updatedBy } = req.body; // Get the new quantity and updater's name from the request body

  try {
    // Validate input
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: "Invalid quantity value." });
    }

    // Find and update the stock
    const updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      {
        quantity,
        updated_by: updatedBy || "Unknown",
        latest_update_date: Date.now(),
      },
      { new: true } // Return the updated document
    );

    // Check if stock was found and updated
    if (!updatedStock) {
      return res.status(404).json({ error: "Stock not found." });
    }

    return res.status(200).json({
      message: "Stock quantity updated successfully.",
      data: updatedStock,
    });
  } catch (error) {
    console.error("Error updating stock quantity:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Increase stock quantity
export const increaseStockQuantity = async (req, res) => {
  const { stockId } = req.params; // Get the stock ID from the route parameter
  const { quantity } = req.body; // Get the new quantity

  try {
    // Validate input
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: "Invalid quantity value." });
    }

    // Find and update the stock
    const updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      {
        $inc: { quantity: quantity },
      },
      { new: true } // Return the updated document
    );

    // Check if stock was found and updated
    if (!updatedStock) {
      return res.status(404).json({ error: "Stock not found." });
    }

    return res.status(200).json({
      message: "Stock quantity updated successfully.",
      data: updatedStock,
    });
  } catch (error) {
    console.error("Error updating stock quantity:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

//Decrease stock quantity
export const decreaseStockQuantity = async (req, res) => {
  const { stockId } = req.params; // Get the stock ID from the route parameter
  const { quantity } = req.body; // Get the new quantity

  try {
    // Validate input
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: "Invalid quantity value." });
    }

    // Find and update the stock
    const updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      {
        $inc: { quantity: -quantity },
      },
      { new: true } // Return the updated document
    );

    // Check if stock was found and updated
    if (!updatedStock) {
      return res.status(404).json({ error: "Stock not found." });
    }

    return res.status(200).json({
      message: "Stock quantity updated successfully.",
      data: updatedStock,
    });
  } catch (error) {
    console.error("Error updating stock quantity:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


//Get all stocks
export const getAllStocks = async (req, res) => {
  try {
    //Get all stocks
    const stocks = await Stock.find().populate("branch").populate("gasket");
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};  