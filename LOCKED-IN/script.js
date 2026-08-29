console.log("LOCKED IN iniciado...");

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            document
                .getElementById(
                    "splashScreen"
                )
                .style.display =
                "none";

        }, 4000);

    }
);

/* RELOJ */

function updateClock() {

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    const time = `${hours}:${minutes}:${seconds}`;

    document.getElementById("clock").innerText = time;
}

setInterval(updateClock, 1000);

updateClock();

let summary = "";
let currentFileName = "Documento";


const goalButtons =
    document.querySelectorAll(".goal-btn");

const memoryRepeats =
    document.getElementById("memoryRepeats");

memoryRepeats.addEventListener(
    "change",
    () => {

        totalReviews =
            parseInt(memoryRepeats.value);

        console.log(
            "Repasos seleccionados:",
            totalReviews
        );

    }
);

goalButtons.forEach(button => {

    button.addEventListener("click", () => {

        goal =
            parseInt(button.innerText);

        console.log(
            "Objetivo seleccionado:",
            goal
        );

    });

});


let flashcardsContainer;

const questions = [];

let flashcards = [];

let currentFlashcard = 0;
let currentReview = 1;
let totalReviews = 1;

let goal = 10;

let currentQuestion = 0;

let streak = 0;

let documentText = "";

/* ELEMENTOS */

const questionText = document.getElementById("question");

const answerInput = document.getElementById("answerInput");

const submitAnswer = document.getElementById("submitAnswer");

const streakText = document.getElementById("streak");

const progressBar = document.getElementById("progressBar");

function showFlashcard() {

    if (flashcards.length === 0) {

        flashcardsContainer.innerHTML = `
            <div class="flashcard-empty">
                <h2>No flashcards available</h2>
            </div>
        `;

        return;
    }

    const card = flashcards[currentFlashcard];

    flashcardsContainer.innerHTML = `

        <div class="flashcard-scene">

            <div class="flashcard-card" id="activeFlashcard">

                <div class="flashcard-face flashcard-front">

                    <div class="flashcard-number">

    REVIEW ${currentReview}
    <span>OF ${totalReviews}</span>

</div>

<div class="flashcard-counter">

    CARD ${currentFlashcard + 1}
    /
    ${flashcards.length}

</div>

                    <div class="flashcard-label">
                        QUESTION
                    </div>

                    <div class="flashcard-question">
                        ${card.front}
                    </div>

                    <button
                        class="flashcard-action"
                        id="showAnswerBtn">

                        ↻ REVEAL ANSWER

                    </button>

                </div>


                <div class="flashcard-face flashcard-back">

                    <div class="flashcard-label">
                        ANSWER
                    </div>

                    <div class="flashcard-answer">
                        ${card.back}
                    </div>

                    <button
                        class="flashcard-action next-button"
                        id="nextFlashcard">

                        NEXT →

                    </button>

                </div>

            </div>

        </div>

        <div class="flashcard-progress">

            <div class="flashcard-progress-text">

                ${currentFlashcard + 1}
                /
                ${flashcards.length}

            </div>

        </div>

    `;
}

/* MOSTRAR PREGUNTA */

function loadQuestion() {

    questionText.innerText =
        questions[currentQuestion].question;

    answerInput.value = "";
}

/* BOTÓN ENTER */

