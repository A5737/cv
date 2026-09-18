import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDJKre7sGcKRSD-VyULGyBLVfc98B3lj3Y",
    authDomain: "cv-proj-419e6.firebaseapp.com",
    projectId: "cv-proj-419e6",
    storageBucket: "cv-proj-419e6.firebasestorage.app",
    messagingSenderId: "1043294028225",
    appId: "1:1043294028225:web:9f36e80b18d9127a3aef40"
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const appElement = document.getElementById("app");


function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getURL(url) {

    if (!url) {
        return "";
    }

    try {

        const test = new URL(url);

        if (
            test.protocol === "https:" ||
            test.protocol === "http:"
        ) {
            return test.href;
        }

    } catch (error) {
        return "";
    }

    return "";
}


function text(value) {
    return escapeHTML(value || "");
}


// ==========================================
// قراءة ID
// ==========================================

const urlParams = new URLSearchParams(
    window.location.search
);

const cvId = urlParams.get("id");


if (!cvId) {

    appElement.innerHTML = `
        <div class="message-box">
            <h1>السيرة الذاتية غير محددة</h1>
            <p>الرابط لا يحتوي على ID صحيح.</p>
        </div>
    `;

} else {

    loadCV();

}


// ==========================================
// تحميل CV
// ==========================================

async function loadCV() {

    try {

        appElement.innerHTML = `
            <div class="loading">
                جاري تحميل السيرة الذاتية...
            </div>
        `;


        console.log("CV ID:", cvId);


        const cvRef = doc(
            db,
            "cvs",
            cvId
        );


        console.log("Firestore document:", cvRef);


        const snapshot = await getDoc(cvRef);


        console.log("CV snapshot received");


        if (!snapshot.exists()) {

            appElement.innerHTML = `
                <div class="message-box">
                    <h1>السيرة الذاتية غير موجودة</h1>
                    <p>
                        لم نجد CV بهذا الـID:
                    </p>
                    <p>
                        ${text(cvId)}
                    </p>
                </div>
            `;

            return;
        }


        const data = snapshot.data();

        console.log("CV data:", data);


        renderCV(data);


    } catch (error) {

        console.error("CV ERROR:", error);


        appElement.innerHTML = `
            <div class="message-box">

                <h1>حدث خطأ أثناء تحميل الـCV</h1>

                <p>
                    ${text(error.message)}
                </p>

                <br>

                <p>
                    Error code:
                    ${text(error.code)}
                </p>

            </div>
        `;

    }

}


// ==========================================
// عرض CV
// ==========================================

