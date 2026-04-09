const validateWorkInput = (req, res, next) => {
  const { title, price, category, location } = req.body;

  if (!title || title.length < 5)
    return res.status(400).json({ error: 'Title is too short (min 5 chars)' });

  if (!price || price <= 0)
    return res.status(400).json({ error: 'Valid price is required' });

  if (!category || !location)
    return res.status(400).json({ error: 'Category and Location are required' });

  next();
};

module.exports = { validateWorkInput };