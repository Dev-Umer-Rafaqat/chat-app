const AppError = require("../utils/AppError");

const MAX_REQUESTS = 20;

// 1 minute.
const WINDOW_MS = 60 * 1000;

const ipRequests = new Map();

function getClientIp(req) {
  return (
    req.ip ||
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown"
  );
}

function authRateLimiter(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();

  const record = ipRequests.get(ip);

  if (!record || now - record.windowStart >= WINDOW_MS) {
    ipRequests.set(ip, {
      count: 1,
      windowStart: now,
    });

    return next();
  }

  record.count += 1;

  if (record.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil(
      (WINDOW_MS - (now - record.windowStart)) / 1000,
    );

    res.set("Retry-After", String(retryAfter));

    return next(
      new AppError(
        `Too many authentication requests. Try again in ${retryAfter} seconds.`,
        429,
      ),
    );
  }

  next();
}

// CLEAN OLD RECORDS

setInterval(() => {
  const now = Date.now();

  for (const [ip, record] of ipRequests.entries()) {
    if (now - record.windowStart >= WINDOW_MS) {
      ipRequests.delete(ip);
    }
  }
}, WINDOW_MS).unref();

module.exports = {
  authRateLimiter,
};
