import { Request, Response } from "express";
import Payment from "../models/Payment.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Withdrawal from "../models/Withdrawal.js";
import Coupon from "../models/Coupon.js";
import Referral from "../models/Referral.js";
import Invoice from "../models/Invoice.js";
import Commission from "../models/Commission.js";
import { Booking } from "../models/Booking.js";
import Notification from "../models/NotificationModel.js";

// Helper to get or create commission rate
async function getPlatformCommissionRate(): Promise<number> {
  try {
    const config = await (Commission as any).findOne().sort({ updatedAt: -1 });
    return config ? config.platformRatePercentage : 10;
  } catch {
    return 10;
  }
}

// POST /api/v1/payments/create
export async function createPaymentOrder(req: Request, res: Response) {
  try {
    const { bookingId, customerId, amount, paymentMethod } = req.body;
    const orderId = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    res.json({
      success: true,
      data: {
        orderId,
        bookingId,
        amount,
        currency: "INR",
        gatewayKey: "mock_gateway_key_kaamsathi",
        paymentMethod: paymentMethod || "UPI"
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/v1/payments/mock (Simulator for Razorpay/Stripe/UPI/Card)
export async function processMockPayment(req: Request, res: Response) {
  try {
    const { bookingId, customerId, customerName, workerId, workerName, amount, paymentMethod, status, couponCode } = req.body;

    const finalStatus = status || "success";
    if (finalStatus === "failed") {
      return res.status(400).json({
        success: false,
        message: "Payment declined by bank or user cancelled.",
        transactionId: `TXN_FAIL_${Date.now()}`
      });
    }

    const transactionId = `TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const commissionRate = await getPlatformCommissionRate();
    const commission = Math.round((amount * commissionRate) / 100);
    const workerEarnings = amount - commission;

    // Create Payment Record
    const payment = await (Payment as any).create({
      transactionId,
      bookingId: bookingId || `bkg_${Date.now()}`,
      customerId: customerId || "cust_1",
      customerName: customerName || "Rahul Verma",
      workerId: workerId || "w1",
      workerName: workerName || "Ramesh Kumar",
      amount,
      commission,
      workerEarnings,
      status: "success",
      paymentMethod: paymentMethod || "UPI / Mock Gateway"
    });

    // Update Booking status if bookingId exists
    if (bookingId) {
      await (Booking as any).findByIdAndUpdate(bookingId, {
        paymentStatus: "paid",
        status: "accepted"
      });
    }

    // Update Worker Wallet (Credit worker balance)
    let workerWallet = await (Wallet as any).findOne({ userId: workerId || "w1" });
    if (!workerWallet) {
      workerWallet = await (Wallet as any).create({
        userId: workerId || "w1",
        userRole: "worker",
        balance: workerEarnings,
        withdrawableAmount: workerEarnings,
        pendingBalance: 0
      });
    } else {
      workerWallet.balance += workerEarnings;
      workerWallet.withdrawableAmount += workerEarnings;
      await workerWallet.save();
    }

    // Record Worker Credit Transaction
    await (Transaction as any).create({
      transactionId: `TXN_W_${Date.now()}`,
      walletId: workerWallet._id.toString(),
      userId: workerId || "w1",
      userRole: "worker",
      type: "credit",
      amount: workerEarnings,
      description: `Earnings for booking ${bookingId || 'service'} (after ${commissionRate}% platform fee)`,
      referenceId: bookingId,
      status: "completed",
      paymentMethod
    });

    // Generate Invoice
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const invoice = await (Invoice as any).create({
      invoiceNumber,
      bookingId: bookingId || `bkg_${Date.now()}`,
      customerId: customerId || "cust_1",
      customerName: customerName || "Rahul Verma",
      workerId: workerId || "w1",
      workerName: workerName || "Ramesh Kumar",
      serviceCategory: "Home Services",
      address: "South Delhi, New Delhi",
      subtotal: amount,
      platformFee: 25,
      discount: couponCode ? 50 : 0,
      taxAmount: Math.round(amount * 0.05),
      total: amount,
      paymentStatus: "paid",
      paymentMethod: paymentMethod || "UPI"
    });

    // Send Notification
    await (Notification as any).create({
      title: "Payment Successful",
      message: `₹${amount} paid successfully for booking #${bookingId || 'service'}. Invoice ${invoiceNumber} generated.`,
      targetAudience: "customers",
      status: "sent"
    });

    res.json({
      success: true,
      message: "Payment processed successfully",
      data: {
        payment,
        invoice,
        transactionId
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/v1/payments/history
export async function getPaymentHistory(req: Request, res: Response) {
  try {
    const { userId, role } = req.query;
    let query: any = {};
    if (userId) {
      if (role === "worker") query.workerId = userId;
      else query.customerId = userId;
    }

    let payments = await (Payment as any).find(query).sort({ createdAt: -1 });

    if (payments.length === 0) {
      payments = [
        {
          _id: "p_1",
          transactionId: "TXN_984392",
          bookingId: "bkg_101",
          customerId: "cust_1",
          customerName: "Rahul Verma",
          workerId: "w1",
          workerName: "Ramesh Kumar",
          amount: 450,
          commission: 45,
          workerEarnings: 405,
          status: "success",
          paymentMethod: "UPI / GPay",
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          _id: "p_2",
          transactionId: "TXN_984393",
          bookingId: "bkg_102",
          customerId: "cust_1",
          customerName: "Rahul Verma",
          workerId: "w2",
          workerName: "Suresh Sharma",
          amount: 600,
          commission: 60,
          workerEarnings: 540,
          status: "success",
          paymentMethod: "Credit Card",
          createdAt: new Date(Date.now() - 86400000)
        }
      ];
    }

    res.json({ success: true, data: payments });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/v1/wallet
export async function getWalletDetails(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || "cust_1";
    const userRole = (req.query.role as string) || "customer";

    let wallet = await (Wallet as any).findOne({ userId });

    if (!wallet) {
      wallet = {
        userId,
        userRole,
        balance: userRole === "worker" ? 14250 : 850,
        pendingBalance: userRole === "worker" ? 1200 : 0,
        withdrawableAmount: userRole === "worker" ? 14250 : 850,
        currency: "INR",
        savedPaymentMethods: [
          { id: "pm_1", type: "upi", title: "GPay / UPI ID", subtitle: "rahul@okicici", isDefault: true },
          { id: "pm_2", type: "card", title: "HDFC Visa Credit Card", subtitle: "•••• •••• •••• 4921", isDefault: false }
        ],
        bankAccount: {
          accountHolderName: userRole === "worker" ? "Ramesh Kumar" : "Rahul Verma",
          accountNumber: "918237461928",
          ifscCode: "HDFC0001234",
          bankName: "HDFC Bank",
          verified: true
        },
        upiId: userRole === "worker" ? "ramesh@upi" : "rahul@upi"
      };
    }

    res.json({ success: true, data: wallet });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/v1/wallet/topup (Add money to customer wallet)
export async function topupWallet(req: Request, res: Response) {
  try {
    const { userId, amount, paymentMethod } = req.body;
    let wallet = await (Wallet as any).findOne({ userId: userId || "cust_1" });

    if (!wallet) {
      wallet = await (Wallet as any).create({
        userId: userId || "cust_1",
        userRole: "customer",
        balance: amount,
        withdrawableAmount: amount
      });
    } else {
      wallet.balance += amount;
      wallet.withdrawableAmount += amount;
      await wallet.save();
    }

    const transactionId = `TXN_TOP_${Date.now()}`;
    await (Transaction as any).create({
      transactionId,
      walletId: wallet._id.toString(),
      userId: userId || "cust_1",
      userRole: "customer",
      type: "credit",
      amount,
      description: `Wallet top-up via ${paymentMethod || 'Mock Payment'}`,
      status: "completed",
      paymentMethod: paymentMethod || "UPI"
    });

    res.json({ success: true, message: `Added ₹${amount} to wallet successfully`, data: wallet });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/v1/wallet/withdraw (Worker requests payout)
export async function requestWithdrawal(req: Request, res: Response) {
  try {
    const { workerId, workerName, amount, payoutMethod, accountDetails } = req.body;

    let wallet = await (Wallet as any).findOne({ userId: workerId || "w1" });
    const available = wallet ? wallet.withdrawableAmount : 14250;

    if (amount > available) {
      return res.status(400).json({ success: false, message: "Insufficient withdrawable balance." });
    }

    const withdrawalId = `WTH_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const withdrawal = await (Withdrawal as any).create({
      withdrawalId,
      workerId: workerId || "w1",
      workerName: workerName || "Ramesh Kumar",
      amount,
      payoutMethod: payoutMethod || "bank",
      accountDetails: accountDetails || "HDFC Bank (•••• 1928)",
      status: "pending"
    });

    if (wallet) {
      wallet.withdrawableAmount -= amount;
      wallet.balance -= amount;
      await wallet.save();
    }

    await (Transaction as any).create({
      transactionId: `TXN_WTH_${Date.now()}`,
      userId: workerId || "w1",
      userRole: "worker",
      type: "withdrawal",
      amount,
      description: `Withdrawal request #${withdrawalId} to ${payoutMethod.toUpperCase()}`,
      referenceId: withdrawalId,
      status: "pending"
    });

    res.status(201).json({ success: true, message: "Withdrawal request submitted successfully", data: withdrawal });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/v1/wallet/transactions
export async function getTransactions(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || "cust_1";
    let txns = await (Transaction as any).find({ userId }).sort({ createdAt: -1 });

    if (txns.length === 0) {
      txns = [
        {
          _id: "t1",
          transactionId: "TXN_98231",
          userId,
          userRole: "customer",
          type: "debit",
          amount: 450,
          description: "Payment for Switchboard Repair (#BKG_101)",
          status: "completed",
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          _id: "t2",
          transactionId: "TXN_98230",
          userId,
          userRole: "customer",
          type: "credit",
          amount: 500,
          description: "Wallet Add Money via UPI",
          status: "completed",
          createdAt: new Date(Date.now() - 86400000)
        },
        {
          _id: "t3",
          transactionId: "TXN_98229",
          userId,
          userRole: "customer",
          type: "referral_bonus",
          amount: 100,
          description: "Referral Bonus credited for inviting Manoj S.",
          status: "completed",
          createdAt: new Date(Date.now() - 172800000)
        }
      ];
    }

    res.json({ success: true, data: txns });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/v1/coupons/apply
export async function applyCoupon(req: Request, res: Response) {
  try {
    const { code, bookingAmount } = req.body;
    const coupon = await (Coupon as any).findOne({ code: code?.toUpperCase(), active: true });

    if (!coupon && code?.toUpperCase() !== "WELCOME50" && code?.toUpperCase() !== "KAAM100") {
      return res.status(404).json({ success: false, message: "Invalid or expired coupon code." });
    }

    let discount = 50;
    if (code?.toUpperCase() === "KAAM100") discount = 100;
    if (coupon) {
      if (coupon.minBookingAmount > bookingAmount) {
        return res.status(400).json({ success: false, message: `Minimum booking amount for this coupon is ₹${coupon.minBookingAmount}` });
      }
      if (coupon.type === "percentage") {
        discount = Math.round((bookingAmount * coupon.discountValue) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
      } else {
        discount = coupon.discountValue;
      }
    }

    res.json({
      success: true,
      message: `Coupon '${code.toUpperCase()}' applied successfully! Saved ₹${discount}`,
      data: {
        code: code.toUpperCase(),
        discount,
        finalAmount: Math.max(0, bookingAmount - discount)
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/v1/coupons
export async function getCoupons(req: Request, res: Response) {
  try {
    let coupons = await (Coupon as any).find({ active: true });
    if (coupons.length === 0) {
      coupons = [
        { code: "WELCOME50", type: "flat", discountValue: 50, minBookingAmount: 200, description: "Flat ₹50 OFF on your first booking", active: true },
        { code: "KAAM100", type: "flat", discountValue: 100, minBookingAmount: 500, description: "Flat ₹100 OFF on bookings above ₹500", active: true },
        { code: "FESTIVAL20", type: "percentage", discountValue: 20, minBookingAmount: 300, maxDiscount: 150, description: "20% OFF up to ₹150 for festive maintenance", active: true }
      ];
    }
    res.json({ success: true, data: coupons });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/v1/invoices/:id
export async function getInvoiceDetails(req: Request, res: Response) {
  try {
    const { id } = req.params;
    let invoice = await (Invoice as any).findOne({ $or: [{ _id: id }, { invoiceNumber: id }, { bookingId: id }] });

    if (!invoice) {
      invoice = {
        invoiceNumber: id.startsWith("INV") ? id : `INV-2026-948210`,
        bookingId: id,
        customerId: "cust_1",
        customerName: "Rahul Verma",
        workerId: "w1",
        workerName: "Ramesh Kumar",
        serviceCategory: "Electrician Repair Services",
        date: new Date(),
        address: "Flat 402, Green Park Apartments, South Delhi",
        subtotal: 450,
        platformFee: 25,
        discount: 50,
        taxAmount: 21,
        total: 446,
        paymentStatus: "paid",
        paymentMethod: "GPay / UPI"
      };
    }

    res.json({ success: true, data: invoice });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/v1/admin/finance
export async function getAdminFinance(req: Request, res: Response) {
  try {
    const totalPayments = await (Payment as any).countDocuments() || 3420;
    const commissionRate = await getPlatformCommissionRate();

    res.json({
      success: true,
      data: {
        summary: {
          totalPlatformRevenue: 2845000,
          totalCommissionEarned: 284500,
          totalWorkerPayouts: 2560500,
          pendingWithdrawals: 45000,
          platformCommissionRate: commissionRate,
          refundsProcessed: 12400,
          netProfit: 272100
        },
        revenueBreakdown: [
          { month: "Jan", revenue: 320000, commission: 32000 },
          { month: "Feb", revenue: 410000, commission: 41000 },
          { month: "Mar", revenue: 480000, commission: 48000 },
          { month: "Apr", revenue: 550000, commission: 55000 },
          { month: "May", revenue: 620000, commission: 62000 },
          { month: "Jun", revenue: 685000, commission: 68500 }
        ],
        payoutsList: [
          { id: "WTH_901", workerName: "Ramesh Kumar", amount: 12500, method: "UPI (ramesh@upi)", status: "completed", date: new Date(Date.now() - 3600000) },
          { id: "WTH_902", workerName: "Suresh Sharma", amount: 8400, method: "HDFC Bank (•••• 1928)", status: "pending", date: new Date(Date.now() - 1800000) }
        ]
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/v1/admin/withdrawals
export async function getWithdrawals(req: Request, res: Response) {
  try {
    let withdrawals = await (Withdrawal as any).find().sort({ createdAt: -1 });
    if (withdrawals.length === 0) {
      withdrawals = [
        { _id: "wth_1", withdrawalId: "WTH_101", workerId: "w1", workerName: "Ramesh Kumar", amount: 12500, payoutMethod: "upi", accountDetails: "ramesh@upi", status: "completed", createdAt: new Date(Date.now() - 86400000) },
        { _id: "wth_2", withdrawalId: "WTH_102", workerId: "w2", workerName: "Suresh Sharma", amount: 8400, payoutMethod: "bank", accountDetails: "HDFC Bank (•••• 1928)", status: "pending", createdAt: new Date(Date.now() - 3600000) }
      ];
    }
    res.json({ success: true, data: withdrawals });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// PUT /api/v1/admin/withdrawals/:id
export async function updateWithdrawalStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const withdrawal = await (Withdrawal as any).findByIdAndUpdate(id, {
      status,
      notes,
      processedAt: new Date()
    }, { new: true });

    res.json({ success: true, message: `Withdrawal request marked as ${status}`, data: withdrawal });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// PUT /api/v1/admin/commission
export async function updateCommissionRate(req: Request, res: Response) {
  try {
    const { platformRatePercentage } = req.body;
    const updated = await (Commission as any).create({
      platformRatePercentage: Number(platformRatePercentage),
      updatedBy: "admin@kaamsathi.com"
    });

    res.json({ success: true, message: `Platform commission updated to ${platformRatePercentage}%`, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/v1/referrals
export async function getReferrals(req: Request, res: Response) {
  try {
    const { userId } = req.query;
    let referrals = await (Referral as any).find({ referrerId: userId || "cust_1" });
    if (referrals.length === 0) {
      referrals = [
        { _id: "ref_1", referrerId: "cust_1", referrerName: "Rahul Verma", referrerRole: "customer", refereeName: "Ankit Gupta", referralCode: "RAHUL100", status: "completed", rewardAmount: 100, createdAt: new Date(Date.now() - 86400000) },
        { _id: "ref_2", referrerId: "cust_1", referrerName: "Rahul Verma", referrerRole: "customer", refereeName: "Sneha Kapoor", referralCode: "RAHUL100", status: "pending", rewardAmount: 100, createdAt: new Date(Date.now() - 3600000) }
      ];
    }

    res.json({
      success: true,
      data: {
        referralCode: "RAHUL100",
        totalEarned: 100,
        pendingRewards: 100,
        referrals
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/v1/referrals/invite
export async function sendReferralInvite(req: Request, res: Response) {
  try {
    const { emailOrPhone } = req.body;
    res.json({ success: true, message: `Referral invite with code 'RAHUL100' sent to ${emailOrPhone}` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
