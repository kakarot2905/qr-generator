import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/** Largest file we accept for an upload (10 MB). */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Strip characters that don't belong in a Storage object path. */
function safeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100) || "file";
}

/**
 * Upload a file to Firebase Storage under the signed-in user's folder and
 * return a public download URL. The QR code encodes this URL (a whole file
 * can't fit inside a QR code, so we point at the hosted copy instead).
 *
 * @param {string} uid - Firebase user UID
 * @param {File} file - the file selected by the user
 * @returns {Promise<string>} download URL pointing at the uploaded file
 */
export async function uploadFile(uid, file) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large");
  }
  const path = `users/${uid}/files/${Date.now()}-${safeName(file.name)}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file, {
    contentType: file.type || "application/octet-stream",
  });
  return getDownloadURL(fileRef);
}
