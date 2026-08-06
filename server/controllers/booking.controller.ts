import { Request, Response } from "express";

// In-memory persistent mock store for dev preview & fallback when MongoDB isn't populated
const bookingsStore: any[] = [
  {
    id: "b_1001",
    bookingNumber: "KS-BK-8901",
    customerId: "cust_1",
    customerName: "Rahul Verma",
    customerPhone: "+91 98765 11223",
    customerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    customerAddress: "Flat 402, Block B, Greenwoods Apartments, South Extension, New Delhi - 110049",
    customerCity: "New Delhi",
    workerId: "w1",
    workerName: "Ramesh Kumar",
    workerPhone: "+91 98765 43210",
    workerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    workerCategory: "Electrician",
    workerRating: 4.8,
    serviceName: "AC Servicing & Master Wiring Check",
    serviceCategory: "Electrician",
    description: "Main MCB tripping frequently when AC and Geyser are turned on together. Need urgent check.",
    bookingDate: "2026-08-06",
    bookingTime: "10:30 AM",
    status: "Worker On The Way", // Pending | Accepted | Worker On The Way | Arrived | Work Started | Completed | Cancelled
    estimatedCost: 850,
    hourlyRate: 250,
    platformFee: 50,
    taxAmount: 45,
    totalAmount: 945,
    paymentStatus: "Payment Pending", // Payment Pending | Paid
    paymentMethod: "UPI / Cash on Delivery",
    createdAt: "2026-08-05T09:30:00.000Z",
    workPhotos: [],
    workerLocation: { lat: 28.5672, lng: 77.2215, address: "Passing Ring Road Flyover" },
    customerLocation: { lat: 28.5701, lng: 77.2280 },
    timeline: [
      { status: "Pending", time: "Aug 5, 09:30 AM", note: "Booking requested by customer" },
      { status: "Accepted", time: "Aug 5, 09:35 AM", note: "Job accepted by Ramesh Kumar" },
      { status: "Worker On The Way", time: "Aug 5, 10:00 AM", note: "Worker dispatched. Live tracking active" }
    ]
  },
  {
    id: "b_1002",
    bookingNumber: "KS-BK-8902",
    customerId: "cust_1",
    customerName: "Rahul Verma",
    customerPhone: "+91 98765 11223",
    customerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    customerAddress: "Flat 402, Block B, Greenwoods Apartments, South Extension, New Delhi",
    customerCity: "New Delhi",
    workerId: "w2",
    workerName: "Suresh Sharma",
    workerPhone: "+91 98765 43211",
    workerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    workerCategory: "Plumber",
    workerRating: 4.9,
    serviceName: "Bathroom Pipe Leakage & Tap Fitting",
    serviceCategory: "Plumber",
    description: "Water leaking under bathroom washbasin cabinet.",
    bookingDate: "2026-08-04",
    bookingTime: "02:00 PM",
    status: "Completed",
    estimatedCost: 500,
    hourlyRate: 300,
    platformFee: 40,
    taxAmount: 30,
    totalAmount: 570,
    paymentStatus: "Payment Completed",
    paymentMethod: "UPI Online",
    createdAt: "2026-08-04T12:00:00.000Z",
    workPhotos: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400"],
    timeline: [
      { status: "Pending", time: "Aug 4, 12:00 PM", note: "Booking created" },
      { status: "Accepted", time: "Aug 4, 12:05 PM", note: "Accepted by Suresh" },
      { status: "Work Started", time: "Aug 4, 02:00 PM", note: "Plumbing work initiated" },
      { status: "Completed", time: "Aug 4, 03:15 PM", note: "Work completed & tested for leaks" }
    ],
    review: {
      rating: 5,
      comment: "Prompt arrival and fixed the leakage cleanly. Very polite!",
      createdAt: "Aug 4, 03:30 PM"
    }
  },
  {
    id: "b_1003",
    bookingNumber: "KS-BK-8903",
    customerId: "cust_2",
    customerName: "Priya Singh",
    customerPhone: "+91 98765 99887",
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    customerAddress: "H-12, Lajpat Nagar III, New Delhi",
    customerCity: "New Delhi",
    workerId: "w1",
    workerName: "Ramesh Kumar",
    workerPhone: "+91 98765 43210",
    workerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    workerCategory: "Electrician",
    workerRating: 4.8,
    serviceName: "Switchboard & Ceiling Fan Installation",
    serviceCategory: "Electrician",
    description: "Need 2 ceiling fans assembled and mounted in bedrooms.",
    bookingDate: "2026-08-06",
    bookingTime: "04:30 PM",
    status: "Pending",
    estimatedCost: 450,
    hourlyRate: 250,
    platformFee: 30,
    taxAmount: 25,
    totalAmount: 505,
    paymentStatus: "Payment Pending",
    paymentMethod: "Cash on Delivery",
    createdAt: "2026-08-05T10:15:00.000Z",
    timeline: [
      { status: "Pending", time: "Aug 5, 10:15 AM", note: "Booking request pending worker acceptance" }
    ]
  }
];

