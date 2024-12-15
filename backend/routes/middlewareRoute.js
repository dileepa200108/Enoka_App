import admin from 'firebase-admin';
import serviceAccount from '../firebase/crb2k18-firebase-adminsdk-cqhpc-3aa248d8cc.json';
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(serviceAccount), // Or use a service account
});

const validateFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // Verify token
    req.user = decodedToken; // Attach user data to the request object
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
export default validateFirebaseToken;
