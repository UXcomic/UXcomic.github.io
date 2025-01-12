const successResponse = (data, message = 'Success') => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'success',
            message: message,
            data: data,
        }),
    };
};

const errorResponse = (message = 'Error occurred') => {
    return {
        statusCode: 500,
        body: JSON.stringify({
            status: 'error',
            message: message,
            // error: error.message || error,
        }),
    };
};

const badRequestResponse = (message = 'Bad request') => {
    return {
        statusCode: 400,
        body: JSON.stringify({
            status: 'fail',
            message: message,
        }),
    };
};

const notFoundResponse = (message = 'Resource not found') => {
    return {
        statusCode: 404,
        body: JSON.stringify({
            status: 'fail',
            message: message,
        }),
    };
};

module.exports = {
    successResponse,
    errorResponse,
    badRequestResponse,
    notFoundResponse
};
