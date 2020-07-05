const cloudinary = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadSingleFile = async (file, folder) => {
  const promise = new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({
          url: result.url,
          id: result.public_id,
        });
      },
      {
        resource_type: "auto",
        folder: folder,
      }
    );
  });
  return await promise;
};

exports.uploadsMultiFiles = async (files, folder) => {
  if (files) {
    const allPromises = files.map(async (file) => {
      const promise = new Promise((resolve) => {
        cloudinary.uploader.upload(
          file.path,
          (result) => {
            resolve({
              url: result.url,
              public_id: result.public_id,
            });
          },
          {
            resource_type: "auto",
            folder: folder,
          }
        );
      });
      return await promise;
    });
    const results = Promise.all(allPromises);
    console.log(results);
    return results;
  }
};
