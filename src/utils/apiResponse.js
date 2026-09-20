class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  static ok(res, data, message = 'Success') {
    return res.status(200).json(new ApiResponse(200, data, message));
  }

  static created(res, data, message = 'Resource created successfully') {
    return res.status(201).json(new ApiResponse(201, data, message));
  }

  static paginated(res, items, pagination, message = 'Data retrieved successfully') {
    const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
    return res.status(200).json({
      statusCode: 200,
      success: true,
      message,
      data: items,
      pagination: {
        total: pagination.total,
        page: Number(pagination.page),
        limit: Number(pagination.limit),
        totalPages,
        hasNextPage: Number(pagination.page) < totalPages,
        hasPrevPage: Number(pagination.page) > 1
      }
    });
  }
}

module.exports = ApiResponse;
