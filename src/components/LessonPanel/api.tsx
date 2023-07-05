import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, addDoc, deleteDoc } from "firebase/firestore";
import { GsBookmark } from "./slice";
import firebase_app from "@/src/firebase/config";

const db = getFirestore(firebase_app);

export async function fetchGsBookmarks(uid: string, videoId: string) {
    const gsBookmarkRef = collection(db, `users/${uid}/gsBookmarks/`);
    const q = query(gsBookmarkRef, where("videoId", "==", videoId));
    const docSnap = await getDocs(q);

    return docSnap.docs.map(doc => { return { id: doc.id, ...doc.data() } }) as GsBookmark[];
}

export async function addGsBookmark(uid: string, gsBookmark: GsBookmark) {
    const docRef = await addDoc(collection(db, `users/${uid}/gsBookmarks/`), gsBookmark);

    return { id: docRef.id, ...gsBookmark };
}

export async function deleteGsBookmark(uid: string, gsBookmarkId: string) {
    await deleteDoc(doc(db, `users/${uid}/gsBookmarks/${gsBookmarkId}`));

    return gsBookmarkId;
}

export async function updateGsBookmark(uid: string, gsBookmark: GsBookmark) {
    await setDoc(doc(db, `users/${uid}/gsBookmarks/${gsBookmark.id}`), gsBookmark, { merge: true });

    return gsBookmark;
}
