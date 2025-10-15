import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Initialize firebase-admin from one of the following, in order of preference:
// 1. FIREBASE_SERVICE_ACCOUNT_JSON (full JSON string in env)
// 2. FIREBASE_SERVICE_ACCOUNT_PATH (path to JSON file)
// 3. ./serviceAccountKey.json file located in this backend folder
// If none are found, firebase-admin will not be initialized and callers must handle that.
if (!admin.apps.length) {
  let serviceAccount = null;

  const keyJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const keyPathEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (keyJson) {
    try {
      serviceAccount = JSON.parse(keyJson);
    } catch (err) {
      console.error(
        "Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:",
        err.message
      );
    }
  } else if (keyPathEnv) {
    try {
      const resolved = path.isAbsolute(keyPathEnv)
        ? keyPathEnv
        : path.resolve(process.cwd(), keyPathEnv);
      if (fs.existsSync(resolved)) {
        serviceAccount = JSON.parse(fs.readFileSync(resolved, "utf8"));
      } else {
        console.error(
          `FIREBASE_SERVICE_ACCOUNT_PATH is set but file not found: ${resolved}`
        );
      }
    } catch (err) {
      console.error(
        "Failed to read FIREBASE_SERVICE_ACCOUNT_PATH:",
        err.message
      );
    }
  } else {
    // try default filename in the backend folder
    try {
      const defaultPath = path.resolve(process.cwd(), "serviceAccountKey.json");
      if (fs.existsSync(defaultPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(defaultPath, "utf8"));
        console.info(
          "Loaded Firebase service account from serviceAccountKey.json"
        );
      }
    } catch (err) {
      console.error("Failed to read serviceAccountKey.json:", err.message);
    }
  }

  if (!serviceAccount) {
    console.warn(
      "FIREBASE_SERVICE_ACCOUNT_JSON not set and no service account file found; firebase-admin will not be initialized"
    );
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.info("firebase-admin initialized successfully");
    } catch (err) {
      console.error("firebase-admin initialization failed:", err.message);
    }
  }
}

export default admin;
