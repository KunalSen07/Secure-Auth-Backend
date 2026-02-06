const store = new Map();

function get(key) {
  return store.get(key);
}

function set(key, value) {
  store.set(key, value);
}

function del(key) {
  store.delete(key);
}

async function check(key, windowMs, max) {
  const now = Date.now();

  // Get existing timestamps or create new array
  let timestamps = get(key) || [];

  // Remove timestamps outside the window
  timestamps = timestamps.filter((timestamp) => timestamp > now - windowMs);

  // Add current timestamp
  timestamps.push(now);

  // Update store or delete if empty (cleanup)
  if (timestamps.length === 0) {
    del(key);
  } else {
    set(key, timestamps);
  }

  const count = timestamps.length;
  const allowed = count <= max;

  return {
    allowed,
    count,
  };
}

module.exports = {
  get,
  set,
  store,
  del,
  check,
};
