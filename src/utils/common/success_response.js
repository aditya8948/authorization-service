const createSuccessResponse = ({ message = 'successfully completed the request', data = {} } = {}) => ({
    success: true,
    message,
    data,
    error: {}
});

module.exports = createSuccessResponse;
