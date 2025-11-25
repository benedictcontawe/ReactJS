import { uploadAPI } from '../network/api-client';

/**
 * Interface representing processed file information.
 */
export interface FileInfo {  
  file: File;/** The original File object from the browser. */  
  fileName: string;/** The name of the file without its extension. */  
  fileExtension: string;/** The file's extension. */  
  fileSize: string;/** A human-readable string representing the file size (e.g., "1.2 MB"). */
  fileBytes: ArrayBuffer;/** The raw binary data of the file. */
}

/**
 * Converts a file size in bytes to a human-readable string (KB, MB, GB).
 * @param bytes - The file size in bytes.
 * @returns A formatted string representing the file size.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Checks if a file extension corresponds to a common image format.
 * @param fileExtension - The file extension to check (e.g., "jpg", "png").
 * @returns `true` if the extension is an image type, `false` otherwise.
 */
export const isImageExtension = (fileExtension: string): boolean => {
  const ext = fileExtension.toLowerCase();
  return ext.includes('jpg') || ext.includes('jpeg') || ext.includes('png') || ext.includes('webp');
};

/**
* Uploads a file to the backend API and returns its download URL.
* @param file - The File object to upload.
* @param path - The destination path (e.g., 'avatars', 'posts'). Defaults to 'images'.
* @returns A promise that resolves to the download URL of the uploaded file.
* @throws Will throw an error if the upload fails.
*/
export const uploadFileToStorage = async (
 file: File,
 path: string = 'images'
): Promise<string> => {
 const response = await uploadAPI.upload(file, path);
 return response.data.image_url;
};

/**
 * Reads a File object and converts its content to an ArrayBuffer.
 * @param file - The File object to read.
 * @returns A promise that resolves with the file's content as an ArrayBuffer.
 * @throws Will throw an error if the file cannot be read.
 */
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Processes a File object to extract its metadata and content.
 * @param file - The File object to process.
 * @returns A promise that resolves to a FileInfo object containing the file's details.
 */
export const processFile = async (file: File): Promise<FileInfo> => {
  const fileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1) || '';
  const fileSize = formatFileSize(file.size);
  const fileBytes = await readFileAsArrayBuffer(file);
  
  return {
    file,
    fileName,
    fileExtension,
    fileSize,
    fileBytes
  };
};