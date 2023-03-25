import asyncHandler from "express-async-handler";
import Checklist from "../models/checklistModel.js";

// @desc    Get logged in user checklist
// @route   GET/api/checklist
// @access  Private
const getMyChecklist = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: "i" } },
          { tags: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
    : {};
  const checklist = await Checklist.find({
    user: req.user._id,
    ...keyword,
  }).sort({
    status: "desc",
  });
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
  const { name, desc, image, tags } = req.body;
  const checklist = new Checklist({
    name,
    user: req.user._id,
    description: desc,
    image,
    tags,
    status: "IN PROGRESS",
  });
  const createdChecklist = await checklist.save();

  if (createdChecklist) {
    res.status(201).json(createdChecklist);
  } else {
    res.status(400);
    throw new Error("Error in creating the checklist item");
  }
});

// @desc    Update checklist item
// @route POST/api/checklist/:id
// @access Private
const updateChecklist = asyncHandler(async (req, res) => {
  const checklist = await Checklist.findById(req.params.id);

  if (checklist) {
    checklist.name = req.body.name || checklist.name;
    checklist.description = req.body.desc || checklist.description;
    checklist.image = req.body.image || checklist.image;
    checklist.status = req.body.status || checklist.status;
    checklist.tags = req.body.tags || checklist.tags;

    const updatedChecklist = await checklist.save();
    res.json({
      _id: updatedChecklist._id,
      name: updatedChecklist.name,
      image: updatedChecklist.image,
      status: updatedChecklist.status,
    });
  } else {
    res.status(404);
    throw new Error("Checklist item not found");
  }
});

export {
  getMyChecklist,
  deleteChecklistById,
  createChecklist,
  updateChecklist,
};
