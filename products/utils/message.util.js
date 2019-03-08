module.exports = {
  success_200: {
    status: 200,
    data: {
      message: 'OK',
    },
  },
  success_201: {
    status: 201,
    data: {
      message: 'Created',
    },
  },
  success_204: {
    status: 204,
    data: {
      message: 'Done',
    },
  },
  error_400: {
    status: 400,
    data: {
      message: 'Bad Request',
    },
  },
  error_401: {
    status: 401,
    data: {
      message: 'Unauthorized',
    },
  },
  error_404: {
    status: 404,
    data: {
      message: 'Not Found',
    },
  },
  error_409: {
    status: 409,
    data: {
      message: 'Conflict',
    },
  },
  error_500: {
    status: 500,
    data: {
      message: 'Server Error',
    },
  },
};