const messagesStore: Record<string, any[]> = {
  "b_1001": [
    { id: "m1", sender: "customer", senderName: "Rahul Verma", text: "Hello Ramesh ji, please bring an extra MCB switch if possible.", time: "10:02 AM" },
    { id: "m2", sender: "worker", senderName: "Ramesh Kumar", text: "Ji Rahul sir, I have standard 16A & 32A Havells MCBs in my tool kit.", time: "10:04 AM" },
    { id: "m3", sender: "worker", senderName: "Ramesh Kumar", text: "I have crossed South Extension flyover. Reaching in 5 mins.", time: "10:12 AM" }
  ]
};

// GET /api/v1/bookings
export async function getBookings(req: Request, res: Response) {
  try {
    const { role, status, workerId, customerId } = req.query;
    let filtered = [...bookingsStore];

    if (status && status !== "all") {
      filtered = filtered.filter(b => b.status.toLowerCase() === String(status).toLowerCase());
    }
    if (workerId) {
      filtered = filtered.filter(b => b.workerId === String(workerId));
    }

    res.json({ success: true, data: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// GET /api/v1/bookings/:id
export async function getBookingById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const booking = bookingsStore.find(b => b.id === id || b.bookingNumber === id) || bookingsStore[0];
    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// POST /api/v1/bookings
export async function createBooking(req: Request, res: Response) {
  try {
    const { workerId, workerName, workerCategory, serviceName, description, bookingDate, bookingTime, customerName, customerPhone, customerAddress, estimatedCost } = req.body;
    
    const cost = estimatedCost || 500;
    const platformFee = 40;
    const taxAmount = Math.round(cost * 0.05);

    const newBooking = {
      id: `b_${Date.now()}`,
      bookingNumber: `KS-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: "cust_current",
      customerName: customerName || "Rahul Verma",
      customerPhone: customerPhone || "+91 98765 11223",
      customerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      customerAddress: customerAddress || "South Extension, New Delhi",
      customerCity: "New Delhi",
      workerId: workerId || "w1",
      workerName: workerName || "Ramesh Kumar",
      workerPhone: "+91 98765 43210",
      workerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      workerCategory: workerCategory || "Electrician",
      workerRating: 4.8,
      serviceName: serviceName || "General Service",
      serviceCategory: workerCategory || "General",
      description: description || "Service booking request",
      bookingDate: bookingDate || new Date().toISOString().split('T')[0],
      bookingTime: bookingTime || "10:00 AM",
      status: "Pending",
      estimatedCost: cost,
      hourlyRate: cost,
      platformFee,
      taxAmount,
      totalAmount: cost + platformFee + taxAmount,
      paymentStatus: "Payment Pending",
      paymentMethod: "UPI / Cash on Delivery",
      createdAt: new Date().toISOString(),
      timeline: [
        { status: "Pending", time: "Just now", note: "Booking requested by customer" }
      ]
    };

    bookingsStore.unshift(newBooking);
    res.json({ success: true, message: "Booking confirmed successfully!", data: newBooking });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// PUT /api/v1/bookings/:id/status
export async function updateBookingStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const booking = bookingsStore.find(b => b.id === id || b.bookingNumber === id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.status = status;
    booking.timeline.push({
      status,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: note || `Status updated to ${status}`
    });

    if (status === "Completed") {
      booking.paymentStatus = "Payment Completed";
    }

    res.json({ success: true, message: `Booking status updated to ${status}`, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// PUT /api/v1/bookings/:id/cancel
export async function cancelBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = bookingsStore.find(b => b.id === id || b.bookingNumber === id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.status = "Cancelled";
    booking.cancelReason = reason || "Cancelled by user";
    booking.timeline.push({
      status: "Cancelled",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: `Booking cancelled: ${reason || "No reason specified"}`
    });

    res.json({ success: true, message: "Booking cancelled successfully", data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// POST /api/v1/bookings/:id/review
export async function addBookingReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const booking = bookingsStore.find(b => b.id === id || b.bookingNumber === id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.review = {
      rating: rating || 5,
      comment: comment || "",
      createdAt: new Date().toLocaleDateString()
    };

    res.json({ success: true, message: "Review submitted successfully!", data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// GET /api/v1/bookings/:id/messages
export async function getBookingMessages(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const msgs = messagesStore[id] || [
      { id: "m1", sender: "worker", senderName: "KaamSathi Worker", text: "Hello! I am assigned to your booking.", time: "Just now" }
    ];
    res.json({ success: true, data: msgs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// POST /api/v1/bookings/:id/chat
export async function sendBookingMessage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { sender, senderName, text } = req.body;

    if (!messagesStore[id]) {
      messagesStore[id] = [];
    }

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: sender || "customer",
      senderName: senderName || "User",
      text: text || "",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    messagesStore[id].push(newMsg);
    res.json({ success: true, data: newMsg });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
