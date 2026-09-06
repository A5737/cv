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


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const appElement = document.getElementById("app");


function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function safeUrl(value) {

    try {

        const url = new URL(value);

        if (
            url.protocol === "http:" ||
            url.protocol === "https:"
        ) {
            return escapeHtml(value);
        }

    } catch (error) {}

    return "";

}


const params =
    new URLSearchParams(window.location.search);

const cvId = params.get("id");


async function loadCV() {

    if (!cvId) {

        appElement.innerHTML = `
            <div class="message-box">
                <h1>السيرة الذاتية غير محددة</h1>
                <p>الرابط غير صحيح.</p>
            </div>
        `;

        return;
    }


    try {

        const cvRef = doc(db, "cvs", cvId);
        const cvSnap = await getDoc(cvRef);


        if (!cvSnap.exists()) {

            appElement.innerHTML = `
                <div class="message-box">
                    <h1>CV غير موجود ❌</h1>
                    <p>تأكد من أن الرابط صحيح.</p>
                </div>
            `;

            return;
        }


        const cv = cvSnap.data();

        const personal = cv.personal || {};

        const education =
            Array.isArray(cv.education)
                ? cv.education
                : cv.education
                    ? [cv.education]
                    : [];

        const experience =
            Array.isArray(cv.experience)
                ? cv.experience
                : cv.experience
                    ? [cv.experience]
                    : [];

        const projects =
            Array.isArray(cv.projects)
                ? cv.projects
                : cv.project
                    ? [cv.project]
                    : [];

        const skills =
            Array.isArray(cv.skills)
                ? cv.skills
                : [];

        const languages =
            Array.isArray(cv.languages)
                ? cv.languages
                : [];

        const certificates =
            Array.isArray(cv.certificates)
                ? cv.certificates
                : [];


        document.title =
            `${personal.name || "CV"} - السيرة الذاتية`;


        // ==============================
        // الصورة
        // ==============================

        const photoUrl =
            safeUrl(personal.photo);


        const photoHTML = photoUrl

            ? `
                <img
                    src="${photoUrl}"
                    class="profile-photo"
                    alt="الصورة الشخصية"
                >
            `

            : `
                <div class="profile-placeholder">
                    ${
                        personal.name
                            ? escapeHtml(
                                personal.name.charAt(0)
                            )
                            : "CV"
                    }
                </div>
            `;


        // ==============================
        // المهارات
        // ==============================

        const skillsHTML =
            skills.length

                ? skills.map(skill => `
                    <span class="skill">
                        ${escapeHtml(skill)}
                    </span>
                `).join("")

                : `<p class="empty">غير متوفر</p>`;


        // ==============================
        // اللغات
        // ==============================

        const languagesHTML =
            languages.length

                ? languages.map(language => `
                    <li>
                        ${escapeHtml(language)}
                    </li>
                `).join("")

                : `<li>غير متوفر</li>`;


        // ==============================
        // التعليم المتعدد
        // ==============================

        const educationHTML =
            education.length

                ? `
                    <section class="cv-section">

                        <h2>🎓 التعليم</h2>

                        ${education.map(item => `

                            <div class="timeline-item">

                                ${
                                    item.title
                                        ? `
                                            <h3>
                                                ${escapeHtml(item.title)}
                                            </h3>
                                        `
                                        : ""
                                }

                                ${
                                    item.place || item.year
                                        ? `
                                            <div class="meta">

                                                ${escapeHtml(item.place)}

                                                ${
                                                    item.year
                                                        ? ` • ${escapeHtml(item.year)}`
                                                        : ""
                                                }

                                            </div>
                                        `
                                        : ""
                                }

                                ${
                                    item.description
                                        ? `
                                            <p>
                                                ${escapeHtml(item.description)}
                                            </p>
                                        `
                                        : ""
                                }

                            </div>

                        `).join("")}

                    </section>
                `

                : "";


        // ==============================
        // الخبرات المتعددة
        // ==============================

        const experienceHTML =
            experience.length

                ? `
                    <section class="cv-section">

                        <h2>💼 الخبرة المهنية</h2>

                        ${experience.map(item => `

                            <div class="timeline-item">

                                ${
                                    item.job
                                        ? `
                                            <h3>
                                                ${escapeHtml(item.job)}
                                            </h3>
                                        `
                                        : ""
                                }

                                ${
                                    item.company || item.period
                                        ? `
                                            <div class="meta">

                                                ${escapeHtml(item.company)}

                                                ${
                                                    item.period
                                                        ? ` • ${escapeHtml(item.period)}`
                                                        : ""
                                                }

                                            </div>
                                        `
                                        : ""
                                }

                                ${
                                    item.description
                                        ? `
                                            <p>
                                                ${escapeHtml(item.description)}
                                            </p>
                                        `
                                        : ""
                                }

                            </div>

                        `).join("")}

                    </section>
                `

                : "";


        // ==============================
        // المشاريع المتعددة
        // ==============================

        const projectsHTML =
            projects.length

                ? `
                    <section class="cv-section">

                        <h2>📁 المشاريع</h2>

                        ${projects.map(item => {

                            const link =
                                safeUrl(item.link);

                            return `

                                <div class="project-card">

                                    ${
                                        item.name
                                            ? `
                                                <h3>
                                                    ${escapeHtml(item.name)}
                                                </h3>
                                            `
                                            : ""
                                    }

                                    ${
                                        item.description
                                            ? `
                                                <p>
                                                    ${escapeHtml(item.description)}
                                                </p>
                                            `
                                            : ""
                                    }

                                    ${
                                        link
                                            ? `
                                                <a
                                                    href="${link}"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    عرض المشروع ↗
                                                </a>
                                            `
                                            : ""
                                    }

                                </div>

                            `;

                        }).join("")}

                    </section>
                `

                : "";


        // ==============================
        // الشهادات والإنجازات
        // ==============================

        const certificatesHTML =
            certificates.length

                ? `
                    <section class="cv-section">

                        <h2>🏆 الشهادات والإنجازات</h2>

                        ${certificates.map(item => {

                            const link =
                                safeUrl(item.link);

                            return `

                                <div class="timeline-item">

                                    ${
                                        item.name
                                            ? `
                                                <h3>
                                                    ${escapeHtml(item.name)}
                                                </h3>
                                            `
                                            : ""
                                    }

                                    ${
                                        item.issuer || item.year
                                            ? `
                                                <div class="meta">

                                                    ${escapeHtml(item.issuer)}

                                                    ${
                                                        item.year
                                                            ? ` • ${escapeHtml(item.year)}`
                                                            : ""
                                                    }

                                                </div>
                                            `
                                            : ""
                                    }

                                    ${
                                        link
                                            ? `
                                                <a
                                                    href="${link}"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    عرض الشهادة ↗
                                                </a>
                                            `
                                            : ""
                                    }

                                </div>

                            `;

                        }).join("")}

                    </section>
                `

                : "";


        // ==============================
        // التواصل
        // ==============================

        let contactHTML = "";


        if (personal.email) {

            contactHTML += `
                <a
                    href="mailto:${escapeHtml(personal.email)}"
                    class="contact-item"
                >
                    ✉️
                    <span>
                        ${escapeHtml(personal.email)}
                    </span>
                </a>
            `;

        }


        if (personal.phone) {

            contactHTML += `
                <a
                    href="tel:${escapeHtml(personal.phone)}"
                    class="contact-item"
                >
                    📞
                    <span>
                        ${escapeHtml(personal.phone)}
                    </span>
                </a>
            `;

        }


        if (personal.location) {

            contactHTML += `
                <div class="contact-item">
                    📍
                    <span>
                        ${escapeHtml(personal.location)}
                    </span>
                </div>
            `;

        }


        if (personal.linkedin) {

            const url =
                safeUrl(personal.linkedin);

            if (url) {

                contactHTML += `
                    <a
                        href="${url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="contact-item"
                    >
                        in
                        <span>LinkedIn</span>
                    </a>
                `;

            }

        }


        if (personal.github) {

            const url =
                safeUrl(personal.github);

            if (url) {

                contactHTML += `
                    <a
                        href="${url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="contact-item"
                    >
                        ◉
                        <span>GitHub</span>
                    </a>
                `;

            }

        }


        if (personal.portfolio) {

            const url =
                safeUrl(personal.portfolio);

            if (url) {

                contactHTML += `
                    <a
                        href="${url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="contact-item"
                    >
                        🌐
                        <span>الموقع الشخصي</span>
                    </a>
                `;

            }

        }


        // ==============================
        // عرض الـCV
        // ==============================

        appElement.innerHTML = `

            <div class="cv-wrapper">


                <header class="cv-header">

                    ${photoHTML}

                    <div class="profile-info">

                        <h1>
                            ${escapeHtml(
                                personal.name ||
                                "بدون اسم"
                            )}
                        </h1>

                        ${
                            personal.jobTitle
                                ? `
                                    <h2>
                                        ${escapeHtml(
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


                        ${
                            contactHTML
                                ? `
                                    <section class="side-section">

                                        <h3>
                                            معلومات التواصل
                                        </h3>

                                        ${contactHTML}

                                    </section>
                                `
                                : ""
                        }


                        <section class="side-section">

                            <h3>
                                المهارات
                            </h3>

                            <div class="skills">
                                ${skillsHTML}
                            </div>

                        </section>


                        ${
                            languages.length
                                ? `
                                    <section class="side-section">

                                        <h3>
                                            اللغات
                                        </h3>

                                        <ul class="languages">
                                            ${languagesHTML}
                                        </ul>

                                    </section>
                                `
                                : ""
                        }


                    </aside>


                    <section class="cv-main">


                        ${
                            personal.about
                                ? `
                                    <section class="cv-section">

                                        <h2>
                                            نبذة عني
                                        </h2>

                                        <p>
                                            ${escapeHtml(
                                                personal.about
                                            )}
                                        </p>

                                    </section>
                