export const resizeImageToDataUrl = (file, options = {}) => {
  const {
    maxWidth = 500,
    maxHeight = 500,
    quality = 0.75,
    mimeType = "image/jpeg",
    maxFileSize = 15 * 1024 * 1024,
  } = options;

  return new Promise((resolve, reject) => {
    if (!file || typeof file !== "object") {
      reject(new Error("Invalid file selected."));
      return;
    }

    if (typeof file.size === "number" && file.size > maxFileSize) {
      reject(new Error("Image is too large. Please choose one smaller than 15MB."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const originalDataUrl = typeof reader.result === "string" ? reader.result : "";
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = image;

        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Unable to process the selected image."));
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL(mimeType, quality));
      };

      image.onerror = () => {
        if (originalDataUrl) {
          resolve(originalDataUrl);
          return;
        }

        reject(new Error("Selected file is not a valid image."));
      };
      image.src = originalDataUrl;
    };

    reader.onerror = () => reject(new Error("Failed to read the selected image."));
    reader.readAsDataURL(file);
  });
};
