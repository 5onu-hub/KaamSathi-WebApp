import { Router } from "express";
import {
  createPaymentOrder,
  processMockPayment,
  getPaymentHistory,
  getWalletDetails,
  topupWallet,
  requestWithdrawal,
  getTransactions,
  applyCoupon,
  getCoupons,
  getInvoiceDetails,
  getAdminFinance,
  getWithdrawals,
  updateWithdrawalStatus,
  updateCommissionRate,
  getReferrals,
  sendReferralInvite
} from "../controllers/payment.controller.js";

const router = Router();

// Customer & General Payment / Wallet Endpoints
router.post("/create", createPaymentOrder);
router.post("/mock", processMockPayment);
router.get("/history", getPaymentHistory);
router.get("/wallet", getWalletDetails);
router.post("/wallet/topup", topupWallet);
router.post("/wallet/withdraw", requestWithdrawal);
router.get("/wallet/transactions", getTransactions);

// Coupons & Invoices
router.post("/coupons/apply", applyCoupon);
router.get("/coupons", getCoupons);
router.get("/invoices/:id", getInvoiceDetails);

// Referrals
router.get("/referrals", getReferrals);
router.post("/referrals/invite", sendReferralInvite);

// Admin Finance & Withdrawals
router.get("/admin/finance", getAdminFinance);
router.get("/admin/withdrawals", getWithdrawals);
router.put("/admin/withdrawals/:id", updateWithdrawalStatus);
router.put("/admin/commission", updateCommissionRate);

export default router;
