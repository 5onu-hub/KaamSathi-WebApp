import { Request, Response } from "express";
import { User } from "../models/User.js";
import { WorkerProfile } from "../models/WorkerProfile.js";
import { Webhook } from "svix";

export async function syncUser(req: Request, res: Response) {
  try {
    const { clerkId, email, name, avatar, phone, city, address } = req.body;
    if (!clerkId || !email) {
      return res.status(400).json({ success: false, message: "clerkId and email are required" });
    }

    let user = await User.findOne({ clerkId });
    if (!user) {
      // Check duplicate email
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail.clerkId !== clerkId) {
        existingEmail.clerkId = clerkId;
        if (name) existingEmail.name = name;
        if (avatar) existingEmail.avatar = avatar;
        await existingEmail.save();
        return res.json({ success: true, data: existingEmail, message: "User synced and linked successfully" });
      }

      user = await User.create({
        clerkId,
        email,
        name: name || email.split("@")[0],
        avatar: avatar || "",
        phone: phone || "",
        city: city || "",
        address: address || "",
        role: "customer",
        profileCompleted: false
      });
    } else {
      if (name) user.name = name;
      if (email) user.email = email;
      if (avatar) user.avatar = avatar;
      user.updatedAt = new Date();
      await user.save();
    }

    res.json({ success: true, data: user, message: "User synced successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getMe(req: any, res: Response) {
  try {
    const clerkId = req.auth?.userId || req.query.clerkId;
    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId });
    if (!user) {
      // Auto create default user if not found in DB yet
      user = await User.create({
        clerkId,
        email: `${clerkId}@kaamsathi.test`,
        name: "KaamSathi User",
        role: "customer",
        profileCompleted: false
      });
    }

    let workerProfile = null;
    if (user.role === "worker") {
      workerProfile = await WorkerProfile.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      data: {
        user,
        workerProfile,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function selectRole(req: any, res: Response) {
  try {
    const clerkId = req.auth?.userId || req.body.clerkId;
    const { role } = req.body;

    if (!["customer", "worker", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      { role, updatedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user, message: "Role saved successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function completeProfile(req: any, res: Response) {
  try {
    const clerkId = req.auth?.userId || req.body.clerkId;
    const {
      name,
      phone,
      city,
      address,
      preferredLanguage,
      primarySkill,
      secondarySkills,
      experience,
      hourlyRate,
      dailyRate,
      languages,
      bio,
      availability
    } = req.body;

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (city) user.city = city;
    if (address) user.address = address;
    user.profileCompleted = true;
    user.updatedAt = new Date();
    await user.save();

    let workerProfile = null;
    if (user.role === "worker") {
      workerProfile = await WorkerProfile.findOneAndUpdate(
        { userId: user._id },
        {
          category: primarySkill || "General",
          skills: secondarySkills || [primarySkill || "General"],
          experienceYears: experience ? parseInt(experience) : 1,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 250,
          dailyRate: dailyRate ? parseFloat(dailyRate) : 1500,
          bio: bio || "",
          availabilityStatus: availability || "available",
          location: { city, address },
          verified: true
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      data: { user, workerProfile },
      message: "Profile completed successfully"
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function checkProfile(req: any, res: Response) {
  try {
    const clerkId = req.auth?.userId || req.query.clerkId;
    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId });
    if (!user) {
      return res.json({
        success: true,
        data: {
          role: null,
          profileCompleted: false,
          exists: false
        }
      });
    }

    res.json({
      success: true,
      data: {
        role: user.role,
        profileCompleted: user.profileCompleted,
        exists: true
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function clerkWebhook(req: Request, res: Response) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    const payload = req.body;
    const headers = req.headers;

    const svix_id = headers["svix-id"] as string;
    const svix_timestamp = headers["svix-timestamp"] as string;
    const svix_signature = headers["svix-signature"] as string;

    if (WEBHOOK_SECRET) {
      if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ success: false, message: "Missing svix headers" });
      }

      const wh = new Webhook(WEBHOOK_SECRET);
      try {
        wh.verify(JSON.stringify(payload), {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        });
      } catch (err: any) {
        return res.status(400).json({ success: false, message: "Webhook verification failed", error: err.message });
      }
    }

    const { type, data } = payload;

    if (type === "user.created" || type === "user.updated") {
      const clerkId = data.id;
      const email = data.email_addresses?.[0]?.email_address || "";
      const name = `${data.first_name || ""} ${data.last_name || ""}`.trim() || email.split("@")[0];
      const avatar = data.image_url || "";

      await User.findOneAndUpdate(
        { clerkId },
        { email, name, avatar, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    } else if (type === "user.deleted") {
      const clerkId = data.id;
      const user = await User.findOneAndDelete({ clerkId });
      if (user) {
        await WorkerProfile.findOneAndDelete({ userId: user._id });
      }
    }

    res.json({ success: true, message: "Webhook processed successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateUser(req: any, res: Response) {
  try {
    const clerkId = req.auth?.userId || req.body.clerkId;
    const { name, phone, city, address, avatar } = req.body;
    const user = await User.findOneAndUpdate(
      { clerkId },
      { name, phone, city, address, avatar, updatedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
