const admin = require('../config/firebase');

exports.register = async (req, res) => {
  try {
    const { email, password, username, fullname } = req.body;

    const user = await admin.auth().createUser({
      email,
      password,
    });

    await admin.firestore().collection('users').doc(user.uid).set({
      email,
      username,
      fullname,
      preferences: {},
      profilePhoto: ''
    });

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { idToken } = req.body;

    const decoded = await admin.auth().verifyIdToken(idToken);

    res.json({
      success: true,
      uid: decoded.uid,
      email: decoded.email,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
