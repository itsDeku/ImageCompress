const getDisplaySize = (size,deciaml=2 ) => {
    size = size / 1024
    if (size <= 1000 && size < 1000 * 1000)
        return (Math.round(size * 100) / 100 ).toFixed(deciaml) + "KB";
    // return size + "KB"
    else if (size <= 1000 * 1000 && size < 1000 * 1000 * 1000)
        return (Math.round((size / 1000) * 100) / 100).toFixed(deciaml) + "MB";
    // return size / 1000 + "MB"
    else if (size <= 1000 * 1000 * 1000)
        return (Math.round((size / (1000 * 1000)) * 100) / 100).toFixed(deciaml) + "GB";
    // return size / (1000 * 1000) + "GB"
}

function getAspectRatio(width, height) {
    // Find the greatest common divisor (GCD) using Euclid's algorithm
    const gcd = (a, b) => {
        if (b === 0) {
            return a;
        }
        return gcd(b, a % b);
    };

    // Calculate the greatest common divisor of width and height
    const commonDivisor = gcd(width, height);

    // Return the aspect ratio as a simplified fraction
    return `${width / commonDivisor}:${height / commonDivisor}`;
}

const readFileAsBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const imageSrc = event.target.result;
        console.log(imageSrc);
        resolve(event.target.result); // Resolve the Promise with the result
      };
  
      reader.onerror = (error) => {
        reject(error); // Reject the Promise if there's an error
      };
  
      reader.readAsDataURL(file);
    });
  };

module.exports = { getDisplaySize, getAspectRatio,readFileAsBuffer}
