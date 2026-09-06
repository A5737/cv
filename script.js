import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc
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

const db = getFirestore(app);


// ==========================================
// عناصر الصفحة
// ==========================================

const appElement = document.getElementById("app");


// ==========================================
// حماية النصوص من HTML
// ==========================================

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


// ==========================================
// رابط آمن
// ==========================================

function safeURL(url) {

    if (!url) {
        return "";
    }

    try {

        const parsed = new URL(url);

        if (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        ) {
            return parsed.href;
        }

    } catch (error) {
        return "";
    }

    return "";

}


// ==========================================
// قراءة ID من الرابط
// ==========================================

const params = new URLSearchParams(
    window.location.search
);

const cvId = params.get("id");


// ==========================================
// إذا لا يوجد ID
// ==========================================

if (!cvId) {

    appElement.innerHTML = `
        <div class="message-box">
            <h1>السيرة الذاتية غير موجودة</h1>
            <p>
                رابط الـCV غير صحيح أو لا يحتوي على ID.
            </p>
        </div>
    `;

} else {

    loadCV();

}


// ==========================================
// تحميل CV
// ==========================================

async function loadCV() {

    appElement.innerHTML = `
        <div class="loading">
            جاري تحميل السيرة الذاتية...
        </div>
    `;

    try {

        const cvRef = doc(
            db,
            "cvs",
            cvId
        );

        const cvSnapshot =
            await getDoc(cvRef);


        if (!cvSnapshot.exists()) {

            appElement.innerHTML = `
                <div class="message-box">
                    <h1>السيرة الذاتية غير موجودة</h1>
                    <p>
                        لم يتم العثور على هذه السيرة الذاتية.
                    </p>
                </div>
            `;

            return;
        }


        const data =
            cvSnapshot.data();


        renderCV(data);


    } catch (error) {

        console.error(error);

        appElement.innerHTML = `
            <div class="message-box">
                <h1>حدث خطأ</h1>
                <p>
                    تعذر تحميل السيرة الذاتية.
                </p>
            </div>
        `;

    }

}


// ==========================================
// عرض CV
// ==========================================

