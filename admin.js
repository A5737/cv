import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ==========================================
// Firebase
// ==========================================

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
const db = getFirestore(app);


// ==========================================
// حماية لوحة الإدارة
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
    }

});


// ==========================================
// إضافة عنصر ديناميكي
// ==========================================

function addDynamicItem(listId, html) {

    const list = document.getElementById(listId);

    const item = document.createElement("div");

    item.className = "dynamic-item";

    item.innerHTML = html;

    list.appendChild(item);

}


// ==========================================
// التعليم
// ==========================================

document
    .getElementById("addEducation")
    .addEventListener("click", () => {

        addDynamicItem(
            "educationList",

            `
            <button
                type="button"
                class="remove-button"
            >
                حذف
            </button>

            <input
                class="education-title"
                placeholder="الشهادة / التخصص"
            >

            <input
                class="education-place"
                placeholder="المدرسة / الجامعة"
            >

            <input
                class="education-year"
                placeholder="سنة التخرج"
            >

            <textarea
                class="education-description"
                placeholder="وصف إضافي (اختياري)"
            ></textarea>
            `
        );

    });


// ==========================================
// الخبرة
// ==========================================

document
    .getElementById("addExperience")
    .addEventListener("click", () => {

        addDynamicItem(
            "experienceList",

            `
            <button
                type="button"
                class="remove-button"
            >
                حذف
            </button>

            <input
                class="experience-job"
                placeholder="المسمى الوظيفي"
            >

            <input
                class="experience-company"
                placeholder="اسم الشركة"
            >

            <input
                class="experience-period"
                placeholder="الفترة"
            >

            <textarea
                class="experience-description"
                placeholder="وصف الخبرة"
            ></textarea>
            `
        );

    });


// ==========================================
// المشاريع
// ==========================================

document
    .getElementById("addProject")
    .addEventListener("click", () => {

        addDynamicItem(
            "projectList",

            `
            <button
                type="button"
                class="remove-button"
            >
                حذف
            </button>

            <input
                class="project-name"
                placeholder="اسم المشروع"
            >

            <input
                class="project-link"
                placeholder="رابط المشروع (اختياري)"
            >

            <textarea
                class="project-description"
                placeholder="وصف المشروع"
            ></textarea>
            `
        );

    });


// ==========================================
// الشهادات
// ==========================================

document
    .getElementById("addCertificate")
    .addEventListener("click", () => {

        addDynamicItem(
            "certificateList",

            `
            <button
                type="button"
                class="remove-button"
            >
                حذف
            </button>

            <input
                class="certificate-name"
                placeholder="اسم الشهادة / الإنجاز"
            >

            <input
                class="certificate-issuer"
                placeholder="الجهة المانحة"
            >

            <input
                class="certificate-year"
                placeholder="السنة"
            >

            <input
                class="certificate-link"
                placeholder="رابط الشهادة (اختياري)"
            >
            `
        );

    });


// ==========================================
// حذف العناصر
// ==========================================

document.addEventListener("click", (event) => {

    if (
        event.target.classList.contains(
            "remove-button"
        )
    ) {

        const item =
            event.target.closest(
                ".dynamic-item"
            );

        if (item) {
            item.remove();
        }

    }

});


// ==========================================
// قراءة التعليم
// ==========================================

function getEducation() {

    return [
        ...document.querySelectorAll(
            "#educationList .dynamic-item"
        )
    ]

    .map(item => ({

        title:
            item.querySelector(
                ".education-title"
            )?.value.trim() || "",

        place:
            item.querySelector(
                ".education-place"
            )?.value.trim() || "",

        year:
            item.querySelector(
                ".education-year"
            )?.value.trim() || "",

        description:
            item.querySelector(
                ".education-description"
            )?.value.trim() || ""

    }))

    .filter(item =>
        item.title ||
        item.place ||
        item.year ||
        item.description
    );

}


// ==========================================
// قراءة الخبرة
// ==========================================

function getExperience() {

    return [
        ...document.querySelectorAll(
            "#experienceList .dynamic-item"
        )
    ]

    .map(item => ({

        job:
            item.querySelector(
                ".experience-job"
            )?.value.trim() || "",

        company:
            item.querySelector(
                ".experience-company"
            )?.value.trim() || "",

        period:
            item.querySelector(
                ".experience-period"
            )?.value.trim() || "",

        description:
            item.querySelector(
                ".experience-description"
            )?.value.trim() || ""

    }))

    .filter(item =>
        item.job ||
        item.company ||
        item.period ||
        item.description
    );

}


// ==========================================
// قراءة المشاريع
// ==========================================

