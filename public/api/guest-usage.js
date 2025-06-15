// This is a mock API endpoint for demonstration
// In production, this should be implemented as a proper backend service

const GUEST_USAGE_KEY = 'guest_usage_tracking';
const DAILY_LIMIT = 2;

// Simple in-memory storage for demo (use Redis/database in production)
let guestUsageData = {};

// Helper function to get client IP (simplified for demo)
function getClientIP(request) {
  // In production, use proper IP detection considering proxies
  return request.headers['x-forwarded-for'] || 
         request.headers['x-real-ip'] || 
         request.connection?.remoteAddress || 
         '127.0.0.1';
}

// Helper function to get today's date string
function getTodayString() {
  return new Date().toDateString();
}

// Helper function to reset daily usage if needed
function resetDailyUsageIfNeeded(ip) {
  const today = getTodayString();
  
  if (!guestUsageData[ip] || guestUsageData[ip].date !== today) {
    guestUsageData[ip] = {
      date: today,
      messagesUsed: 0
    };
  }
}

export default function handler(req, res) {
  const clientIP = getClientIP(req);
  
  if (req.method === 'GET') {
    // Get current usage for IP
    resetDailyUsageIfNeeded(clientIP);
    
    const usage = guestUsageData[clientIP] || { messagesUsed: 0 };
    
    res.status(200).json({
      messagesUsed: usage.messagesUsed,
      messageLimit: DAILY_LIMIT,
      canSendMessage: usage.messagesUsed < DAILY_LIMIT
    });
    
  } else if (req.method === 'POST') {
    // Increment usage for IP
    resetDailyUsageIfNeeded(clientIP);
    
    if (req.body.increment) {
      if (guestUsageData[clientIP].messagesUsed < DAILY_LIMIT) {
        guestUsageData[clientIP].messagesUsed += 1;
        
        res.status(200).json({
          messagesUsed: guestUsageData[clientIP].messagesUsed,
          messageLimit: DAILY_LIMIT,
          canSendMessage: guestUsageData[clientIP].messagesUsed < DAILY_LIMIT
        });
      } else {
        res.status(429).json({
          error: 'Daily limit reached',
          messagesUsed: guestUsageData[clientIP].messagesUsed,
          messageLimit: DAILY_LIMIT,
          canSendMessage: false
        });
      }
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
    
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}