function renderCV(data) {

    const personal = data.personal || {};

    const education = Array.isArray(data.education)
        ? data.education
        : [];

    const skills = Array.isArray(data.skills)
        ? data.skills
        : [];

    const experience = Array.isArray(data.experience)
        ? data.experience
        : [];

    const projects = Array.isArray(data.projects)
        ? data.projects
        : [];

    const languages = Array.isArray(data.languages)
        ? data.languages
        : [];

    const certificates = Array.isArray(data.certificates)
        ? data.certificates
        : [];


    let html = `

        <div class="cv-wrapper">

            <header class="cv-header">
    `;


    // الصورة

    const photo = getURL(personal.photo);


    if (photo) {

        html += `
                <img
                    class="profile-photo"
                    src="${text(photo)}"
                    alt="الصورة الشخصية"
                >
        `;

    } else {

        const firstLetter =
            personal.name
                ? personal.name.charAt(0)
                : "CV";

        html += `
                <div class="profile-placeholder">
                    ${text(firstLetter)}
                </div>
        `;

    }


    html += `

                <div class="profile-info">

                    <h1>
                        ${text(personal.name)}
                    </h1>

    `;


    if (personal.jobTitle) {

        html += `
                    <h2>
                        ${text(personal.jobTitle)}
                    </h2>
        `;

    }


    html += `

                </div>

            </header>

            <div class="cv-content">

                <aside class="cv-sidebar">

    `;


    // ==========================================
    // معلومات التواصل
    // ==========================================

    if (
        personal.phone ||
        personal.email ||
        personal.location ||
        personal.birthDate ||
        personal.instagram ||
        personal.telegram
    ) {

        html += `

                    <section class="side-section">

                        <h3>
                            معلومات التواصل
                        </h3>

        `;


        if (personal.phone) {

            html += `

                        <a
                            class="contact-item"
                            href="tel:${text(personal.phone)}"
                        >
                            <span>📞</span>
                            <span>
                                ${text(personal.phone)}
                            </span>
                        </a>

            `;

        }


        if (personal.email) {

            html += `

                        <a
                            class="contact-item"
                            href="mailto:${text(personal.email)}"
                        >
                            <span>✉️</span>
                            <span>
                                ${text(personal.email)}
                            </span>
                        </a>

            `;

        }


        if (personal.location) {

            html += `

                        <div class="contact-item">
                            ${text(personal.location)}
                        </div>

            `;

        }


        if (personal.birthDate) {

            html += `

                        <div class="contact-item">
                            تاريخ الميلاد:
                            ${text(personal.birthDate)}
                        </div>

            `;

        }


        const instagram =
            getURL(personal.instagram);


        if (instagram) {

            html += `

                        <a
                            class="contact-item"
                            href="${text(instagram)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </a>

            `;

        }


        const telegram =
            getURL(personal.telegram);


        if (telegram) {

            html += `

                        <a
                            class="contact-item"
                            href="${text(telegram)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Telegram
                        </a>

            `;

        }


        html += `

                    </section>

        `;

    }


    // ==========================================
    // المهارات
    // ==========================================

    if (skills.length) {

        html += `

                    <section class="side-section">

                        <h3>
                            المهارات
                        </h3>

                        <div class="skills">

        `;


        skills.forEach(skill => {

            html += `
                            <span class="skill">
                                ${text(skill)}
                            </span>
            `;

        });


        html += `

                        </div>

                    </section>

        `;

    }


    // ==========================================
    // اللغات
    // ==========================================

    if (languages.length) {

        html += `

                    <section class="side-section">

                        <h3>
                            اللغات
                        </h3>

                        <ul class="languages">

        `;


        languages.forEach(language => {

            html += `
                            <li>
                                ${text(language)}
                            </li>
            `;

        });


        html += `

                        </ul>

                    </section>

        `;

    }


    html += `

                </aside>

                <main class="cv-main">

    `;


    // ==========================================
    // نبذة
    // ==========================================

    if (personal.about) {

        html += `

                    <section class="cv-section">

                        <h2>
                            نبذة عني
                        </h2>

                        <p>
                            ${text(personal.about)}
                        </p>

                    </section>

        `;

    }


    // ==========================================
    // التعليم
    // ==========================================

    if (education.length) {

        html += `

                    <section class="cv-section">

                        <h2>
                            التعليم
                        </h2>

        `;


        education.forEach(item => {

            html += `

                        <div class="timeline-item">

            `;


            if (item.title) {

                html += `
                            <h3>
                                ${text(item.title)}
                            </h3>
                `;

            }


            if (item.place || item.year) {

                html += `
                            <div class="meta">

                                ${text(item.place)}

                                ${
                                    item.place && item.year
                                        ? " — "
                                        : ""
                                }

                                ${text(item.year)}

                            </div>
                `;

            }


            if (item.description) {

                html += `
                            <p>
                                ${text(item.description)}
                            </p>
                `;

            }


            html += `

                        </div>

            `;

        });


        html += `

                    </section>

        `;

    }


    // ==========================================
    // الخبرة
    // ==========================================

    if (experience.length) {

        html += `

                    <section class="cv-section">

                        <h2>
                            الخبرة المهنية
                        </h2>

        `;


        experience.forEach(item => {

            html += `

                        <div class="timeline-item">

            `;


            if (item.job) {

                html += `
                            <h3>
                                ${text(item.job)}
                            </h3>
                `;

            }


            if (item.company || item.period) {

                html += `
                            <div class="meta">

                                ${text(item.company)}

                                ${
                                    item.company && item.period
                                        ? " — "
                                        : ""
                                }

                                ${text(item.period)}

                            </div>
                `;

            }


            if (item.description) {

                html += `
                            <p>
                                ${text(item.description)}
                            </p>
                `;

            }


            html += `

                        </div>

            `;

        });


        html += `

                    </section>

        `;

    }


    // ==========================================
    // المشاريع
    // ==========================================

    if (projects.length) {

        html += `

                    <section class="cv-section">

                        <h2>
                            المشاريع
                        </h2>

        `;


        projects.forEach(item => {

            html += `

                        <div class="project-card">

            `;


            if (item.name) {

                html += `
                            <h3>
                                ${text(item.name)}
                            </h3>
                `;

            }


            if (item.description) {

                html += `
                            <p>
                                ${text(item.description)}
                            </p>
                `;

            }


            const projectURL =
                getURL(item.link);


            if (projectURL) {

                html += `
                            <a
                                href="${text(projectURL)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                عرض المشروع
                            </a>
                `;

            }


            html += `

                        </div>

            `;

        });


        html += `

                    </section>

        `;

    }


    // ==========================================
    // الشهادات
    // ==========================================

    if (certificates.length) {

        html += `

                    <section class="cv-section">

                        <h2>
                            الشهادات والإنجازات
                        </h2>

        `;


        certificates.forEach(item => {

            html += `

                        <div class="timeline-item">

            `;


            if (item.name) {

                html += `
                            <h3>
                                ${text(item.name)}
                            </h3>
                `;

            }


            if (item.issuer || item.year) {

                html += `
                            <div class="meta">

                                ${text(item.issuer)}

                                ${
                                    item.issuer && item.year
                                        ? " — "
                                        : ""
                                }

                                ${text(item.year)}

                            </div>
                `;

            }


            const certificateURL =
                getURL(item.link);


            if (certificateURL) {

                html += `
                            <a
                                href="${text(certificateURL)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                عرض الشهادة
                            </a>
                `;

            }


            html += `

                        </div>

            `;

        });


        html += `

                    </section>

        `;

    }


    // ==========================================
    // زر الطباعة
    // ==========================================

    html += `

                    <div class="cv-actions">

                        <button
                            class="print-button"
                            type="button"
                            onclick="window.print()"
                        >
                            طباعة / حفظ PDF
                        </button>

                    </div>

                </main>

            </div>

        </div>

    `;


    appElement.innerHTML = html;

}