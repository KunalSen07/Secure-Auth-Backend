const { store } = require("./memoryStore");

const RATE_LIMITS = {
  "/auth/login": { windowMs: 60_000, max: 5 },
  "/auth/refresh": { windowMs: 60_000, max: 10 },
  default: { windowMs: 60_000, max: 100 },
};

function checkRateLimit({ key, path }) {
  const { windowMs, max } = RATE_LIMITS[path] || RATE_LIMITS.default;
  const now = Date.now();

  let record = store.get(key);

  if (!record) {
    record = { timestamps: [] };
    store.set(key, record);
  }

  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  const allowed = record.timestamps.length < max;

  if (allowed) record.timestamps.push(now);

  const remaining = Math.max(0, max - record.timestamps.length);
  const reset =
    record.timestamps.length > 0
      ? Math.ceil((windowMs - (now - record.timestamps[0])) / 1000)
      : Math.ceil(windowMs / 1000);

  if (record.timestamps.length === 0) store.del(key);

  return {
    allowed,
    limit: max,
    remaining,
    reset,
  };
}

module.exports = { checkRateLimit };
