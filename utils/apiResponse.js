// backend/utils/apiResponse.js
module.exports = (res, data, status = 200) => { res.status(status).json(data); };