const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {

    const music =
        document.getElementById("bgMusic");

    music.volume = 0.3;

    music.play()
        .then(() => {

            console.log("Musica iniciada");

        })
        .catch((error) => {

            console.log("Error de audio:", error);

        });

    const lockedScreen = document.getElementById("lockedScreen");

    lockedScreen.classList.add("active");

    const readyBtn =
        document.getElementById("readyBtn");

    readyBtn.addEventListener("click", () => {

        lockedScreen.style.display = "none";

        document
            .getElementById("summaryScreen")
            .style.display = "flex";

        document
            .getElementById("summaryContent")
            .innerText =
            summary;

    });

    /* VERIFICAR */

    submitAnswer.addEventListener("click", () => {

        function normalizeText(text) {

            return text
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[.,!?;:¿¡'"“”‘’()[\]{}]/g, "")
                .replace(/\s+/g, " ")
                .trim();
        }

        const userAnswer =
            normalizeText(answerInput.value);

        const currentQuestionData =
            questions[currentQuestion];

        const possibleAnswers = [
            currentQuestionData.answer,
            ...(currentQuestionData.acceptedAnswers || [])
        ].map(answer =>
            normalizeText(answer)
        );

        const isCorrect =
            possibleAnswers.includes(userAnswer);

        if (isCorrect) {

            streak++;

            streakText.innerText = streak;

            progressBar.style.width =
                (streak / goal) * 100 + "%";

            if (streak >= goal) {

                document
                    .getElementById("quizContainer")
                    .classList.remove("active");

                const resultsScreen =
                    document.getElementById("resultsScreen");

                resultsScreen.style.display = "flex";

                document
                    .getElementById("finalGoalNumber")
                    .innerText = goal;

                document
                    .getElementById("finalScoreNumber")
                    .innerText = streak;

                document
                    .getElementById("resultGoal")
                    .innerText = goal;

                document
                    .getElementById("resultCorrect")
                    .innerText = streak;

                document
                    .getElementById("resultStreak")
                    .innerText = streak;

                const accuracy =
                    Math.round((streak / goal) * 100);

                document
                    .getElementById("resultAccuracy")
                    .innerText =
                    accuracy + "%";

                return;
            }

            currentQuestion++;

            if (currentQuestion >= questions.length) {

                currentQuestion = 0;
            }

            loadQuestion();
        }
        else {

            streak = 0;

            streakText.innerText = streak;

            progressBar.style.width = "0%";

            document.body.classList.add("shake");

            setTimeout(() => {

                document.body.classList.remove("shake");

            }, 400);
        }

    });

});

const fileInput =
    document.getElementById("fileInput");

console.log(fileInput);

