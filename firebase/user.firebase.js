import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
export const createUser = async (user) => {
  const db = getFirestore();
  try {
    // step 1: check that email is already exist in the database
    // step 2: returen;
    // step 3: create user on the database
    const q = query(collection(db, "users"), where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    let found = false;
    let existsUser = null;
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        // console.log(`User  exists with this email: ${user.email}.`);
        found = true;
        existsUser = { id: doc.id, ...doc.data() };
        return;
      }
    });
    if (found) return existsUser;
    else {
      const newUserRef = doc(collection(db, "users"));
      await setDoc(newUserRef, user);
      const savedUserRef = doc(db, "users", newUserRef.id);
      const savedUserSnap = await getDoc(savedUserRef);
      return { id: savedUserSnap.id, ...savedUserSnap.data() };
    }
  } catch (error) {
    console.error(error);
  }
};
