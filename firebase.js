import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "mira-assistant-4fb06.firebaseapp.com",
  projectId: "mira-assistant-4fb06",
  storageBucket: "mira-assistant-4fb06.firebasestorage.app",
  messagingSenderId: "332045608089",
  appId: "1:332045608089:web:550c70086690e3a62e4408"
};

const app = initializeApp(firebaseConfig);

console.log("Firebase connected");