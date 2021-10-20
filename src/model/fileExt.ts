const imageExt = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  bmp: "image/bmp",
  png: "image/png",
  // heic: "image/heic",
  // heif: "image/heif",
};

/**
 * @openapi
 * components:
 *   schemas:
 *     FileExt:
 *       require: true
 *       type: string
 *       enum:
 *          - webp
 *          - jpg
 *          - jpeg
 *          - bmp
 *          - png
 * #         - heic
 * #         - heif
 */
export const FileExt = {
  img: imageExt,
  thumbnail: imageExt,
};
