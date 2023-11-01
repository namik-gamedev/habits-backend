import ApiError from '../exceptions/apiError.js';

const errorMiddleware = (err, _req, res, _next) => {
   console.log(err);
   if (err instanceof ApiError) {
      const { status, code, errors } = err;
      res.status(status).json({ code, errors });
   }
   return res.status(500).json();
};

export default errorMiddleware;
