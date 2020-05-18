const path = require('path');
const fs = require('fs');

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => {
    if (err !== null)
      console.log(err);
  });
};

exports.clearImage = clearImage;