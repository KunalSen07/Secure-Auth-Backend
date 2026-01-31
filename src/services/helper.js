function canModifyResource(user, resource) {
  if (user.role === "admin") return true;

  return resource.ownerId === user.id;
}

module.exports = { canModifyResource };