function renderCV(data) {

    const personal =
        data.personal || {};

    const education =
        Array.isArray(data.education)
            ? data.education
            : [];

    const skills =
        Array.isArray(data.skills)
            ? data.skills
            : [];

    const experience =
        Array.isArray(data.experience)
            ? data.experience
            : [];

    const projects =
        Array.isArray(data.projects)
            ? data.projects
            : [];

    const languages =
        Array.isArray(data.languages)
            ? data.languages
            : [];

    const certificates =
        Array.isArray(data.certificates)
            ? data.certificates
            : [];


    const photoURL =
        safeURL(personal.photo);


    let html = `

        <div class="cv-wrapper">

            <header class="cv-header">

    `;


    // ======================================
    // الصورة
    // ======================================

    if (photoURL) {

        html += `

                <img
                    class="profile-photo"
                    src="${escapeHTML(photoURL)}"
                    alt="الصورة الشخصية"
                >

        `;

    } else {

        html += `

                <div class="profile-placeholder">
                    ${escapeHTML(
                        personal.name
                            ? personal.name.charAt(0)
                            : "CV"
                    )}
                </div>

        `;

    }


    html += `

                <div class="profile-info">

                    <h1>
                        ${escapeHTML(
                            personal.name || ""
                        )}
                    </h1>

                    ${
                        personal.jobTitle
                            ? `
                                <h2>
                                    ${escapeHTML(
                                        personal.jobTitle
                                    )}
                                </h2>
                            `
                            : ""
                    }

                </div>

            </header>

            <div class="cv-content">

                <aside class="cv-sidebar">

    `;


    // ======================================
    // معلومات الاتصال
    // ======================================

    if (
        personal.email ||
        personal.phone ||
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
                            href="tel:${escapeHTML(
                                personal.phone
                            )}"
                        >
                            <span>📞</span>
                            <span>
                                ${escapeHTML(
                                    personal.phone
                                )}
                            </span>
                        </a>

            `;

        }


        if (personal.email) {

            html += `

                        <a
                            class="contact-item"
                            href="mailto:${escapeHTML(
                                personal.email
                            )}"
                        >
                            <span>✉️</span>
                            <span>
                                ${escapeHTML(
                                    personal.email
                                )}
                            </span>
                        </a>

            `;

        }


        if (personal.location) {

            html += `

                        <div class="contact-item">
                            <span>
                                ${escapeHTML(
                                    personal.location
                                )}
                            </span>
                        </div>

            `;

        }


        if (personal.birthDate) {

            html += `

                        <div class="contact-item">
                            <span>
                                تاريخ الميلاد:
                                ${escapeHTML(
                                    personal.birthDate
                                )}
                            </span>
                        </div>

            `;

        }


        const instagramURL =
            safeURL(personal.instagram);

        if (instagramURL) {

            html += `

                        <a
                            class="contact-item"
                            href="${escapeHTML(
                                instagramURL
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>
                                Instagram
                            </span>
                        </a>

            `;

        }


        const telegramURL =
            safeURL(personal.telegram);

        if (telegramURL) {

            html += `

                        <a
                            class="contact-item"
                            href="${escapeHTML(
                                telegramURL
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>
                                Telegram
                            </span>
                        </a>

            `;

        }


        html += `

                    </section>

        `;

    }


    // ======================================
    // المهارات
    // ======================================

    if (skills.length > 0) {

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
                                ${escapeHTML(skill)}
                            </span>

            `;

        });


        html += `

                        </div>

                    </section>

        `;

    }


    // ======================================
    // اللغات
    // ======================================

    if (languages.length > 0) {

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
                                ${escapeHTML(language)}
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


    // ======================================
    // نبذة
    // ======================================

    if (personal.about) {

        html += `

                    <section class="cv-section">

                        <h2>
                            نبذة عني
                        </h2>

                        <p>
                            ${escapeHTML(
                                personal.about
                            )}
                        </p>

                    </section>

        `;

    }


    // ======================================
    // التعليم
    // ======================================

    if (education.length > 0) {

        html += `

                    <section class="cv-section">

                        <h2>
                            التعليم
                        </h2>

        `;


        education.forEach(item => {

            html += `

                        <div class="timeline-item">

                            ${
                                item.title
                                    ? `
                                        <h3>
                                            ${escapeHTML(
                                                item.title
                                            )}
                                        </h3>
                                    `
                                    : ""
                            }

                            ${
                                item.place ||
                                item.year
                                    ? `
                                        <div class="meta">
                                            ${escapeHTML(
                                                item.place || ""
                                            )}
                                            ${
                                                item.place &&
                                                item.year
                                                    ? " — "
                                                    : ""
                                            }
                                            ${escapeHTML(
                                                item.year || ""
                                            )}
                                        </div>
                                    `
                                    : ""
                            }

                            ${
                                item.description
                                    ? `
                                        <p>
                                            ${escapeHTML(
                                                item.description
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                        </div>

            `;

        });


        html += `

                    </section>

        `;

    }


    // ======================================
    // الخبرة
    // ======================================

    if (experience.length > 0) {

        html += `

                    <section class="cv-section">

                        <h2>
                            الخبرة المهنية
                        </h2>

        `;


        experience.forEach(item => {

            html += `

                        <div class="timeline-item">

                            ${
                                item.job
                                    ? `
                                        <h3>
                                            ${escapeHTML(
                                                item.job
                                            )}
                                        </h3>
                                    `
                                    : ""
                            }

                            ${
                                item.company ||
                                item.period
                                    ? `
                                        <div class="meta">
                                            ${escapeHTML(
                                                item.company || ""
                                            )}
                                            ${
                                                item.company &&
                                                item.period
                                                    ? " — "
                                                    : ""
                                            }
                                            ${escapeHTML(
                                                item.period || ""
                                            )}
                                        </div>
                                    `
                                    : ""
                            }

                            ${
                                item.description
                                    ? `
                                        <p>
                                            ${escapeHTML(
                                                item.description
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                        </div>

            `;

        });


        html += `

                    </section>

        `;

    }


    // ======================================
    // المشاريع
    // ======================================

    if (projects.length > 0) {

        html += `

                    <section class="cv-section">

                        <h2>
                            المشاريع
                        </h2>

        `;


        projects.forEach(item => {

            html += `

                        <div class="project-card">

                            ${
                                item.name
                                    ? `
                                        <h3>
                                            ${escapeHTML(
                                                item.name
                                            )}
                                        </h3>
                                    `
                                    : ""
                            }

                            ${
                                item.description
                                    ? `
                                        <p>
                                            ${escapeHTML(
                                                item.description
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

            `;


            const projectURL =
                safeURL(item.link);


            if (projectURL) {

                html += `

                            <a
                                href="${escapeHTML(
                                    projectURL
                                )}"
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


    // ======================================
    // الشهادات والإنجازات
    // ======================================

    if (certificates.length > 0) {

        html += `

                    <section class="cv-section">

                        <h2>
                            الشهادات والإنجازات
                        </h2>

        `;


        certificates.forEach(item => {

            html += `

                        <div class="timeline-item">

                            ${
                                item.name
                                    ? `
                                        <h3>
                                            ${escapeHTML(
                                                item.name
                                            )}
                                        </h3>
                                    `
                                    : ""
                            }

                            ${
                                item.issuer ||
                                item.year
                       