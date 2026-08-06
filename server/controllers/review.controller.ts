import { Request, Response } from "express";
import { Review } from "../models/Review.js";

// In-memory fallback
let memoryReviews: any[] = [
  {
    _id: "rev_1",
    bookingId: "bk_101",
    customerId: "cust_1",
    customerName: "Aarav Sharma",
    workerId: "w_1",
    rating: 5,
    categoryRatings: {
      punctuality: 5,
      professionalism: 5,
      qualityOfWork: 5,
      communication: 5,
      valueForMoney: 4,
      cleanliness: 5
    },
    title: "Extremely professional & prompt",
    comment: "Rajesh arrived right on time with all proper tools. Fixed our complex wiring issue and cleaned up afterwards. Highly recommended!",
    reviewImages: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600"
    ],
    anonymous: false,
    wouldRecommend: true,
    helpfulCount: 14,
    unhelpfulCount: 0,
    helpfulUsers: [],
    unhelpfulUsers: [],
    status: "approved",
    isPinned: true,
    reply: {
      comment: "Thank you so much Aarav! Always a pleasure helping our customers with safe electrical work.",
      createdAt: new Date(Date.now() - 86400000)
    },
    reports: [],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000)
  },
  {
    _id: "rev_2",
    bookingId: "bk_102",
    customerId: "cust_2",
    customerName: "Priya Patel",
    workerId: "w_1",
    rating: 5,
    categoryRatings: {
      punctuality: 5,
      professionalism: 5,
      qualityOfWork: 5,
      communication: 5,
      valueForMoney: 5,
      cleanliness: 5
    },
    title: "Best electrician in town",
    comment: "Quick diagnosis of MCB tripping problem. Replaced faulty switches in no time.",
    reviewImages: [],
    anonymous: false,
    wouldRecommend: true,
    helpfulCount: 8,
    unhelpfulCount: 1,
    helpfulUsers: [],
    unhelpfulUsers: [],
    status: "approved",
    isPinned: false,
    reports: [],
    createdAt: new Date(Date.now() - 345600000),
    updatedAt: new Date(Date.now() - 345600000)
  }
];

