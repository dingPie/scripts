import { ServiceAccount, initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../everyone-s-refrigerator-firebase-adminsdk-tu4j7-cc6ddb059e.json";

export const firebaseApp = initializeApp({
  credential: credential.cert(serviceAccount as ServiceAccount),
});

export const firebaseAuth = getAuth(firebaseApp);
