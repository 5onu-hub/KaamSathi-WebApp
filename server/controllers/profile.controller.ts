import { Request, Response } from "express";
import { UserProfile, UserPreferences, SavedAddress, ActivityLog } from "../models/UserProfile.ts";

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || "cust_1";
    let profile = await UserProfile.findOne({ userId });
    if (!profile) {
      profile = await UserProfile.create({
        userId,
        email: "aarav.sharma@example.com",
        fullName: "Aarav Sharma",
        role: userId.includes("worker") ? "worker" : "customer",
        city: "New Delhi",
        state: "Delhi"
      });
    }

    // Get addresses
    const addresses = await SavedAddress.find({ userId });
    
    res.json({
      success: true,
      data: {
        ...profile.toObject(),
        addresses
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const { userId = "cust_1", ...updateData } = req.body;
    let profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    // Log activity
    await ActivityLog.create({
      userId,
      action: "Profile Update",
      details: "Updated personal profile information",
      device: req.headers["user-agent"]?.includes("Mac") ? "Macintosh" : "Windows PC",
      browser: "Chrome / Modern Browser",
      ipAddress: req.ip || "127.0.0.1"
    });

    res.json({ success: true, message: "Profile updated successfully", data: profile });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getSettings(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || "cust_1";
    let prefs = await UserPreferences.findOne({ userId });
    if (!prefs) {
      prefs = await UserPreferences.create({ userId });
    }
    res.json({ success: true, data: prefs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateSettings(req: Request, res: Response) {
  try {
    const { userId = "cust_1", ...updateData } = req.body;
    let prefs = await UserPreferences.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    await ActivityLog.create({
      userId,
      action: "Settings Update",
      details: "Updated notification or privacy preferences",
      ipAddress: req.ip || "127.0.0.1"
    });

    res.json({ success: true, message: "Settings updated successfully", data: prefs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getActivityLogs(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || "cust_1";
    let logs = await ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(20);
    if (logs.length === 0) {
      // Seed initial mock logs
      await ActivityLog.create([
        { userId, action: "Secure Login", details: "Logged in via Clerk Authentication", device: "Macintosh", browser: "Chrome", ipAddress: "192.168.1.12" },
        { userId, action: "Password Change", details: "Account password successfully updated", device: "Windows", browser: "Firefox", ipAddress: "192.168.1.12" },
        { userId, action: "Profile Update", details: "Updated phone number and city", device: "Macintosh", browser: "Chrome", ipAddress: "192.168.1.12" }
      ]);
      logs = await ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(20);
    }
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteAccount(req: Request, res: Response) {
  try {
    const { userId = "cust_1", reason } = req.body;
    // Soft delete / archive profile
    await UserProfile.findOneAndUpdate({ userId }, { $set: { bio: "[DELETED ACCOUNT]", isVerified: false } });
    await ActivityLog.create({
      userId,
      action: "Account Deletion",
      details: `Account soft deleted. Reason: ${reason || "User requested"}`,
      ipAddress: req.ip || "127.0.0.1"
    });
    res.json({ success: true, message: "Account successfully deactivated and deleted." });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function manageAddresses(req: Request, res: Response) {
  try {
    const { userId = "cust_1", action, addressId, addressData } = req.body;
    if (action === "add") {
      if (addressData.isDefault) {
        await SavedAddress.updateMany({ userId }, { $set: { isDefault: false } });
      }
      const newAddr = await SavedAddress.create({ userId, ...addressData });
      return res.json({ success: true, message: "Address added", data: newAddr });
    }
    if (action === "delete") {
      await SavedAddress.findByIdAndDelete(addressId);
      return res.json({ success: true, message: "Address deleted" });
    }
    if (action === "setDefault") {
      await SavedAddress.updateMany({ userId }, { $set: { isDefault: false } });
      await SavedAddress.findByIdAndUpdate(addressId, { $set: { isDefault: true } });
      return res.json({ success: true, message: "Default address updated" });
    }
    const addresses = await SavedAddress.find({ userId });
    res.json({ success: true, data: addresses });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