function enviarDocumento(text) {
    flashcardsContainer =
        document.getElementById("flashcardsScreen");

    documentText = text;

    fetch(
        "https://plasma-api.onrender.com/api/Plasma/analizar",
        {
            method: "POST",
            headers:
            {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify({
                documento: text
            })
        }
    )

        .then(async response => {

            const text = await response.text();

            console.log("RESPUESTA DEL SERVIDOR:");
            console.log(text);

            if (!response.ok) {
                throw new Error(text);
            }

            return JSON.parse(text);

        })

        .then(data => {

            console.log("RESPUESTA PLASMA:");
            console.log(data);

            summary =
                data.summary;



            data.questions.forEach(q => {

                questions.push({
                    question: q.question,

                    answer:
                        q.answer
                            .toLowerCase()
                            .trim(),

                    acceptedAnswers:
                        (q.acceptedAnswers || [])
                            .map(answer =>
                                answer
                                    .toLowerCase()
                                    .trim()
                            )
                });

            });

            data.flashcards.forEach(card => {

                flashcards.push({
                    front: card.question,
                    back: card.answer
                });

            });

            currentFlashcard = 0;

            if (flashcards.length > 0) {
                showFlashcard();
            }

            fileStatus.innerText =
                "Archivo analizado por Plasma | " +
                questions.length +
                " preguntas";

            const answerButtons =
                document.querySelectorAll(".showAnswer");

            document.addEventListener("click", (event) => {

                if (event.target.id === "showAnswerBtn") {

                    const card =
                        document.getElementById(
                            "activeFlashcard"
                        );

                    card.classList.add("flipped");

                }
                if (event.target.id === "nextFlashcard") {

                    if (event.target.id === "nextFlashcard") {

                        currentFlashcard++;

                        if (currentFlashcard < flashcards.length) {

                            showFlashcard();

                            return;

                        }

                        if (currentReview < totalReviews) {

                            currentReview++;

                            currentFlashcard = 0;

                            console.log(
                                `Comenzando repaso ${currentReview} de ${totalReviews}`
                            );

                            showFlashcard();

                            return;

                        }

                        flashcardsContainer.innerHTML = `

        <div class="flashcard-complete">

            <div class="completion-icon">
                ✓
            </div>

            <h2>
                FLASHCARDS COMPLETED
            </h2>

            <p>
                ${totalReviews} review${totalReviews > 1 ? "s" : ""}
                completed
            </p>

            <button id="startQuizBtn">
                START QUIZ →
            </button>

        </div>

    `;

                    }

                }

                if (event.target.id === "startQuizBtn") {

                    document
                        .getElementById("flashcardsScreen")
                        .style.display = "none";

                    document
                        .getElementById("quizContainer")
                        .classList.add("active");

                    console.log(questions);

                    currentQuestion = 0;

                    loadQuestion();

                }

            });

        })

        .catch(error => {

            console.log("ERROR PLASMA");

            console.error(error);

        });
}

fileInput.addEventListener("change", (event) => {

    const file =
        event.target.files[0];

    currentFileName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[<>:"/\\|?*]+/g, "")
        .trim();

    console.log(file.name);
    console.log(file.type);

    if (!file) {
        return;
    }

    const reader =
        new FileReader();


    reader.onload = function (e) {

        flashcardsContainer =
            document.getElementById("flashcardsScreen");

        const text =
            e.target.result;

        const cleanText =
            text
                .replace(/\r\n/g, " ")
                .replace(/\n/g, " ")
                .replace(/\s+/g, " ");

        documentText = text;

        enviarDocumento(text);

        fileStatus.innerText =
            "Archivo cargado | " +
            text.length +
            " caracteres";

        console.log(questions);


        console.log("FLASHCARDS:");
        console.log(flashcards);

        flashcardsContainer.innerHTML = "";




        fileStatus.innerText +=
            " | " +
            questions.length +
            " preguntas generadas";

        console.log(text);
    };

    if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        file.arrayBuffer()
            .then(buffer => {
                return mammoth.extractRawText({
                    arrayBuffer: buffer
                });
            })
            .then(result => {

                const text =
                    result.value;

                console.log(text);

                enviarDocumento(text);

            });
    }
    else if (
        file.type ===
        "application/pdf"
    ) {
        const reader =
            new FileReader();

        reader.onload =
            async function () {
                const typedarray =
                    new Uint8Array(
                        reader.result
                    );

                const pdf =
                    await pdfjsLib
                        .getDocument(
                            typedarray
                        )
                        .promise;

                let text = "";

                for (
                    let i = 1;
                    i <= pdf.numPages;
                    i++
                ) {
                    const page =
                        await pdf.getPage(i);

                    const content =
                        await page.getTextContent();

                    text +=
                        content.items
                            .map(
                                item => item.str
                            )
                            .join(" ");

                    text += "\n";
                }

                console.log(text);

                enviarDocumento(text);
            };

        reader.readAsArrayBuffer(file);
    }
    else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
        file.arrayBuffer()
            .then(async buffer => {

                const zip =
                    await JSZip.loadAsync(buffer);

                let texto = "";

                const archivos =
                    Object.keys(zip.files);

                for (const nombre of archivos) {
                    if (
                        nombre.startsWith("ppt/slides/slide") &&
                        nombre.endsWith(".xml")
                    ) {
                        const contenido =
                            await zip.files[nombre]
                                .async("string");

                        const coincidencias =
                            contenido.match(/<a:t>(.*?)<\/a:t>/g);

                        if (coincidencias) {
                            coincidencias.forEach(t => {
                                texto +=
                                    t
                                        .replace("<a:t>", "")
                                        .replace("</a:t>", "")
                                    + " ";
                            });
                        }
                    }
                }

                console.log("TEXTO POWERPOINT:");
                console.log(texto);

                enviarDocumento(texto);
            });
    }
    else {
        reader.readAsText(file);
    }
});

const restartBtn =
    document.getElementById("restartBtn");

restartBtn.addEventListener("click", () => {

    location.reload();

});

const studyAgainBtn =
    document.getElementById("studyAgainBtn");

