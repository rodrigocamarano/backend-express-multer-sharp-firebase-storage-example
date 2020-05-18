const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const multer = require('multer');

const crc32 = require('fast-crc32c');
const fs = require('fs');
const sharp = require('sharp');
const { v4 } = require('uuid');
const { clearImage } = require('./util/file');
const { bucket } = require('./util/firebase');

const app = express();

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        let ext;
        if (file.mimetype === 'image/jpeg')
            ext = 'jpeg';
        else if (file.mimetype === 'image/jpg')
            ext = 'jpg';
        else if (file.mimetype === 'image/png')
            ext = 'png';
        cb(null, `${new Date().toISOString()}.${ext}`);
    }
});

const multerFileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(
    multer({ storage: multerStorage, limits: { fileSize: 1024 * 1024 * 2 }, fileFilter: multerFileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.put('/image', (req, res) => {
    let extension;
    if (req.file.mimetype === 'image/png')
        extension = 'png';
    else if (req.file.mimetype === 'image/jpg')
        extension = 'jpg';
    else if (req.file.mimetype === 'image/jpeg')
        extension = 'jpeg';

    // -------------------
    // const uuid = v4();
    // const uploadedFile = `image_${req.file.filename}`;
    // const uploadTo = `images/${uploadedFile}`;
    // const filePathResized = `./images/${uploadedFile}`;
    // sharp(filePath).resize(1200).toFile(filePathResized)
    //     .then(function (newFileInfo) {
    //         bucket.upload(filePathResized, {
    //             destination: uploadTo,
    //             resumable: false,
    //             validation: crc32,
    //             metadata: {
    //                 metadata: {
    //                     firebaseStorageDownloadTokens: uuid
    //                 }
    //             }
    //         }, function (err, file) {
    //             if (err) {
    //                 console.log(err);
    //                 return;
    //             }
    //         });
    //     })
    //     .catch(function (err) {
    //         const error = new Error(err.message);
    //         error.code = 404;
    //         throw error;
    //     });
    //     clearImage(`images/${req.file.filename}`);
    // -------------------

    return res
        .status(201)
        .json({ file: req.file.filename });
});
app.post('/storage', (req, res) => {
    const filePath = `./images/${req.body.file}`;
    if (!fs.existsSync(filePath)) {
        const error = new Error('Invalid file!');
        error.code = 404;
        throw error;
    }
    const uuid = v4();
    const uploadedFile = `image_${req.body.file}`;
    const uploadTo = `images/${uploadedFile}`;
    const filePathResized = `./images/${uploadedFile}`;
    sharp(filePath).resize(1200).toFile(filePathResized)
        .then(function (newFileInfo) {
            bucket.upload(filePathResized, {
                destination: uploadTo,
                resumable: false,
                validation: crc32,
                metadata: {
                    metadata: {
                        firebaseStorageDownloadTokens: uuid
                    }
                }
            }, function (err, file) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            clearImage(`images/${req.body.file}`);
            clearImage(`images/image_${req.body.file}`);
        })
        .catch(function (err) {
            const error = new Error(err.message);
            error.code = 404;
            throw error;
        });

    return res
        .status(201)
        .json({ file: `https://firebasestorage.googleapis.com/v0/b/${process.env.STORAGE}/o/images%2F${uploadedFile}?alt=media&token=${uuid}` });
});

app.listen(process.env.PORT || 8080);