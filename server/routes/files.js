import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import File from "../models/File.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @route   POST /api/files/upload
// @desc    Upload a file
// @access  Private
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { isPublic, description, tags } = req.body;

    // Create file document
    const file = await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      owner: req.user._id,
      isPublic: isPublic === "true" || isPublic === true,
      description: description || "",
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim())
        : [],
    });

    // Populate owner info
    await file.populate("owner", "username email");

    // Emit socket event (will be handled by socket.io)
    if (req.app.get("io")) {
      req.app.get("io").emit("file:uploaded", file);
    }

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: { file },
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Delete file if database save failed
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error during upload",
    });
  }
});

// @route   GET /api/files
// @desc    Get all files (user's files + public files)
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { filter } = req.query;

    let query;
    if (filter === "my-files") {
      query = { owner: req.user._id };
    } else if (filter === "public") {
      query = { isPublic: true };
    } else {
      // Default: show user's files + public files from others
      query = {
        $or: [{ owner: req.user._id }, { isPublic: true }],
      };
    }

    const files = await File.find(query)
      .populate("owner", "username email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        files,
        count: files.length,
      },
    });
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   GET /api/files/:id
// @desc    Get single file details
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate(
      "owner",
      "username email",
    );

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check permissions
    if (
      !file.isPublic &&
      file.owner._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This file is private.",
      });
    }

    res.json({
      success: true,
      data: { file },
    });
  } catch (error) {
    console.error("Get file error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   PUT /api/files/:id
// @desc    Update file metadata
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check ownership
    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own files.",
      });
    }

    // Update allowed fields
    const { isPublic, description, tags } = req.body;

    if (isPublic !== undefined) file.isPublic = isPublic;
    if (description !== undefined) file.description = description;
    if (tags !== undefined)
      file.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((t) => t.trim());

    await file.save();
    await file.populate("owner", "username email");

    // Emit socket event
    if (req.app.get("io")) {
      req.app.get("io").emit("file:updated", file);
    }

    res.json({
      success: true,
      message: "File updated successfully",
      data: { file },
    });
  } catch (error) {
    console.error("Update file error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   DELETE /api/files/:id
// @desc    Delete file
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check ownership
    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own files.",
      });
    }

    // Delete physical file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from database
    await file.deleteOne();

    // Emit socket event
    if (req.app.get("io")) {
      req.app.get("io").emit("file:deleted", { fileId: file._id });
    }

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   GET /api/files/download/:id
// @desc    Download file
// @access  Private
router.get("/download/:id", protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check permissions
    if (!file.isPublic && file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This file is private.",
      });
    }

    // Check if file exists
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // Set headers and send file
    res.setHeader("Content-Type", file.mimetype);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`,
    );
    res.sendFile(path.resolve(file.path));
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   GET /api/files/stream/:id
// @desc    Stream file (for video/audio)
// @access  Private
router.get("/stream/:id", protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Check permissions
    if (!file.isPublic && file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This file is private.",
      });
    }

    // Check if file exists
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    const stat = fs.statSync(file.path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Parse Range header
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(file.path, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": file.mimetype,
      });

      fileStream.pipe(res);
    } else {
      // No range, send entire file
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": file.mimetype,
      });

      fs.createReadStream(file.path).pipe(res);
    }
  } catch (error) {
    console.error("Stream error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

export default router;
