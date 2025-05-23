"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
function successResponse(res, data, statusCode, message) {
    res.status(statusCode).json({ success: true, message, data });
    return;
}
function errorResponse(res, message, statusCode) {
    res.status(statusCode).json({ success: false, message });
    return;
}
