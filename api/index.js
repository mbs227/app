module.exports = async (req, res) => {
  return res.status(200).json({
    message: 'Manifest 12 API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      }
    }
  });
};
