import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, addDoc, deleteDoc } from "firebase/firestore";
import { Bookmark } from "./slice";
import firebase_app from "@/src/firebase/config";

const db = getFirestore(firebase_app);

export async function fetchBookmarks(uid: string) {
    let bookmarksRef = collection(db, `users/${uid}/bookmarks`);
    //let docSnap = await getDocs(bookmarksRef);

    return [{ videoId: 'ARCRORuhER8', title: 'Architects - "C.A.N.C.E.R"', duration: 260 }] as Bookmark[];
    //return docSnap.docs.map(doc => { return { id: doc.id, ...doc.data() } });
};

export async function addBookmark(uid: string, bookmark: Bookmark) {
    const docRef = await addDoc(collection(db, `users/${uid}/bookmarks`), bookmark);

    return { id: docRef.id, ...bookmark };
}

export async function deleteBookmark(uid: string, bookmarkId: string) {
    await deleteDoc(doc(db, `users/${uid}/bookmarks/${bookmarkId}`));

    return bookmarkId;
}
