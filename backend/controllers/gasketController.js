import Gasket from "../models/Gasket.js";
import Engine from "../models/Engine.js";
import Brand from "../models/Brand.js";
import Vendor from "../models/Vendor.js";

export const getAllGaskets = async (req, res) => {
  try {
    const gaskets = await Gasket.find()
      .populate("engine")
      .populate("brand")
      .populate("vendor");
    res.json(gaskets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createGasket = async (req, res) => {
  try {
    const {
      part_number,
      material_type,
      packing_type,
      engine,
      brand,
      vendor,
      description,
      stock,
      minstock,
      year,
      added_by,
    } = req.body;

    // Validate references (check if vendor, engine, and brand exist by their ObjectIds)
    const vendorExists = await Vendor.findById(vendor);
    if (!vendorExists) {
      return res
        .status(400)
        .json({ error: `Vendor with ID ${vendor} does not exist.` });
    }

    const engineExists = await Engine.findById(engine);
    if (!engineExists) {
      return res
        .status(400)
        .json({ error: `Engine with ID ${engine} does not exist.` });
    }

    const brandExists = await Brand.findById(brand);
    if (!brandExists) {
      return res
        .status(400)
        .json({ error: `Brand with ID ${brand} does not exist.` });
    }

    // Create the Gasket document with ObjectId references
    const gasket = new Gasket({
      part_number,
      material_type,
      packing_type,
      engine,  // Reference to Engine
      brand,   // Reference to Brand
      vendor,  // Reference to Vendor
      description,
      stock,
      minstock,
      year,
      added_by,
    });

    // Save the gasket to the database
    const savedGasket = await gasket.save();

    // Return success response
    return res.status(201).json({
      message: "Gasket created successfully!",
      data: savedGasket,
    });
  } catch (error) {
    console.error(error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateGasket = async (req, res) => {
  try {
    const updatedGasket = await Gasket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedGasket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteGasket = async (req, res) => {
  try {
    await Gasket.findByIdAndDelete(req.params.id);
    res.json({ message: "Gasket deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
