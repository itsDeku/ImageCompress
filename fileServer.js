const fs = require('fs');
const path = require('path');

class FileServer {
    constructor() {
        this.imagePath = './example.jpg'; // Path to the image file
        this.imageData = null; // Image data
        this.palette = null; // Color palette
        this.estimation = null; // Estimation
    }

    async loadImage() {
        try {
            this.imageData = await fs.promises.readFile(this.imagePath);
            return this.imageData;
        } catch (error) {
            throw error;
        }
    }

    async loadPalette() {
        try {
            if (!this.imageData) {
                await this.loadImage();
            }
            this.palette = await Vib.from(this.imageData).getPalette();
            return this.palette;
        } catch (error) {
            throw error;
        }
    }

    async loadEstimation() {
        try {
            if (!this.palette) {
                await this.loadPalette();
            }
            this.estimation = {
                averageColor: this.palette.Vibrant.getHex() // Example estimation
            };
            return this.estimation;
        } catch (error) {
            throw error;
        }
    }
}

const fileServer = new FileServer();

module.exports = fileServer;
