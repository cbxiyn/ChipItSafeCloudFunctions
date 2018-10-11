// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");
const admin = require("firebase-admin");

//Application Name for email
const APP_NAME = "Chip-It-Safe: ECG First Aid";

// The Firebase Admin SDK to access the Firebase Realtime Database.
admin.initializeApp();

var db = admin.firestore();

/**
 * Cloud function trigger declarations
 */

exports.createUserConfig = functions.auth.user().onCreate(user => {
  // [END onCreateTrigger]
  // [START eventAttributes]
  var data = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    emailVerified: user.emailVerified,
    //TODO: Implement the datatype below
    applicationType: "Wearer",
    userAppToken: null
  };

  // [END eventAttributes]
  createRescuersDocument(user.uid);
  return createUserConfig(data);
});
exports.deleteUserConfig = functions.auth.user().onDelete(user => {
  // [END onCreateTrigger]
  // [START eventAttributes]
  // [END eventAttributes]
  return deleteUserConfig(user.uid);
});
exports.updateUserAppToken = functions.https.onRequest((req, res) => {
    return updateUserAppToken(req);
});
exports.getUserRescuers = functions.https.onRequest((req, res) => {
  console.log(req.body.timestamp);
  res.send(req.body)
});
/**
 * Cloud Functions implementations
 */

//Create user configuration for user in user config DB when user is created
function createUserConfig(data) {
   db.collection("users").doc(data.uid).set(data);
   return console.log("User config created");
}
//Delete user configuration for user in user config DB when user is deleted
function deleteUserConfig(uid) {
  db.collection("users").doc(uid).delete();
  db.collection("rescuerConfig").doc(uid).delete();
  return console.log("User config/Rescuer config deleted");
}
//Update user's application token in user's configuration file
function updateUserAppToken(req)
{
  var newUserAppToken = req.body.userAppToken;

  var DocRef = db.collection("users").doc(req.body.uid);
  console.log(req.body.uid);
  var updateUserAppTokenField = DocRef.update({userAppToken: newUserAppToken})

  return console.log("User App Token Updated");
}
//Return user's rescuer config document on database. DEFUNCT.
function getUserRescuers(req)
{
  var DocRef = db.collection("rescuerConfig").doc(req.body.uid);
  //DocRef.update({userAppToken: "test"})
  var docData = null;
  return DocRef.set({F4PkZCguydVty8Cw9WF84N5Pcba2: true});
}
//Create Rescuer config document on database
function createRescuersDocument(uid)
{
  var rescuerSchema = {
    F4PkZCguydVty8Cw9WF84N5Pcba2 : false
  }
  db.collection("rescuerConfig").doc(uid).set(rescuerSchema);
  return console.log("Rescuer schema created for user");
}
