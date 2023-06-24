import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, addDoc, deleteDoc } from "firebase/firestore";
import firebase_app from "@/src/firebase/config";

const db = getFirestore(firebase_app);

export async function fetchBookmarks(uid: string) {
    let bookmarksRef = collection(db, `users/${uid}/bookmarks`);
    let docSnap = await getDocs(bookmarksRef);

    return docSnap.docs.map(doc => doc.data());
};