function getProjects() {

    return [
        ...document.querySelectorAll(
            "#projectList .dynamic-item"
        )
    ]

    .map(item => ({

        name:
            item.querySelector(
                ".project-name"
            )?.value.trim() || "",

        link:
            item.querySelector(
                ".project-link"
            )?.value.trim() || "",

        description:
            item.querySelector(
                ".project-description"
            )?.value.trim() || ""

    }))

    .filter(item =>
        item.name ||
        item.link ||
        item.description
    );

}


// ==========================================
// قراءة الشهادات
// ==========================================

function getCertificates() {

    return [
        ...document.querySelectorAll(
            "#certificateList .dynamic-item"
        )
    ]

    .map(item => ({

        name:
            item.querySelector(
                ".certificate-name"
            )?.value.trim() || "",

        issuer:
            item.querySelector(
                ".certificate-issuer"
            )?.value.trim() || "",

        year:
            item.querySelector(
                ".certificate-year"
            )?.value.trim() || "",

        link:
            item.querySelector(
                ".certificate-link"
            )?.value.trim() || ""

    }))

    .filter(item =>
        item.name ||
        item.issuer ||
        item.year ||
        item.link
    );

}


// ==========================================
// إنشاء CV
// ==========================================

document
    .getElementById("createBtn")
    .addEventListener("click", async () => {

        const result =
            document.getElementById("result");

        const name =
            document
                .getElementById("name")
                .value
                .trim();


        if (!name) {

            result.textContent =
                "اكتب اسم الشخص أولًا.";

            return;

        }


        const cvData = {

            personal: {

                name,

                jobTitle:
                    document
                        .getElementById("jobTitle")
                        .value
                        .trim(),

                about:
                    document
                        .getElementById("about")
                        .value
                        .trim(),

                photo:
                    document
                        .getElementById("photo")
                        .value
                        .trim(),

                email:
                    document
                        .getElementById("cvEmail")
                        .value
                        .trim(),

                phone:
                    document
                        .getElementById("phone")
                        .value
                        .trim(),

                location:
                    document
                        .getElementById("location")
                        .value
                        .trim(),

                linkedin:
                    document
                        .getElementById("linkedin")
                        .value
                        .trim(),

                github:
                    document
                        .getElementById("github")
                        .value
                        .trim(),

                portfolio:
                    document
                        .getElementById("portfolio")
                        .value
                        .trim()

            },


            education:
                getEducation(),


            skills:
                document
                    .getElementById("skills")
                    .value
                    .split(",")

                    .map(skill =>
                        skill.trim()
                    )

                    .filter(skill =>
                        skill !== ""
                    ),


            experience:
                getExperience(),


            projects:
                getProjects(),


            languages:
                document
                    .getElementById("languages")
                    .value
                    .split("\n")

                    .map(language =>
                        language.trim()
                    )

                    .filter(language =>
                        language !== ""
                    ),


            certificates:
                getCertificates(),


            createdAt:
                serverTimestamp()

        };


        try {

            result.textContent =
                "جاري إنشاء الـCV...";


            const docRef =
                await addDoc(
                    collection(db, "cvs"),
                    cvData
                );


            // ==================================
            // رابط GitHub Pages الصحيح
            // ==================================

            const basePath =
                window.location.pathname
                    .replace(
                        /\/admin\.html$/,
                        "/"
                    );


            const cvLink =
                `${window.location.origin}${basePath}?id=${docRef.id}`;


            result.innerHTML = `

                <strong>
                    تم إنشاء الـCV بنجاح ✅
                </strong>

                <br><br>

                <strong>
                    ID:
                </strong>

                ${docRef.id}

                <br><br>

                <strong>
                    رابط الـCV:
                </strong>

                <br>

                <a
                    href="${cvLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${cvLink}
                </a>

                <br><br>

                <button
                    id="copyLinkBtn"
                    type="button"
                >
                    نسخ الرابط 📋
                </button>

            `;


            document
                .getElementById("copyLinkBtn")
                .addEventListener(
                    "click",
                    async () => {

                        try {

                            await navigator.clipboard
                                .writeText(cvLink);

                            document
                                .getElementById(
                                    "copyLinkBtn"
                                )
                                .textContent =
                                "تم نسخ الرابط ✅";

                        } catch (error) {

                            console.error(error);

                        }

                    }
                );


        } catch (error) {

            console.error(error);

            result.textContent =
                "حدث خطأ أثناء إنشاء الـCV ❌";

        }

    });


// ==========================================
// تسجيل الخروج
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.href =
                "login.html";

        } catch (error) {

            console.error(error);

        }

    });