const createErrorResponse = ({ message = 'something went wrong', error = {} } = {}) => ({
    success: false,
    message,
    data: {},
    error
});

module.exports = createErrorResponse;
