"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
require("dotenv/config");
const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;
// Firebase credentials
const credentialFB = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_KEY_ID,
    "private_key": privateKey,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT,
    "universe_domain": process.env.FIREBASE_DOMAIN
};
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(credentialFB),
    storageBucket: 'gs://sortex-a345f.appspot.com',
});
const storage = firebase_admin_1.default.storage();
const bucket = storage.bucket();
function uploadMiddleware() {
    return function (req, res, next) {
        if (!req.files || !Array.isArray(req.files)) {
            return next(new Error("No files uploaded"));
        }
        const files = req.files;
        let uploadPromises = files.map((file) => {
            const typeFile = file.originalname.split('.').pop();
            const nameFile = `${Date.now()}.${typeFile}`;
            const fileBlob = bucket.file(nameFile);
            const stream = fileBlob.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            });
            return new Promise((resolve, reject) => {
                stream.on('error', (e) => {
                    console.error(e);
                    reject(e);
                });
                stream.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield fileBlob.makePublic();
                        file.firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${nameFile}`;
                        resolve();
                    }
                    catch (error) {
                        reject(error);
                    }
                }));
                stream.end(file.buffer);
            });
        });
        Promise.all(uploadPromises)
            .then(() => next())
            .catch((error) => next(error));
    };
}
const uploadMiddlewareInstance = uploadMiddleware();
exports.default = uploadMiddlewareInstance;
