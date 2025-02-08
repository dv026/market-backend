"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
var errorMiddleware = function (error, req, res, next) {
    if (error.name === 'ValidationError') {
        return res.status(400).send({
            type: 'ValidationError',
            details: error.details,
        });
    }
    var errorObj = {
        errorCode: error.errorCode,
        message: error.message,
    };
    console.log(errorObj);
    return res.status(400).json(errorObj);
};
exports.errorMiddleware = errorMiddleware;
