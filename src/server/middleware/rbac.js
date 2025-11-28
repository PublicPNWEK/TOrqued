module.exports = function requireRole(role) {
  return (req, res, next) => {
    const user = req.user || {}
    if (!user.roles || !user.roles.includes(role)) return res.status(403).json({ error: 'insufficient_role' })
    next()
  }
}
