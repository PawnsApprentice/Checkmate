import asyncHandler from "express-async-handler";
import Checklist from "../models/checklistModel.js";

// @desc    Get logged in user checklist
// @route GET/api/checklist
// @access Private
const getMyChecklist = asyncHandler(async (req, res) => {
  const checklist = await Checklist.find({ user: req.user._id });
  if (checklist) {
    res.json(checklist);
  } else {
    res.status(404);
    throw new Error("Users checklist items could not be retrieved");
  }
});

// @desc    Delete single checlist
// @route DELETE/api/checklist/:id
// @access Private
const deleteChecklistById = asyncHandler(async (req, res) => {
  const checklist = await Checklist.findById(req.params.id);
  if (checklist) {
    await checklist.deleteOne();
    res.json({ message: "Checklist Item removed" });
  } else {
    res.status(404);
    throw new Error("Checklist item not found");
  }
});

// @desc    Create single checklist item
// @route POST/api/checklist/
// @access Private
const createChecklist = asyncHandler(async (req, res) => {
  const { name, price, description, image, tag } = req.body;

  const checklist = new Checklist({
    name,
    price,
    user: req.user._id,
    description,
    image,
    tag,
  });
  const createdChecklist = await checklist.save();

  if (createdChecklist) {
    res.status(201).json(createdChecklist);
  } else {
    res.status(400);
    throw new Error("Error in creating the checklist item");
  }
});

export { getMyChecklist, deleteChecklistById, createChecklist };
