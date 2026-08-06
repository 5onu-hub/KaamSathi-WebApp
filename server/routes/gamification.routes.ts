import { Router } from "express";

const router = Router();

// Gamification Profile & Stats
router.get("/profile", (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        userId: "usr_sk_905",
        name: "Ramesh Kumar",
        role: "worker",
        level: 3,
        levelTitle: "🥇 Gold Worker",
        xp: 4850,
        nextLevelXp: 6000,
        coins: 1250,
        completedJobs: 112,
        rating: 4.85,
        streakDays: 14,
        referralCode: "KAAMRAMESH50",
        badges: [
          { id: "b1", title: "Verified Worker", icon: "ShieldCheck", unlocked: true, date: "2025-01-15" },
          { id: "b2", title: "Top Rated", icon: "Star", unlocked: true, date: "2025-03-10" },
          { id: "b3", title: "Fast Response", icon: "Zap", unlocked: true, date: "2025-04-01" },
          { id: "b4", title: "Emergency Expert", icon: "ShieldAlert", unlocked: true, date: "2025-05-12" },
          { id: "b5", title: "100 Jobs Completed", icon: "Award", unlocked: true, date: "2026-02-20" },
          { id: "b6", title: "Elite 500 Club", icon: "Crown", unlocked: false, date: null }
        ],
        achievements: [
          { id: "a1", title: "First Booking", desc: "Successfully completed your first service booking", xp: 100, unlocked: true },
          { id: "a2", title: "10 Happy Customers", desc: "Received 10 5-star customer reviews", xp: 500, unlocked: true },
          { id: "a3", title: "30-Day Active Streak", desc: "Stayed online and accepted requests for 30 consecutive days", xp: 1000, unlocked: false }
        ]
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Leaderboard
router.get("/leaderboard", (req, res) => {
  try {
    const { category = "all", timeframe = "monthly" } = req.query;
    res.json({
      success: true,
      category,
      timeframe,
      data: [
        { rank: 1, name: "Ramesh Kumar", category: "Electrician", city: "Delhi", xp: 6250, jobs: 142, rating: 4.9, badge: "💎 Platinum" },
        { rank: 2, name: "Suresh Sharma", category: "Plumber", city: "Noida", xp: 5890, jobs: 128, rating: 4.85, badge: "🥇 Gold" },
        { rank: 3, name: "Amit Verma", category: "Carpenter", city: "Gurugram", xp: 5420, jobs: 115, rating: 4.8, badge: "🥇 Gold" },
        { rank: 4, name: "Pooja Devi", category: "House Cleaner", city: "Delhi", xp: 5100, jobs: 110, rating: 4.9, badge: "🥇 Gold" },
        { rank: 5, name: "Vikram Singh", category: "Painter", city: "Ghaziabad", xp: 4750, jobs: 98, rating: 4.75, badge: "🥈 Silver" }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Daily Challenges
router.get("/challenges", (req, res) => {
  try {
    res.json({
      success: true,
      data: [
        { id: "c1", title: "Accept 3 Job Dispatches", progress: 2, target: 3, rewardCoins: 150, rewardXp: 200, completed: false },
        { id: "c2", title: "Reply to Customer within 5 Mins", progress: 5, target: 5, rewardCoins: 100, rewardXp: 150, completed: true },
        { id: "c3", title: "Secure a 5-Star Review Today", progress: 1, target: 1, rewardCoins: 250, rewardXp: 300, completed: true }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Redeem Reward Store item
router.post("/redeem", (req, res) => {
  try {
    const { rewardId, costCoins } = req.body;
    res.json({
      success: true,
      message: "Reward redeemed successfully!",
      remainingCoins: 1250 - (costCoins || 200),
      redemptionCode: "KAAM-REWARD-8821"
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Referral Program
router.post("/referral", (req, res) => {
  try {
    const { inviteEmail } = req.body;
    res.json({
      success: true,
      message: `Invitation sent successfully to ${inviteEmail || "friend"}! Earn 500 bonus points when they complete their first booking.`,
      referralCode: "KAAMRAMESH50"
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
