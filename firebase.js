const firebaseConfig = {
  apiKey: "AIzaSyB4WNf-cAxz2FIR2eYyE2GtvYtcXqklVj8",
  authDomain: "mira-assistant-4fb06.firebaseapp.com",
  projectId: "mira-assistant-4fb06",
  storageBucket: "mira-assistant-4fb06.firebasestorage.app",
  messagingSenderId: "332045608089",
  appId: "1:332045608089:web:550c70086690e3a62e4408"
};
firebase.initializeApp(firebaseConfig);

window.auth = firebase.auth();

window.provider =
    new firebase.auth.GoogleAuthProvider();