const jwt=require('jsonwebtoken');
const response=require('../helper/response')

const verifyAccessToken = async (req, res, next) => {
    try {
      const accessToken = req.cookies.accessToken;
  
      if (!accessToken) {
        return response.errorResponseBadRequest(res, 'Cookie is not present or expired!');
      }
  
      const decodedToken = await jwt.verify(accessToken, process.env.ACCESSTOKEN_KEY);
  
      if (!decodedToken) {
        return response.errorResponseUnauthorized(res, 'Token is invalid or has expired');
      }
  
      req.user = decodedToken;
      next();
    } catch (error) {
      console.log(error);
      return response.errorResponseServer(res, 'An error occurred while decoding the token:');
    }
  };
  
  module.exports = verifyAccessToken;