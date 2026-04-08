const fs = require('fs');
const { imageSize } = require('image-size');
try {
    const size = imageSize('public/images/certificates/Certificates Css.png');
    console.log(JSON.stringify(size));
} catch (err) {
    console.error(err);
}
