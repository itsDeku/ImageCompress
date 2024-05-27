const  Router = require("express");
const multer = require('multer');

const HomeRouter = Router();

const { GetCompressedImg ,uploadImage ,GetPalette}= require("../controller/HomeController");

const upload = multer();

HomeRouter.post('/upload_image', upload.single('image'),uploadImage)
HomeRouter.post('/compress_image',GetCompressedImg);
HomeRouter.get('/getpal', GetPalette)

module.exports = HomeRouter;    

