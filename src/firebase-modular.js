import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  collection, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot 
} from "firebase/firestore";

class DocumentReferenceCompat {
  constructor(firestoreDb, collectionPath, docId) {
    this.firestoreDb = firestoreDb;
    this.collectionPath = collectionPath;
    this.docId = docId;
  }

  async get() {
    const dRef = doc(this.firestoreDb, this.collectionPath, this.docId);
    const snap = await getDoc(dRef);
    return {
      id: snap.id,
      exists: snap.exists(),
      data: () => snap.data()
    };
  }

  async set(data) {
    const dRef = doc(this.firestoreDb, this.collectionPath, this.docId);
    await setDoc(dRef, data);
  }

  async update(data) {
    const dRef = doc(this.firestoreDb, this.collectionPath, this.docId);
    await updateDoc(dRef, data);
  }

  async delete() {
    const dRef = doc(this.firestoreDb, this.collectionPath, this.docId);
    await deleteDoc(dRef);
  }

  onSnapshot(callback, errCallback) {
    const dRef = doc(this.firestoreDb, this.collectionPath, this.docId);
    return onSnapshot(dRef, snap => {
      callback({
        id: snap.id,
        exists: snap.exists(),
        data: () => snap.data()
      });
    }, err => {
      if (errCallback) errCallback(err);
    });
  }
}

class QueryCompat {
  constructor(firestoreDb, collectionPath, constraints = []) {
    this.firestoreDb = firestoreDb;
    this.collectionPath = collectionPath;
    this.constraints = constraints;
  }

  where(field, op, value) {
    return new QueryCompat(this.firestoreDb, this.collectionPath, [
      ...this.constraints,
      where(field, op, value)
    ]);
  }

  orderBy(field, direction) {
    return new QueryCompat(this.firestoreDb, this.collectionPath, [
      ...this.constraints,
      orderBy(field, direction)
    ]);
  }

  limit(n) {
    return new QueryCompat(this.firestoreDb, this.collectionPath, [
      ...this.constraints,
      limit(n)
    ]);
  }

  async get() {
    const cRef = collection(this.firestoreDb, this.collectionPath);
    const q = query(cRef, ...this.constraints);
    const snap = await getDocs(q);
    return {
      empty: snap.empty,
      size: snap.size,
      docs: snap.docs.map(d => ({
        id: d.id,
        data: () => d.data()
      }))
    };
  }

  onSnapshot(callback, errCallback) {
    const cRef = collection(this.firestoreDb, this.collectionPath);
    const q = query(cRef, ...this.constraints);
    return onSnapshot(q, snap => {
      callback({
        empty: snap.empty,
        size: snap.size,
        docs: snap.docs.map(d => ({
          id: d.id,
          data: () => d.data()
        }))
      });
    }, err => {
      if (errCallback) errCallback(err);
    });
  }
}

class CollectionReferenceCompat extends QueryCompat {
  constructor(firestoreDb, collectionPath) {
    super(firestoreDb, collectionPath, []);
  }

  doc(docId) {
    return new DocumentReferenceCompat(this.firestoreDb, this.collectionPath, docId);
  }

  async add(data) {
    const cRef = collection(this.firestoreDb, this.collectionPath);
    const dRef = await addDoc(cRef, data);
    return {
      id: dRef.id
    };
  }
}

class FirestoreCompat {
  constructor(firestoreDb) {
    this.firestoreDb = firestoreDb;
  }

  collection(collectionPath) {
    return new CollectionReferenceCompat(this.firestoreDb, collectionPath);
  }
}

// Global factory to initialize the compatible database
window.initCompatFirestore = function(config, databaseId) {
  let app;
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(config);
  } catch (e) {
    console.warn("⚠️ initCompatFirestore standard init failed, trying fallbacks:", e);
    try {
      app = getApp();
    } catch (e2) {
      try {
        app = initializeApp(config, "modular-named-app-" + Date.now());
      } catch (e3) {
        console.error("❌ All modular firebase app initialization attempts failed:", e3);
        throw e3;
      }
    }
  }
  const rawDb = getFirestore(app, databaseId);
  return new FirestoreCompat(rawDb);
};