studyAgainBtn.addEventListener("click", () => {

    currentQuestion = 0;
    currentFlashcard = 0;
    streak = 0;

    progressBar.style.width = "0%";
    streakText.innerText = "0";

    document
        .getElementById("resultsScreen")
        .style.display = "none";

    document
        .getElementById("quizContainer")
        .classList.remove("active");

    document
        .getElementById("flashcardsScreen")
        .style.display = "none";

    const lockedScreen =
        document.getElementById("lockedScreen");

    lockedScreen.style.display = "flex";
    lockedScreen.classList.add("active");

    const fileStatus =
        document.getElementById("fileStatus");

    if (documentText && documentText.length > 0) {

        fileStatus.innerText =
            "DOCUMENT READY | " +
            documentText.length +
            " characters";

    }

});

const startFlashcardsBtn =
    document.getElementById(
        "startFlashcardsBtn"
    );

startFlashcardsBtn.addEventListener(
    "click",
    () => {

        currentFlashcard = 0;
        currentReview = 1;

        document
            .getElementById(
                "summaryScreen"
            )
            .style.display = "none";

        document
            .getElementById(
                "flashcardsScreen"
            )
            .style.display = "flex";

        showFlashcard();

    }
);

const listenSummaryBtn =
    document.getElementById(
        "listenSummaryBtn"
    );

const showDocumentBtn =
    document.getElementById("showDocumentBtn");

const showSummaryBtn =
    document.getElementById("showSummaryBtn");

const summaryContent =
    document.getElementById("summaryContent");

let textToRead =
    documentText;

showDocumentBtn.addEventListener(
    "click",
    () => {

        summaryContent.innerText =
            documentText;

    });

showSummaryBtn.addEventListener(
    "click",
    () => {

        summaryContent.innerText =
            summary;

    });

