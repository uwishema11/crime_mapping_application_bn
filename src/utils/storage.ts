import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import multer from 'multer';

interface transformationType {
  width: number;
  height: number;
  crop: string;
}

interface paramsType {
  folder: string;
  allowed_formats: string[];
  transformation: transformationType[];
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'e_commerce_image',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  } as paramsType,
});

export const uploadImg = multer({ storage: storage }).single('image_url');
