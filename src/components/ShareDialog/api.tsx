import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import User from "@/src/interfaces/User";

const db = getFirestore();

export async function searchUsers(email: string) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const docSnap = await getDocs(q);

    return docSnap.docs.map(doc => { return { id: doc.id, ...doc.data() } }) as User[];
}

export async function addShareLink(projectId: string, userId: string) {
    const newShareLink = {
        projectId: projectId,
        userId: userId,
        hash: getRandomToken(10)
    };
    
    await addDoc(collection(db, "shareLinks"), newShareLink);
    
    return newShareLink.hash;
}

export async function getShareLink(hash: string) {
    const shareLinksRef = collection(db, "shareLinks");
    const q = query(shareLinksRef, where("hash", "==", hash));
    const docSnap = await getDocs(q);
    
    return docSnap.docs[0].data();
}


function getRandomToken(len: number): string {
    return Math.random().toString(36).substr(2, len);
}