downloadSummaryBtn.addEventListener("click", () => {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = 210;
    const pageHeight = 297;

    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let y = 20;

    /* =========================
       COLORES
    ========================= */

    const blue = [78, 161, 255];
    const darkBlue = [15, 45, 80];
    const lightBlue = [235, 245, 255];
    const gray = [90, 100, 115];
    const dark = [25, 30, 40];
    const white = [255, 255, 255];


    /* =========================
       FUNCIONES AUXILIARES
    ========================= */

    function addPageNumber() {

        const pageCount =
            pdf.internal.getNumberOfPages();

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);

        pdf.setTextColor(...gray);

        pdf.text(
            `LOCKED IN • Plasma AI`,
            margin,
            pageHeight - 10
        );

        pdf.text(
            `PAGE ${pageCount}`,
            pageWidth - margin,
            pageHeight - 10,
            {
                align: "right"
            }
        );
    }


    function newPage() {

        addPageNumber();

        pdf.addPage();

        y = 20;
    }


    function checkSpace(requiredHeight) {

        if (
            y + requiredHeight >
            pageHeight - 25
        ) {

            newPage();

        }

    }


    function drawSectionTitle(title, number) {

        checkSpace(20);

        pdf.setFillColor(...blue);

        pdf.roundedRect(
            margin,
            y,
            12,
            9,
            2,
            2,
            "F"
        );

        pdf.setTextColor(...white);

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(9);

        pdf.text(
            number,
            margin + 6,
            y + 6,
            {
                align: "center"
            }
        );

        pdf.setTextColor(...dark);

        pdf.setFontSize(16);

        pdf.text(
            title,
            margin + 17,
            y + 7
        );

        y += 16;

        pdf.setDrawColor(
            ...blue
        );

        pdf.setLineWidth(0.5);

        pdf.line(
            margin,
            y,
            pageWidth - margin,
            y
        );

        y += 8;
    }


    function drawTextBox(
        title,
        text,
        options = {}
    ) {

        const padding = 7;

        const fontSize =
            options.fontSize || 11;

        const fill =
            options.fill || lightBlue;

        const titleColor =
            options.titleColor || darkBlue;

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(fontSize);

        const lines =
            pdf.splitTextToSize(
                text,
                contentWidth - padding * 2
            );

        const height =
            14 +
            lines.length *
            (fontSize * 0.45) +
            padding * 2;

        checkSpace(height + 5);

        pdf.setFillColor(...fill);

        pdf.setDrawColor(
            190,
            215,
            240
        );

        pdf.roundedRect(
            margin,
            y,
            contentWidth,
            height,
            4,
            4,
            "FD"
        );

        pdf.setTextColor(
            ...titleColor
        );

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(11);

        pdf.text(
            title,
            margin + padding,
            y + 9
        );

        pdf.setTextColor(
            ...dark
        );

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(fontSize);

        pdf.text(
            lines,
            margin + padding,
            y + 18
        );

        y += height + 8;
    }

    function drawCleanText(title, text, options = {}) {

        const fontSize =
            options.fontSize || 11;

        const lines =
            pdf.splitTextToSize(
                text,
                contentWidth
            );

        const lineHeight = fontSize * 0.55;

        const height =
            12 +
            lines.length * lineHeight;

        checkSpace(height + 10);

        pdf.setTextColor(...darkBlue);

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(11);

        pdf.text(
            title,
            margin,
            y
        );

        y += 8;

        pdf.setTextColor(...dark);

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(fontSize);

        pdf.text(
            lines,
            margin,
            y
        );

        y +=
            lines.length * lineHeight +
            10;

        pdf.setDrawColor(
            210,
            220,
            235
        );

        pdf.setLineWidth(0.3);

        pdf.line(
            margin,
            y,
            pageWidth - margin,
            y
        );

        y += 8;
    }

    /* =========================
       PORTADA
    ========================= */

    pdf.setFillColor(
        2,
        6,
        23
    );

    pdf.rect(
        0,
        0,
        pageWidth,
        pageHeight,
        "F"
    );


    pdf.setDrawColor(
        ...blue
    );

    pdf.setLineWidth(1);

    pdf.line(
        25,
        35,
        185,
        35
    );

    pdf.line(
        25,
        262,
        185,
        262
    );


    /* LOCKED IN */

    pdf.setTextColor(
        ...white
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(30);

    pdf.text(
        "LOCKED IN",
        pageWidth / 2,
        80,
        {
            align: "center"
        }
    );


    pdf.setTextColor(
        ...blue
    );

    pdf.setFontSize(13);

    pdf.text(
        "STUDY GUIDE",
        pageWidth / 2,
        92,
        {
            align: "center"
        }
    );



    pdf.setTextColor(
        220,
        230,
        245
    );

    pdf.setFontSize(17);

    const titleLines =
        pdf.splitTextToSize(
            currentFileName,
            150
        );

    pdf.text(
        titleLines,
        pageWidth / 2,
        125,
        {
            align: "center"
        }
    );



    pdf.setTextColor(
        125,
        183,
        255
    );

    pdf.setFontSize(10);

    pdf.text(
        "GENERATED WITH PLASMA AI",
        pageWidth / 2,
        235,
        {
            align: "center"
        }
    );


    pdf.setTextColor(
        150,
        165,
        185
    );

    pdf.setFontSize(9);

    pdf.text(
        new Date().toLocaleDateString(),
        pageWidth / 2,
        248,
        {
            align: "center"
        }
    );


    /* =========================
       NUEVA PÁGINA
    ========================= */

    pdf.addPage();

    y = 20;


    /* =========================
       ENCABEZADO
    ========================= */

    pdf.setTextColor(
        ...dark
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(22);

    pdf.text(
        "Study Guide",
        margin,
        y
    );

    y += 8;

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(9);

    pdf.setTextColor(
        ...gray
    );

    pdf.text(
        currentFileName,
        margin,
        y
    );

    y += 15;


    /* =========================
       RESUMEN
    ========================= */

    drawSectionTitle(
        "SUMMARY",
        "01"
    );

    drawCleanText(
        "CORE SUMMARY",
        summary,
        {
            fontSize: 11
        }
    );


    /* =========================
       INFORMACIÓN CLAVE
    ========================= */

    const sentences =
        summary
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 30);


    if (sentences.length > 0) {

        drawSectionTitle(
            "KEY INFORMATION",
            "02"
        );

        const important =
            sentences
                .slice(0, 8)
                .map(
                    (sentence, index) =>
                        `${index + 1}. ${sentence}.`
                )
                .join("\n");


        drawTextBox(
            "IMPORTANT POINTS",
            important,
            {
                fontSize: 10
            }
        );
    }


    /* =========================
       EXAM FOCUS
    ========================= */

    if (sentences.length > 0) {

        drawSectionTitle(
            "EXAM FOCUS",
            "03"
        );

        const examPoints =
            sentences
                .slice(0, 5)
                .map(
                    sentence =>
                        "• " + sentence + "."
                )
                .join("\n");


        drawTextBox(
            "WHAT TO REMEMBER",
            examPoints,
            {
                fontSize: 10
            }
        );
    }


    /* =========================
       KEY TAKEAWAYS
    ========================= */

    drawSectionTitle(
        "KEY TAKEAWAYS",
        "04"
    );

    const takeaways =
        sentences
            .slice(0, 5)
            .map(
                sentence =>
                    "• " + sentence + "."
            )
            .join("\n");


    if (takeaways) {

        drawTextBox(
            "FINAL REVIEW",
            takeaways,
            {
                fontSize: 10
            }
        );

    }


    /* =========================
       PÁGINAS
    ========================= */

    addPageNumber();


    /* =========================
       NOMBRE DEL ARCHIVO
    ========================= */

    const safeName =
        currentFileName
            .replace(/\s+/g, "_")
            .replace(/[^\w\-]/g, "");


    pdf.save(
        `LOCKED_IN_Study_Guide_${safeName}.pdf`
    );

});

