const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is about to expire (within 5 minutes)
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    
    if (timeUntilExpiration < 300000) { // 5 minutes in milliseconds
      // Generate new token
      const newToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Set new token in response header
      res.setHeader('x-new-token', newToken);
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 