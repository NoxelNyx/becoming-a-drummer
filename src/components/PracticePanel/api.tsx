import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, addDoc, deleteDoc } from "firebase/firestore";
import { Bookmark, CommunityContent } from "./slice";
import firebase_app from "@/src/firebase/config";

const db = getFirestore(firebase_app);

export async function fetchBookmarks(uid: string) {
    let bookmarksRef = collection(db, `users/${uid}/bookmarks`);
    let docSnap = await getDocs(bookmarksRef);

    return docSnap.docs.map(doc => { return { id: doc.id, ...doc.data() } });
};

export async function addBookmark(uid: string, bookmark: Bookmark) {
    const docRef = await addDoc(collection(db, `users/${uid}/bookmarks`), bookmark);

    return { id: docRef.id, ...bookmark };
}

export async function deleteBookmark(uid: string, bookmarkId: string) {
    await deleteDoc(doc(db, `users/${uid}/bookmarks/${bookmarkId}`));

    return bookmarkId;
}

export async function fetchCommunityContent(keywords: string[]) {
    let communityContentRef = collection(db, 'communityContent');
    let q = query(communityContentRef, where('keywords', 'array-contains-any', keywords), where('type', '==', 'gsBookmark'));
    let docSnap = await getDocs(q);

    return docSnap.docs.map(doc => { return { id: doc.id, ...doc.data() } });
}

export async function addCommunityContent(communityContent: CommunityContent) {
    try {
        const docRef = await addDoc(collection(db, `communityContent`), communityContent);

        return { id: docRef.id, ...communityContent };
    } catch (e) {
        console.log(e);
    }
}
