const Bebe = require("../model/bebeModel");
const jwt=require("jsonwebtoken");

exports.createBebe = async (req, res) => {
    try {
        const newBebe = await Bebe.create(req.body);
        res.status(201).json({
            message: "Bebe created !",
            data: { newBebe }
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create Bebe",
            error: error
        });
    }
};


exports.updateBebe = async (req, res) => {
    try {
        const updatedBebe = await Bebe.findByIdAndUpdate(req.params.id, req.body,{new:true});
        res.status(200).json({
            message: "Bebe updated !",
            data: { updatedBebe }
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update Bebe",
            error: error
        });
    }
};

exports.getBebe = async (req, res) => {
    try {
        const id = req.params; 
        const Bebe = await Bebe.findById(id);
        res.status(200).json({
            message: "Bebe found successfully!",
            data: { Bebe }
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to find Bebe",
            error: error.message
        });
    }
};

exports.getAllBebe = async (req, res) => {
    try {
        const Bebes = await Bebe.find();
        res.status(200).json({
            message: "Bebes found !",
            data: { Bebes }
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to find Bebes",
            error: error.message
        });
    }
};

exports.deleteBebe = async (req, res) => {
    try {
        const id = req.params; 
        const Bebe=await Bebe.findByIdAndDelete(id);

        if(!Bebe) {
            return  res.status(400).json({
                message: "Failed to delete Bebe",
            });
        }

        res.status(204).json({
            message: "Bebe deleted!",
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete Bebe",
            error: error.message
        });
    }
};
