import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where, addDoc, deleteDoc, QueryDocumentSnapshot } from "firebase/firestore";
import { Section } from "./slice";
import firebase_app from "@/src/firebase/config";

const db = getFirestore(firebase_app);

export async function fetchSections(uid: string, videoId: string) {
    const sectionsRef = collection(db, `users/${uid}/sections/`);
    const q = query(sectionsRef, where("videoId", "==", videoId));
    //const docSnap = await getDocs(q);

    return [
        { id: '1', start: 50, end: 70, repeat: true, gsParams: 'test' },
        { id: '2', start: 130, end: 152, repeat: true, gsParams: 'test' }
    ] as Section[];

//    return docSnap.docs.map(doc => { return { id: doc.id, ...doc.data() } });
};

export async function addSection(uid: string, videoId: string, section: Section) {
    const docRef = await addDoc(collection(db, `users/${uid}/sections/${videoId}`), section);

    return { id: docRef.id, ...section };
};

export async function deleteSection(uid: string, videoId: string, sectionId: string) {
    await deleteDoc(doc(db, `users/${uid}/sections/${videoId}/${sectionId}`));

    return sectionId;
}
