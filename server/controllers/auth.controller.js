export function getMe(req, res) {
  const { id, email, user_metadata } = req.user;
  res.json({
    user: { id, email, user_metadata },
  });
}
