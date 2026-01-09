import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export const addUserActivity = async (activity: string) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      'preferences.lastVisited': arrayUnion(activity),
    });
  } catch (error) {
    console.log('Error updating user activity:', error);
  }
};
