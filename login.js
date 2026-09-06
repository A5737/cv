import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDJKre7sGcKRSD-VyULGyBLVfc98B3lj3Y",
    authDomain: "cv-proj-419e6.firebaseapp.com",
    projectId: "cv-proj-419e6",
    storageBucket: "cv-proj-419e6.firebasestorage.app",
    messagingSenderId: "1043294028225",
    appId: "1:1043294028225:web:9f36e80b18d9127a3aef40"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const email = document.getElementById("email");
const password = document.getElementById("password");
const button = document.getElementById("loginBtn");
const status = document.getElementById("status");


button.addEventListener("click", async () => {

    if (!email.value || !password.value) {
        status.textContent = "اكتب الإيميل والباسوورد.";
        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email.value.trim(),
            password.value
        );

        window.location.href = "admin.html";

    } catch (error) {

        console.error(error);

        status.textContent =
            "بيانات الدخول غير صحيحة ❌";
    }

});