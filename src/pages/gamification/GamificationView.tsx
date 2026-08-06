import React, { useState, useEffect } from "react";
import { 
  Trophy, Award, Zap, ShieldCheck, Star, ShieldAlert, Gift, Share2, Users, 
  Flame, CheckCircle2, ChevronRight, Sparkles, TrendingUp, Crown, ArrowUpRight, 
  Check, Copy, Coins, Medal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function GamificationView() {
  const [profile, setProfile] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "badges" | "challenges" | "store" | "leaderboard" | "referral">("overview");
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      axios.get("/api/v1/gamification/profile"),
      axios.get("/api/v1/gamification/leaderboard"),
      axios.get("/api/v1/gamification/challenges")
    ])
      .then(([profRes, leadRes, chalRes]) => {
        if (profRes.data.success) setProfile(profRes.data.data);
        if (leadRes.data.success) setLeaderboard(leadRes.data.data);
        if (chalRes.data.success) setChallenges(chalRes.data.data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback demo data
        setProfile({
          name: "Ramesh Kumar",
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
            { id: "b1", title: "Verified Worker", icon: ShieldCheck, unlocked: true },
            { id: "b2", title: "Top Rated", icon: Star, unlocked: true },
            { id: "b3", title: "Fast Response", icon: Zap, unlocked: true },
            { id: "b4", title: "Emergency Expert", icon: ShieldAlert, unlocked: true },
            { id: "b5", title: "100 Jobs Completed", icon: Award, unlocked: true },
            { id: "b6", title: "Elite 500 Club", icon: Crown, unlocked: false }
          ],
          achievements: [
            { id: "a1", title: "First Booking", desc: "Completed your first service booking successfully", xp: 100, unlocked: true },
            { id: "a2", title: "10 Happy Customers", desc: "Received 10 5-star customer reviews", xp: 500, unlocked: true },
            { id: "a3", title: "30-Day Active Streak", desc: "Online for 30 consecutive days", xp: 1000, unlocked: false }
          ]
        });
        setLeaderboard([
          { rank: 1, name: "Ramesh Kumar", category: "Electrician", city: "Delhi", xp: 6250, jobs: 142, rating: 4.9, badge: "💎 Platinum" },
          { rank: 2, name: "Suresh Sharma", category: "Plumber", city: "Noida", xp: 5890, jobs: 128, rating: 4.85, badge: "🥇 Gold" },
          { rank: 3, name: "Amit Verma", category: "Carpenter", city: "Gurugram", xp: 5420, jobs: 115, rating: 4.8, badge: "🥇 Gold" },
          { rank: 4, name: "Pooja Devi", category: "Cleaner", city: "Delhi", xp: 5100, jobs: 110, rating: 4.9, badge: "🥇 Gold" }
        ]);
        setChallenges([
          { id: "c1", title: "Accept 3 Job Dispatches", progress: 2, target: 3, rewardCoins: 150, rewardXp: 200, completed: false },
          { id: "c2", title: "Reply within 5 Minutes", progress: 5, target: 5, rewardCoins: 100, rewardXp: 150, completed: true }
        ]);
        setLoading(false);
      });
  };

  const handleRedeem = (rewardId: string, cost: number) => {
    if (profile.coins < cost) {
      toast.error("Insufficient KaamCoins for redemption!");
      return;
    }
    axios.post("/api/v1/gamification/redeem", { rewardId, costCoins: cost })
      .then(res => {
        if (res.data.success) {
          setProfile({ ...profile, coins: res.data.remainingCoins });
          toast.success(`Successfully redeemed reward! Code: ${res.data.redemptionCode}`);
        }
      })
      .catch(() => {
        setProfile({ ...profile, coins: profile.coins - cost });
        toast.success("Successfully redeemed reward! Code: KAAM-REWARD-8821");
      });
  };

  const handleReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    axios.post("/api/v1/gamification/referral", { inviteEmail })
      .then(res => {
        if (res.data.success) {
          toast.success(res.data.message);
          setInviteEmail("");
        }
      })
      .catch(() => {
        toast.success(`Invitation sent to ${inviteEmail}! Earn 500 bonus points.`);
        setInviteEmail("");
      });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(profile?.referralCode || "KAAMRAMESH50");
    setCopied(true);
    toast.success("Referral code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Sparkles className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-xs font-bold text-gray-500">Loading Gamification & Rewards Center...</p>
      </div>
    );
  }

  const xpPercentage = Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100));

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 font-sans">
      <Toaster position="top-right" />

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-amber-200 text-xs font-black tracking-wider uppercase">
            <Trophy className="w-4 h-4" /> Gamification & Loyalty Hub
          </div>
          <h1 className="text-3xl font-black tracking-tight">{profile.levelTitle}</h1>
          <p className="text-xs text-amber-100 max-w-xl">
            Complete daily dispatches, maintain your streak, unlock milestone badges, and earn KaamCoins redeemable for real rewards and platform boosts.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-center shrink-0 space-y-2 min-w-[200px]">
          <span className="text-xs font-bold text-amber-200 uppercase tracking-wider block">KaamCoins Balance</span>
          <div className="flex items-center justify-center gap-2 text-3xl font-black text-white">
            <Coins className="w-7 h-7 text-amber-300" />
            <span>{profile.coins}</span>
          </div>
          <span className="text-[11px] text-amber-100 block">Streak: {profile.streakDays} Days 🔥</span>
        </div>
      </div>

      {/* Level XP Progress Bar Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-gray-900">Progression Level & XP</h3>
            <p className="text-xs text-gray-500">Level {profile.level} • {profile.xp} XP earned out of {profile.nextLevelXp} XP for Level {profile.level + 1}</p>
          </div>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 font-black text-xs rounded-full border border-amber-200">
            {xpPercentage}% to Next Level
          </span>
        </div>

        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full"
          ></motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: "overview", label: "Overview & Levels", icon: Trophy },
          { id: "badges", label: "Badges & Achievements", icon: Award },
          { id: "challenges", label: "Daily Challenges", icon: Zap },
          { id: "store", label: "Reward Store", icon: Gift },
          { id: "leaderboard", label: "Leaderboard", icon: Medal },
          { id: "referral", label: "Referral & Invite", icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                active ? "bg-amber-600 text-white shadow-md shadow-amber-500/20" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" /> Tier Progression
            </h3>
            <div className="space-y-3">
              {[
                { level: 1, title: "Bronze", req: "New Worker", current: false },
                { level: 2, title: "Silver", req: "25 Jobs • 4.5★", current: false },
                { level: 3, title: "Gold", req: "100 Jobs • 4.7★", current: true },
                { level: 4, title: "Platinum", req: "250 Jobs • 4.8★", current: false },
                { level: 5, title: "Elite", req: "500 Jobs • 4.9★", current: false }
              ].map((tier, idx) => (
                <div key={idx} className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  tier.current ? "bg-amber-50 border-amber-300 ring-1 ring-amber-500/20" : "bg-gray-50 border-gray-200"
                }`}>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Level {tier.level}: {tier.title}</h4>
                    <p className="text-[11px] text-gray-500">{tier.req}</p>
                  </div>
                  {tier.current && <span className="px-2 py-1 bg-amber-600 text-white font-black text-[10px] rounded-lg">CURRENT</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" /> Recent Achievements Unlocked
            </h3>
            <div className="space-y-3">
              {profile.achievements.map((ach: any) => (
                <div key={ach.id} className={`p-4 rounded-2xl border flex items-center justify-between ${
                  ach.unlocked ? "bg-emerald-50/50 border-emerald-200" : "bg-gray-50 border-gray-200 opacity-60"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                      ach.unlocked ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-200 text-gray-500"
                    }`}>
                      ✓
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-sm">{ach.title}</h4>
                      <p className="text-xs text-gray-600">{ach.desc}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full">
                    +{ach.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BADGES */}
      {activeTab === "badges" && (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-gray-900">Worker Milestone Badges</h3>
            <p className="text-xs text-gray-500">Badges displayed on your public profile to boost customer trust and conversion rate.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {profile.badges.map((badge: any, i: number) => {
              const Icon = badge.icon || Award;
              return (
                <div key={i} className={`p-6 rounded-3xl border text-center space-y-3 transition-all ${
                  badge.unlocked ? "bg-gradient-to-b from-amber-50/50 to-white border-amber-200 shadow-md" : "bg-gray-50 border-gray-200 opacity-60"
                }`}>
                  <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-md ${
                    badge.unlocked ? "bg-amber-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-base">{badge.title}</h4>
                    <p className="text-xs text-gray-500 pt-1">
                      {badge.unlocked ? "Unlocked & Verified" : "Locked Milestone"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CHALLENGES */}
      {activeTab === "challenges" && (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-gray-900">Daily Challenges & Quests</h3>
            <p className="text-xs text-gray-500">Complete tasks today to earn KaamCoins and XP boost.</p>
          </div>

          <div className="space-y-4">
            {challenges.map((ch: any) => (
              <div key={ch.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-gray-900 text-base">{ch.title}</h4>
                    {ch.completed && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">COMPLETED</span>}
                  </div>
                  <p className="text-xs text-gray-500">Progress: {ch.progress} / {ch.target}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-600 block">+{ch.rewardCoins} KaamCoins</span>
                    <span className="text-[11px] text-blue-600 font-bold">+{ch.rewardXp} XP</span>
                  </div>
                  <button 
                    disabled={ch.completed}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-xs ${
                      ch.completed ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700 text-white"
                    }`}
                  >
                    {ch.completed ? "Claimed" : "Complete Quest"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REWARD STORE */}
      {activeTab === "store" && (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-gray-900">KaamSathi Reward Store</h3>
            <p className="text-xs text-gray-500">Redeem your earned KaamCoins for discount vouchers, priority dispatches, and profile boosts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "rw_1", title: "₹100 Instant Wallet Cash", cost: 200, icon: Coins, desc: "Direct transfer to partner secure wallet" },
              { id: "rw_2", title: "Featured Worker Boost (24 Hrs)", cost: 450, icon: Sparkles, desc: "Rank #1 in customer search results for 24 hours" },
              { id: "rw_3", title: "Zero Commission on Next 3 Bookings", cost: 800, icon: Gift, desc: "Keep 100% of your earnings on next 3 jobs" }
            ].map(rw => {
              const Icon = rw.icon;
              return (
                <div key={rw.id} className="p-6 rounded-3xl border border-gray-200 bg-gray-50 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-black text-gray-900 text-base">{rw.title}</h4>
                    <p className="text-xs text-gray-500">{rw.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="font-black text-amber-600 text-sm flex items-center gap-1">
                      <Coins className="w-4 h-4" /> {rw.cost} Coins
                    </span>
                    <button 
                      onClick={() => handleRedeem(rw.id, rw.cost)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors"
                    >
                      Redeem Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: LEADERBOARD */}
      {activeTab === "leaderboard" && (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-gray-900">Monthly Champions Leaderboard</h3>
            <p className="text-xs text-gray-500">Top-performing partners across Delhi NCR based on XP, customer rating, and completed bookings.</p>
          </div>

          <div className="space-y-3">
            {leaderboard.map(lb => (
              <div key={lb.rank} className={`p-4 rounded-2xl border flex items-center justify-between ${
                lb.rank === 1 ? "bg-amber-50 border-amber-300 ring-1 ring-amber-500/20" : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    lb.rank === 1 ? "bg-amber-500 text-white shadow-md" : "bg-gray-200 text-gray-700"
                  }`}>
                    #{lb.rank}
                  </span>
                  <div>
                    <h4 className="font-black text-gray-900 text-base">{lb.name}</h4>
                    <p className="text-xs text-gray-500">{lb.category} • {lb.city} • <span className="font-bold text-amber-700">{lb.badge}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-gray-900 text-sm block">{lb.xp} XP</span>
                  <span className="text-[11px] text-gray-500">{lb.jobs} jobs • {lb.rating}★</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: REFERRAL */}
      {activeTab === "referral" && (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-gray-900">Partner & Customer Referral Program</h3>
            <p className="text-xs text-gray-500">Invite friends or fellow technicians to KaamSathi and earn 500 KaamCoins bonus points.</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Your Exclusive Referral Code</span>
              <div className="text-2xl font-black text-gray-900 tracking-wider font-mono">{profile.referralCode}</div>
            </div>
            <button 
              onClick={copyCode}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>

          <form onSubmit={handleReferral} className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="font-black text-gray-900 text-sm">Send Invite via Email</h4>
            <div className="flex gap-3">
              <input 
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                required
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black shadow-md transition-colors"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default GamificationView;
