import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Get the QR codes subcollection reference for a user.
 */
function qrCol(uid) {
  return collection(db, "users", uid, "qrcodes");
}

/**
 * Save a QR code to Firestore.
 * @param {string} uid - Firebase user UID
 * @param {{ text: string, data: string, dataUrl: string, type: string }} qr
 */
export async function saveQR(uid, qr) {
  const ref = await addDoc(qrCol(uid), {
    text: qr.text,
    data: qr.data,
    dataUrl: qr.dataUrl,
    type: qr.type,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Get all QR codes for a user, newest first.
 */
export async function getUserQRs(uid) {
  const q = query(qrCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    // Convert Firestore timestamp to readable string
    time: d.data().createdAt
      ? d.data().createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "",
  }));
}

/**
 * Delete a single QR code.
 */
export async function deleteQR(uid, qrId) {
  await deleteDoc(doc(db, "users", uid, "qrcodes", qrId));
}

/**
 * Delete all QR codes for a user.
 */
export async function clearAllQRs(uid) {
  const snap = await getDocs(qrCol(uid));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}
