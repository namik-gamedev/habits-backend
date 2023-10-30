import ApiError from '../exceptions/apiError.js';

const errorMiddleware = (err, _req, res, _next) => {
   console.log(err);
   if (err instanceof ApiError) {
      const { status, message, errors } = err;
      res.status(status).json({ message, errors });
   }
   return res.status(500).json({ message: 'Internal Server Error' });
};

export default errorMiddleware;