listenSummaryBtn.addEventListener("click", () => {

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(summary);

    // Detectar idioma del resumen
    const englishWords = [
        "the", "and", "of", "to", "in", "is",
        "are", "was", "were", "this", "that",
        "important", "concept", "summary"
    ];

    const spanishWords = [
        "el", "la", "los", "las", "de", "y",
        "en", "es", "son", "fue", "fueron",
        "este", "esta", "importante", "concepto",
        "resumen"
    ];

    const text = summary.toLowerCase();

    let englishScore = 0;
    let spanishScore = 0;

    englishWords.forEach(word => {
        if (text.includes(` ${word} `)) {
            englishScore++;
        }
    });

    spanishWords.forEach(word => {
        if (text.includes(` ${word} `)) {
            spanishScore++;
        }
    });

    const isEnglish =
        englishScore > spanishScore;

    if (isEnglish) {
        speech.lang = "en-US";
    } else {
        speech.lang = "es-ES";
    }

    speech.rate = 0.85;
    speech.pitch = 1;
    speech.volume = 1;

    const voices = speechSynthesis.getVoices();

    speech.voice = voices.find(
        voice =>
            voice.lang
                .toLowerCase()
                .startsWith(
                    isEnglish ? "en" : "es"
                )
    );

    speechSynthesis.speak(speech);

});

const downloadAudioBtn =
    document.getElementById("downloadAudioBtn");

downloadAudioBtn.addEventListener("click", async () => {

    if (!summary || summary.trim() === "") {

        alert("No summary available.");

        return;
    }

    console.log("Generando audio del resumen...");

    try {

        const response = await fetch(
            "https://plasma-api.onrender.com/api/Plasma/audio",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    texto: summary
                })
            }
        );

        if (!response.ok) {

            throw new Error(
                "No se pudo generar el audio."
            );

        }

        const audioBlob =
            await response.blob();

        const audioUrl =
            URL.createObjectURL(audioBlob);

        const link =
            document.createElement("a");

        link.href = audioUrl;

        link.download =
            "LOCKED_IN_Summary_Audio.mp3";

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(audioUrl);

        console.log(
            "Audio descargado correctamente."
        );

    }
    catch (error) {

        console.error(
            "ERROR AL DESCARGAR AUDIO:",
            error
        );

        alert(
            "No se pudo generar el audio."
        );

    }

});