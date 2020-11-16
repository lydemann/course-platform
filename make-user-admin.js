const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
async function setCustomClaim(uid) {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    
    const user = await admin.auth().getUser(uid);
    
    console.log(user.customClaims);
    process.exit();
}

const uid = process.argv[2];
setCustomClaim(uid);