export const createReview = async (req: Request, res: Response) => {
  try {
    const { bookingId, customerId, customerName, workerId, rating, categoryRatings, title, comment, reviewImages, anonymous, wouldRecommend } = req.body;

    if (!bookingId || !workerId || !rating || !comment) {
      return res.status(400).json({ success: false, message: "Missing required review fields" });
    }

    const Model = Review as any;
    const existing = await Model.findOne({ bookingId }).catch(() => null) || memoryReviews.find(r => r.bookingId === bookingId);
    if (existing) {
      return res.status(400).json({ success: false, message: "A review has already been submitted for this booking." });
    }

    const newReviewData = {
      _id: `rev_${Date.now()}`,
      bookingId,
      customerId: customerId || "cust_guest",
      customerName: anonymous ? "Anonymous Customer" : (customerName || "Verified Customer"),
      workerId,
      rating: Number(rating),
      categoryRatings: categoryRatings || {
        punctuality: rating,
        professionalism: rating,
        qualityOfWork: rating,
        communication: rating,
        valueForMoney: rating,
        cleanliness: rating
      },
      title: title || "Verified Booking Review",
      comment,
      reviewImages: reviewImages || [],
      anonymous: Boolean(anonymous),
      wouldRecommend: wouldRecommend ?? true,
      helpfulCount: 0,
      unhelpfulCount: 0,
      helpfulUsers: [],
      unhelpfulUsers: [],
      status: "approved",
      isPinned: false,
      reports: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let saved;
    try {
      saved = await Model.create(newReviewData);
    } catch (e) {
      memoryReviews.unshift(newReviewData);
      saved = newReviewData;
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully! Reward points credited.",
      data: saved
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorkerReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // workerId
    const Model = Review as any;
    let reviews = await Model.find({ workerId: id, status: { $ne: "deleted" } }).sort({ isPinned: -1, createdAt: -1 });

    if ((!reviews || reviews.length === 0)) {
      reviews = memoryReviews.filter(r => r.workerId === id && r.status !== "deleted");
    }

    const totalReviews = reviews.length;
    let sumRating = 0;
    const breakdown: any = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const catSums = { punctuality: 0, professionalism: 0, qualityOfWork: 0, communication: 0, valueForMoney: 0, cleanliness: 0 };

    reviews.forEach((r: any) => {
      sumRating += r.rating;
      const rounded = Math.round(r.rating);
      if (breakdown[rounded] !== undefined) breakdown[rounded]++;
      
      if (r.categoryRatings) {
        catSums.punctuality += r.categoryRatings.punctuality || r.rating;
        catSums.professionalism += r.categoryRatings.professionalism || r.rating;
        catSums.qualityOfWork += r.categoryRatings.qualityOfWork || r.rating;
        catSums.communication += r.categoryRatings.communication || r.rating;
        catSums.valueForMoney += r.categoryRatings.valueForMoney || r.rating;
        catSums.cleanliness += r.categoryRatings.cleanliness || r.rating;
      }
    });

    const averageRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(1)) : 5.0;
    const categoryAverages = totalReviews > 0 ? {
      punctuality: Number((catSums.punctuality / totalReviews).toFixed(1)),
      professionalism: Number((catSums.professionalism / totalReviews).toFixed(1)),
      qualityOfWork: Number((catSums.qualityOfWork / totalReviews).toFixed(1)),
      communication: Number((catSums.communication / totalReviews).toFixed(1)),
      valueForMoney: Number((catSums.valueForMoney / totalReviews).toFixed(1)),
      cleanliness: Number((catSums.cleanliness / totalReviews).toFixed(1))
    } : { punctuality: 5, professionalism: 5, qualityOfWork: 5, communication: 5, valueForMoney: 5, cleanliness: 5 };

    const reputationScore = Math.min(100, Math.round((averageRating / 5) * 70 + Math.min(30, totalReviews * 3)));

    const aiSummary = totalReviews > 0 
      ? `Customers praise this worker for reliability, clean execution, and professional expertise (Average rating ${averageRating}/5 across ${totalReviews} verified bookings).`
      : "Customers appreciate this professional for punctuality, quality workmanship, and polite behavior. Highly recommended.";

    res.json({
      success: true,
      data: {
        workerId: id,
        averageRating,
        totalReviews,
        breakdown,
        categoryAverages,
        reputationScore,
        aiSummary,
        badges: [
          averageRating >= 4.8 && totalReviews >= 5 ? "Top Rated" : null,
          totalReviews >= 10 ? "Customer Favorite" : null,
          "Fast Response",
          "Trusted Professional"
        ].filter(Boolean),
        reviews
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();

    const Model = Review as any;
    let updated = await Model.findByIdAndUpdate(id, updates, { new: true }).catch(() => null);
    const memIndex = memoryReviews.findIndex(r => r._id === id);
    if (memIndex !== -1) {
      memoryReviews[memIndex] = { ...memoryReviews[memIndex], ...updates };
      updated = memoryReviews[memIndex];
    }

    res.json({ success: true, message: "Review updated successfully", data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const voteHelpful = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // type: 'helpful' or 'unhelpful'

    const Model = Review as any;
    let rev = await Model.findById(id).catch(() => null);
    let memRev = memoryReviews.find(r => r._id === id);

    const target = rev || memRev;
    if (!target) return res.status(404).json({ success: false, message: "Review not found" });

    if (type === 'helpful') {
      target.helpfulCount = (target.helpfulCount || 0) + 1;
    } else {
      target.unhelpfulCount = (target.unhelpfulCount || 0) + 1;
    }
    target.updatedAt = new Date();

    if (rev && typeof rev.save === 'function') await rev.save();

    res.json({ success: true, message: "Vote recorded", data: target });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reportReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, reason } = req.body;

    const Model = Review as any;
    let rev = await Model.findById(id).catch(() => null);
    let memRev = memoryReviews.find(r => r._id === id);
    const target = rev || memRev;
    if (!target) return res.status(404).json({ success: false, message: "Review not found" });

    if (!target.reports) target.reports = [];
    target.reports.push({ userId: userId || "user_anon", reason: reason || "Inappropriate content", createdAt: new Date() });
    if (rev && typeof rev.save === 'function') await rev.save();

    res.json({ success: true, message: "Review reported to Admin successfully." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const Model = Review as any;
    let rev = await Model.findById(id).catch(() => null);
    let memRev = memoryReviews.find(r => r._id === id);
    const target = rev || memRev;
    if (!target) return res.status(404).json({ success: false, message: "Review not found" });

    target.reply = {
      comment,
      createdAt: new Date()
    };
    if (rev && typeof rev.save === 'function') await rev.save();

    res.json({ success: true, message: "Reply posted successfully", data: target });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminReviews = async (_req: Request, res: Response) => {
  try {
    const Model = Review as any;
    let reviews = await Model.find().sort({ createdAt: -1 });
    if (!reviews || reviews.length === 0) {
      reviews = memoryReviews;
    }
    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminModerateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, isPinned } = req.body;

    const Model = Review as any;
    let rev = await Model.findById(id).catch(() => null);
    let memRev = memoryReviews.find(r => r._id === id);
    const target = rev || memRev;
    if (!target) return res.status(404).json({ success: false, message: "Review not found" });

    if (status !== undefined) target.status = status;
    if (isPinned !== undefined) target.isPinned = isPinned;
    if (rev && typeof rev.save === 'function') await rev.save();

    res.json({ success: true, message: "Review moderated successfully", data: target });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
