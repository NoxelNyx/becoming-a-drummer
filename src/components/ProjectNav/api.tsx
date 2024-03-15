import { getFirestore, collection, getDocs, setDoc, addDoc, deleteDoc, doc } from "firebase/firestore";
import firebase_app from "@/src/firebase/config";
import Project from "@/src/interfaces/Project";

const db = getFirestore(firebase_app);

export async function fetchProjects(uid: string) {
    let bookmarksRef = collection(db, `users/${uid}/projects`);
    let docSnap = await getDocs(bookmarksRef);

    return docSnap.docs.map(doc => { return { ...doc.data(), id: doc.id } });
};

export async function setProject(uid: string, project: Project) {
    await setDoc(doc(db, `users/${uid}/projects/${project.id}`), project);

    return project;
};

export async function addProject(uid: string, project: Project) {
    const docRef = await addDoc(collection(db, `users/${uid}/projects`), project);

    return { ...project, id: docRef.id };
}

export async function deleteProject(uid: string, id: string) {
    await deleteDoc(doc(db, `users/${uid}/projects/${id}`));

    return id;
}
