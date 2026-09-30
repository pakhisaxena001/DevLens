export const sendResponse = (res, statusCode, data) => {
  const serializedData = JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    )
  );

  res.status(statusCode).json({
    success: true,
    ...serializedData,
  });
};

export const sendError = (res, statusCode, message, errors = null) => {
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(errors && { errors }),
  });
};

export const sendPaginatedResponse = (
  res,
  data,
  page,
  limit,
  total
) => {
  const serializedData = JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    )
  );

  res.status(200).json({
    success: true,
    data: serializedData,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};