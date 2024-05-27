const Vib = require('node-vibrant');



/**
 * Clears the buffer object that has exeded the time(minutes)
 * @param  {Number} minutes Minutes (defult: 5min)
 * @param  {Number} num2 The second number
 * @return {void} it returns nothing
 */
const clearOldImageStorage = (minutes = 5) => {
    console.log(imageStorage);
    const currentTime = new Date().getTime();
    const threshold =  minutes * 60 * 1000; // 5 minutes in milliseconds
    
    for (const sessionId in imageStorage) {
        const timestamp = imageStorage[sessionId].timestamp;
        console.log("timestamp: ",timestamp,"current : ",currentTime);
        if (currentTime - timestamp > threshold) {
            delete imageStorage[sessionId];
        }
    }
}

/**
 * extracts the pallets from the image
 * @param  {Image} imgaePath image
 * @return {Promise}  Promise object 
 */
const getpal = async (imagePath) => {
    try {
        // Create a new Vibrant object with the image path
        // const palette = await Vib.from(imagePath).getPalette();

        const getpalette = async () => await Vib.from(imagePath).getPalette();
        const palette = await getpalette()
        // Check if palette is available
        if (palette) {
            // Extracted color palette
            return palette
        } else {
            console.log("No palette found for the image.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
/**
 * Extract hue from hex color
 * @param  {HEX} hexColor HexColor
 * @return {Number} hue value 
 */
const getHue = (color) => {
    // Convert RGB to HSL
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue;
  
    // Calculate hue
    if (max === min) {
      hue = 0;
    } else if (max === r) {
      hue = ((60 * (g - b) / (max - min)) + 360) % 360;
    } else if (max === g) {
      hue = (60 * (b - r) / (max - min)) + 120;
    } else {
      hue = (60 * (r - g) / (max - min)) + 240;
    }
  
    return Math.round(hue);
  }

module.exports = {clearOldImageStorage,getpal,getHue}