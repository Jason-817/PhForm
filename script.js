// Form references
const welcomeScreen = document.getElementById("welcome-screen");
const questionnaireScreen = document.getElementById("questionnaire-screen");
const nameWelcomeScreen = document.getElementById("name-welcome-screen");
const plinkoSection = document.getElementById("plinko-section");
const welcomeForm = document.getElementById("welcome-form");
const gfForm = document.getElementById("gfForm");
const canvas = document.getElementById("gameCanvas");
canvas.style.display = "none";

// Height unit handling
const heightUnit = document.getElementById("heightUnit");
const heightCmInput = document.querySelector("input[name='heightCm']");
const ftinInputs = document.getElementById("ftin-inputs");
const heightFtInput = document.querySelector("input[name='heightFt']");
const heightInInput = document.querySelector("input[name='heightIn']");

heightUnit.addEventListener("change", () => {
    if(heightUnit.value === "cm") {
        heightCmInput.style.display = "inline-block";
        ftinInputs.style.display = "none";
        heightCmInput.required = true;
        heightFtInput.required = false;
        heightInInput.required = false;
    } else {
        heightCmInput.style.display = "none";
        ftinInputs.style.display = "flex";
        heightCmInput.required = false;
        heightFtInput.required = true;
        heightInInput.required = true;
    }
});

// Auto-expand textareas
["distinguishingFeatures","hobbies"].forEach(name => {
    const el = document.querySelector(`textarea[name='${name}']`);
    el.addEventListener("input", () => {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    });
});

// TXT download
function downloadTxtFile(bioData, questionnaireData) {
    let content = "===== GF APPLICATION =====\n\n";
    content += "----- BIOGRAPHY -----\n";
    const bioOrder = ["name","age","gender","height","distinguishingFeatures","hobbies"];
    bioOrder.forEach(key => {
        if (bioData[key] !== undefined) content += `${key}: ${bioData[key]}\n`;
    });
    content += "\n----- QUESTIONNAIRE -----\n";
    for (let key in questionnaireData) content += `${key}: ${questionnaireData[key]}\n`;

    const blob = new Blob([content], {type:"text/plain"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gf_application.txt";
    link.click();
}

// Welcome form submission
welcomeForm.addEventListener("submit", e => {
    e.preventDefault();
    const bioData = {};
    new FormData(welcomeForm).forEach((value,key)=>bioData[key]=value);

    if(heightUnit.value === "cm") bioData.height = bioData.heightCm + " cm";
    else bioData.height = bioData.heightFt + " ft " + bioData.heightIn + " in";

    // Gender radio
    bioData.gender = welcomeForm.querySelector("input[name='gender']:checked")?.value || "";

    delete bioData.heightCm;
    delete bioData.heightFt;
    delete bioData.heightIn;
    delete bioData.heightUnit;

    window.bioData = bioData;

    // Show intermediate screen
    welcomeScreen.style.display = "none";
    const welcomeText = document.getElementById("welcomeNameText");
    welcomeText.textContent = `Welcome ${bioData.name} to the GF Application!`;
    nameWelcomeScreen.style.display = "flex";
});

// Click GIF to continue to questionnaire
document.getElementById("continueGif").addEventListener("click", () => {
    nameWelcomeScreen.style.display = "none";
    questionnaireScreen.style.display = "flex";
});

// Questionnaire form submission
gfForm.addEventListener("submit", e => {
    e.preventDefault();
    const questionnaireData = {};
    new FormData(gfForm).forEach((value,key)=>questionnaireData[key]=value);

    downloadTxtFile(window.bioData || {}, questionnaireData);
    questionnaireScreen.style.display = "none";
    plinkoSection.style.display = "flex";
});

// Plinko section left unchanged (you can integrate Matter.js later)