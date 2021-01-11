const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
async function setCustomClaim(uid) {
  const auth = await admin
    .auth()
    .tenantManager()
    .authForTenant('christianlydemann-eyy6e');

  await auth.setCustomUserClaims(uid, { admin: true });
  const user = await auth.getUser(uid);

  console.log(user.customClaims);
  process.exit();
}

const uid = process.argv[2];
setCustomClaim(uid);
