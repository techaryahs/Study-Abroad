const ResearchGroup = require("../models/ResearchGroup");

const createResearchGroup = async (req, res) => {
  try {
    const { topic, description, maxAuthors } = req.body;
    
    // Check if user is logged in
    if (!req.user || !req.user.id) {
       return res.status(401).json({ success: false, error: "Please log in to create a research group" });
    }

    const newGroup = await ResearchGroup.create({
      topic,
      description,
      maxAuthors,
      creator: req.user.id,
      members: [req.user.id],
      status: "open"
    });

    res.status(201).json({ success: true, data: newGroup });
  } catch (err) {
    console.error("Error creating research group:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

const getResearchGroups = async (req, res) => {
  try {
    const groups = await ResearchGroup.find()
      .populate("creator", "name profile.profileImage profile.isPublic")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: groups });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const joinResearchGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const group = await ResearchGroup.findById(id);

    if (!group) {
      return res.status(404).json({ success: false, error: "Group not found" });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ success: false, error: "You are already a member of this group" });
    }

    if (group.members.length >= group.maxAuthors + 1) { // Creator + maxAuthors
      return res.status(400).json({ success: false, error: "This group is already full" });
    }

    group.members.push(userId);
    if (group.members.length >= group.maxAuthors + 1) {
      group.status = "full";
    }

    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  createResearchGroup,
  getResearchGroups,
  joinResearchGroup
};
