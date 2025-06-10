"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextjsApp = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();
exports.nextjsApp = (0, https_1.onRequest)({
    region: 'asia-east1',
    memory: '256MiB'
}, async (req, res) => {
    // Next.js 서버리스 함수 구현
    res.json({ message: 'Next.js Function' });
});
//# sourceMappingURL=index.js.map