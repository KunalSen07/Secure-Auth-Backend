/**
 * Normalizes paths. Example: /user/123/profile -> /user/:id/profile
 * This ensures rate limits apply to the endpoint pattern, not unique URLs.
 */
function normalizePath(path) {
  return path
    .split("/")
    .map((segment) => {
      // Replace purely numeric segments or UUIDs with :id
      if (/^\d+$/.test(segment) || /^[0-9a-fA-F-]{36}$/.test(segment)) {
        return ":id";
      }
      return segment;
    })
    .join("/");
}

module.exports = { normalizePath };
