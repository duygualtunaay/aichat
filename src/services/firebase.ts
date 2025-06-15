import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  deleteDoc
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { User } from '../types';

export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log('Firebase: Signing in with email:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Firebase: Sign in successful:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase: Email sign in error:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    console.log('Firebase: Creating user with email:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('Firebase: User created:', user.uid);
    
    // Update profile
    await updateProfile(user, { displayName: name });
    console.log('Firebase: Profile updated');
    
    // Create user document
    await createUserDocument(user, { name, plan: 'free' });
    console.log('Firebase: User document created');
    
    return user;
  } catch (error) {
    console.error('Firebase: Email sign up error:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    console.log('Firebase: Signing in with Google using POPUP');
    const result = await signInWithPopup(auth, googleProvider);

    if (result.user) {
      console.log('Firebase: Google sign in successful via popup:', result.user.uid);
      // Kullanıcı belgesinin olup olmadığını kontrol et ve yoksa oluştur.
      await createUserDocument(result.user, {
        name: result.user.displayName || 'Google User',
        plan: 'free',
        googleId: result.user.uid
      });
      console.log('Firebase: Google user document created/updated');
      return result.user;
    }
    return null;

  } catch (error) {
    console.error('Firebase: Google sign in error:', error);
    throw error;
  }
};


export const signOutUser = async () => {
  try {
    console.log('Firebase: Signing out user');
    await signOut(auth);
    console.log('Firebase: Sign out successful');
  } catch (error) {
    console.error('Firebase: Sign out error:', error);
    throw error;
  }
};

// src/services/firebase.ts

// src/services/firebase.ts

export const createUserDocument = async (firebaseUser: FirebaseUser, additionalData?: any) => {
  if (!firebaseUser) return;

  console.log('Firebase: Creating/updating user document for:', firebaseUser.uid);

  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email } = firebaseUser;
    const createdAt = new Date();
    const today = new Date().toDateString();

    try {
      // Temel kullanıcı verilerini oluştur
      const userData: any = {
        name: additionalData?.name || displayName || 'Kullanıcı',
        email: email || undefined,
        plan: additionalData?.plan || 'free',
        dailyUsage: 0,
        createdAt,
        lastUsageReset: today,
        isAdmin: false,
        subscriptionStatus: 'inactive',
        ...additionalData
      };

      // Sadece varsa `googleId` alanını ekle.
      if (additionalData?.googleId) {
        userData.googleId = additionalData.googleId;
      }

      await setDoc(userRef, userData);
      console.log('Firebase: User document created successfully');
    } catch (error) {
      console.error('Firebase: Error creating user document:', error);
      throw error;
    }
  } else {
    console.log('Firebase: User document already exists');

    // Check if daily usage needs reset
    const userData = userSnap.data();
    const today = new Date().toDateString();

    if (userData.lastUsageReset !== today) {
      console.log('Firebase: Resetting daily usage for new day');
      await updateDoc(userRef, {
        dailyUsage: 0,
        lastUsageReset: today
      });
    }
  }

  return userRef;
};

export const getUserDocument = async (uid: string): Promise<User | null> => {
  try {
    console.log('Firebase: Getting user document for:', uid);
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      const userData = {
        id: uid,
        ...data,
        createdAt: data.createdAt.toDate(),
        subscriptionEndDate: data.subscriptionEndDate?.toDate()
      } as User;
      
      console.log('Firebase: User document retrieved:', userData);
      return userData;
    }
    
    console.log('Firebase: User document not found');
    return null;
  } catch (error) {
    console.error('Firebase: Error getting user document:', error);
    return null;
  }
};

export const updateUserDocument = async (uid: string, updates: Partial<User>) => {
  try {
    console.log('Firebase: Updating user document:', uid, updates);
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
    console.log('Firebase: User document updated successfully');
  } catch (error) {
    console.error('Firebase: Error updating user document:', error);
    throw error;
  }
};

export const incrementUserUsage = async (uid: string) => {
  try {
    console.log('Firebase: Incrementing user usage for:', uid);
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const today = new Date().toDateString();
      
      // Reset usage if it's a new day
      if (userData.lastUsageReset !== today) {
        await updateDoc(userRef, {
          dailyUsage: 1,
          lastUsageReset: today
        });
        console.log('Firebase: Daily usage reset and incremented');
      } else {
        await updateDoc(userRef, {
          dailyUsage: userData.dailyUsage + 1
        });
        console.log('Firebase: Daily usage incremented to:', userData.dailyUsage + 1);
      }
    }
  } catch (error) {
    console.error('Firebase: Error incrementing user usage:', error);
    throw error;
  }
};

export const resetUserDailyUsage = async (uid: string) => {
  try {
    console.log('Firebase: Resetting daily usage for:', uid);
    const userRef = doc(db, 'users', uid);
    const today = new Date().toDateString();
    
    await updateDoc(userRef, {
      dailyUsage: 0,
      lastUsageReset: today
    });
    
    console.log('Firebase: Daily usage reset successfully');
  } catch (error) {
    console.error('Firebase: Error resetting daily usage:', error);
    throw error;
  }
};

// Admin functions
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      subscriptionEndDate: doc.data().subscriptionEndDate?.toDate()
    })) as User[];
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const updateUserPlan = async (uid: string, plan: 'free' | 'pro') => {
  try {
    const userRef = doc(db, 'users', uid);
    const updates: any = { 
      plan,
      dailyUsage: 0 // Reset usage when changing plan
    };
    
    // If upgrading to pro, set subscription details
    if (plan === 'pro') {
      updates.subscriptionStatus = 'active';
      updates.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    } else {
      updates.subscriptionStatus = 'inactive';
      updates.subscriptionEndDate = null;
    }
    
    await updateDoc(userRef, updates);
    console.log('Firebase: User plan updated to:', plan);
  } catch (error) {
    console.error('Error updating user plan:', error);
    throw error;
  }
};

export const deleteUser = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getSystemStats = async () => {
  try {
    const usersRef = collection(db, 'users');
    const allUsersQuery = query(usersRef);
    const proUsersQuery = query(usersRef, where('plan', '==', 'pro'));
    
    const [allUsersSnap, proUsersSnap] = await Promise.all([
      getDocs(allUsersQuery),
      getDocs(proUsersQuery)
    ]);
    
    return {
      totalUsers: allUsersSnap.size,
      proUsers: proUsersSnap.size,
      freeUsers: allUsersSnap.size - proUsersSnap.size
    };
  } catch (error) {
    console.error('Error getting system stats:', error);
    throw error;
  }
};