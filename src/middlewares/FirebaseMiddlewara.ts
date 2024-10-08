import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import 'dotenv/config';

const privateKey = process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
    : undefined;

// Firebase credentials
const credentialFB: any = {
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

// Verifica se o app Firebase já foi inicializado
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(credentialFB),
        storageBucket: 'gs://sortex-a345f.appspot.com',
    });
} else {
    admin.app(); // Usa o app existente
}

const storage = admin.storage();
const bucket = storage.bucket();

interface CustomFile extends Express.Multer.File {
    firebaseUrl?: string;
}

function uploadMiddleware() {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.files || !Array.isArray(req.files)) {
            return next(new Error("No files uploaded"));
        }  

        const files = req.files as CustomFile[];

        let uploadPromises = files.map((file) => {
            const typeFile = file.originalname.split('.').pop();
            const nameFile = `${Date.now()}.${typeFile}`;
            const fileBlob = bucket.file(nameFile);

            const stream = fileBlob.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            });

            return new Promise<void>((resolve, reject) => {
                stream.on('error', (e) => {
                    console.error(e);
                    reject(e);
                });

                stream.on('finish', async () => {
                    try {
                        await fileBlob.makePublic();
                        file.firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${nameFile}`;
                        resolve(); 
                    } catch (error) {
                        reject(error);
                    }
                });

                stream.end(file.buffer);
            });
        });

        Promise.all(uploadPromises)
            .then(() => next())
            .catch((error) => next(error));
    };
}

const uploadMiddlewareInstance = uploadMiddleware();

export default uploadMiddlewareInstance;

async function DeleteImage(imageUrl: string): Promise<void> {
    try {
        const decodedUrl = decodeURIComponent(imageUrl);
        const filePath = decodedUrl.split("https://storage.googleapis.com/sortex-a345f.appspot.com/")[1];

        if (!filePath) {
            throw new Error("Caminho do arquivo não pôde ser extraído do URL.");
        }

        const file = bucket.file(filePath);
        await file.delete();

        console.log(`Imagem deletada com sucesso: ${filePath}`);
    } catch (error) {
        console.error(`Erro ao deletar imagem: ${error.message}`);
        throw new Error(`Erro ao deletar imagem: ${error.message}`);
    }
}

export { DeleteImage };
