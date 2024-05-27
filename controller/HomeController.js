const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const { getpal, getHue } = require('../util');
const { response } = require('../router/HomeRouter');
// Path to the image file

// Object to store temporary image data in memory
global.imageStorage = {};



const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate a unique session ID
    const sessionId = uuidv4();
    let imageDataJSON = {}
    // Save the file buffer with the session ID
    imageStorage[sessionId] = { "buffer": req.file.buffer, "timestamp": new Date().getTime() };
    console.log(imageStorage[sessionId].buffer)
    sharp(imageStorage[sessionId].buffer)
        .metadata()
        .then(metadata => {
            // Encode the original image data as a base64 string
            const base64OriginalImage = req.file.buffer.toString('base64');

            // Process the image to convert it to grayscale

            imageDataJSON = {
                original: {
                    originalImage: base64OriginalImage,
                    format: metadata.format,
                    size: metadata.size,
                    width: metadata.width,
                    height: metadata.height,
                    space: metadata.space
                },
                Result: {

                    ResultImage: '',
                    format: metadata.format,
                    size: metadata.size,
                    width: metadata.width,
                    height: metadata.height,
                    space: metadata.space


                }
            };

            // Convert JSON object to string
            (async () => {
                const palette = await getpal(req.file.buffer);
                let responseData = {}

                if (palette) {
                    const { Vibrant, Muted, DarkMuted, LightMuted, DarkVibrant, LightVibrant } = palette;
                    responseData["Vibrant"] = [Vibrant.getHex(), getHue(Vibrant)]
                    responseData["Muted"] = [Muted.getHex(), getHue(Muted)]
                    responseData["DarkMuted"] = [DarkMuted.getHex(), getHue(DarkMuted)]
                    responseData["LightMuted"] = [LightMuted.getHex(), getHue(LightMuted)]
                    responseData["DarkVibrant"] = [DarkVibrant.getHex(), getHue(DarkVibrant)]
                    responseData["LightVibrant"] = [LightVibrant.getHex(), getHue(LightVibrant)]
                }
                // console.log(palette)
                // console.log(responseData);
                res.json({ session_id: sessionId, palettes: responseData, imageData: imageDataJSON })
            })();


            // Send the JSON data
            // console.log(imageDataJSON);
        }).catch(err => {
            console.error('Error getting metadata:', err);
        });
};


const GetCompressedImg = (req, res) => {

    const { compressPercentage, width, fileType, colorSpace, sessionID } = req.body;
    let imageDataJSON = {}
    sharp(imageStorage[sessionID].buffer)
        .metadata()
        .then(metadata => {
            // Process the image to convert it to grayscale
            console.log("metadata: ", metadata.space, metadata.format, colorSpace, fileType);
            sharp(imageStorage[sessionID].buffer)
                .resize(width)
                .toFormat(fileType != '' ? fileType : metadata.format, { quality: Number(compressPercentage) })
                .toColorspace(colorSpace != '' ? colorSpace : metadata.space) // Convert the image to grayscale
                .toBuffer() // Convert the processed image to a buffer
                .then(resultImage => {
                    // Get metadata of the grayscale image
                    return sharp(resultImage).metadata()
                        .then(metadata => {
                            // Encode the grayscale image data as a base64 string
                            const base64resultimg = `data:image/${metadata.format};base64,${resultImage.toString('base64')}`;

                            // Create JSON object with original and grayscale image data and metadata
                            imageDataJSON = {
                                ResultImage: base64resultimg,
                                format: metadata.format,
                                size: metadata.size,
                                width: metadata.width,
                                height: metadata.height,
                                space: metadata.space

                            };

                            res.json(imageDataJSON)



                            // Send the JSON data
                            // console.log(imageDataJSON);
                        });
                })
                .catch(err => {
                    console.error('Error processing image:', err);
                });
        })
        .catch(err => {
            console.error('Error getting metadata:', err);
        });
};



const GetPalette = (req, res) => {


}


module.exports = { GetCompressedImg, uploadImage, GetPalette };