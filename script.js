// ---------------- Floating GIFs ----------------
let activeGIFs = [];

function startFloatingGIFs() {
    for (let i = 0; i < 15; i++) createFloatingGIF();
}

function stopFloatingGIFs() {
    activeGIFs.forEach(g => g.remove());
    activeGIFs = [];
}

function createFloatingGIF() {
    const gif = document.createElement("img");
    gif.src = "yes.gif";
    gif.classList.add("floating-gif");
    const size = 25 + Math.random() * 40;
    gif.style.width = size + "px";
    gif.style.left = Math.random() * 90 + "vw";
    gif.style.animationDuration = (4 + Math.random() * 3) + "s";
    document.body.appendChild(gif);
    activeGIFs.push(gif);
}

// ---------------- DOM Elements ----------------
const welcomeScreen = document.getElementById("welcome-screen");
const questionnaireScreen = document.getElementById("questionnaire-screen");
const nameWelcomeScreen = document.getElementById("name-welcome-screen");
const plinkoSection = document.getElementById("plinko-section");
const welcomeForm = document.getElementById("welcome-form");
const yesnoForm = document.getElementById("yesnoForm");
const gfForm = document.getElementById("gfForm");
const canvas = document.getElementById("gameCanvas");
canvas.style.display = "none";

const heightUnit = document.getElementById("heightUnit");
const heightCmInput = document.querySelector("input[name='heightCm']");
const ftinInputs = document.getElementById("ftin-inputs");
const heightFtInput = document.querySelector("input[name='heightFt']");
const heightInInput = document.querySelector("input[name='heightIn']");

// ---------------- Height Unit Toggle ----------------
heightUnit.addEventListener("change", () => {
    if (heightUnit.value === "cm") {
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

// ---------------- Auto Resize Textareas ----------------
["distinguishingFeatures","hobbies","perfectDate"].forEach(name => {
    const el = document.querySelector(`textarea[name='${name}']`);
    if(el){
        el.addEventListener("input", () => {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        });
    }
});

// ---------------- Global Data Storage ----------------
window.bioData = {};
window.questionnaireData = {}; // stores both Yes/No and long question answers

// ---------------- Mapping Yes/No Keys ----------------
const yesnoKeys = {
  q1: "pineapplePizza",
  q2: "morningPerson",
  q3: "trans",
  q4: "activePerson",
  q5: "singDance",
  q6: "photography",
  q7: "ghosting",
  q8: "pda",
  q9: "peopleChange",
  q10: "heartbroken"
};

// ---------------- Download Text File ----------------
function downloadTxtFile(bioData, questionnaireData) {
    let content = "===== GF APPLICATION =====\n\n";

    content += "----- BIOGRAPHY -----\n";
    const bioOrder = ["name","age","gender","height","distinguishingFeatures","hobbies"];
    bioOrder.forEach(key => {
        if (bioData[key] !== undefined) content += `${key}: ${bioData[key]}\n`;
    });

    content += "\n----- Y/N -----\n";
    for (let key in questionnaireData) {
        if(yesnoKeys[key]) {
            content += `${yesnoKeys[key]}: ${questionnaireData[key]}\n`;
        }
    }

   content += "\n----- LONG QUESTIONS -----\n";
for (let key in questionnaireData) {
    // anything not in yesnoKeys is long question
    if(!yesnoKeys[key]) {
        content += `${key}: ${questionnaireData[key]}\n`;
    }
    }

    const blob = new Blob([content], {type:"text/plain"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gf_application.txt";
    link.click();
}

// ---------------- Welcome Form ----------------
welcomeForm.addEventListener("submit", e => {
    e.preventDefault();
    const bioData = {};
    new FormData(welcomeForm).forEach((value,key)=>bioData[key]=value);

    if(heightUnit.value === "cm") bioData.height = bioData.heightCm + " cm";
    else bioData.height = bioData.heightFt + " ft " + bioData.heightIn + " in";

    bioData.gender = welcomeForm.querySelector("input[name='gender']:checked")?.value || "";

    delete bioData.heightCm;
    delete bioData.heightFt;
    delete bioData.heightIn;
    delete bioData.heightUnit;

    window.bioData = bioData;

    welcomeScreen.style.display = "none";
    const welcomeText = document.getElementById("welcomeNameText");
    welcomeText.textContent = `Welcome ${bioData.name} to the GF Application!`;
    nameWelcomeScreen.style.display = "flex";
});

// ---------------- Intermediate Welcome Screen ----------------
document.getElementById("continueGif").addEventListener("click", (e) => {
    const rect = e.target.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    for (let i = 0; i < 15; i++) {
        const gif = document.createElement("img");
        gif.src = "yes.gif";
        gif.classList.add("floating-gif");
        const size = 15 + Math.random() * 25;
        gif.style.width = size + "px";
        gif.style.left = startX + (Math.random()-0.5)*50 + "px";
        gif.style.top = startY + (Math.random()-0.5)*50 + "px";
        gif.style.animationDuration = (3 + Math.random()*3) + "s";
        gif.style.zIndex = "0";
        document.body.appendChild(gif);
        activeGIFs.push(gif);
    }

    nameWelcomeScreen.classList.add("hidden");
    setTimeout(() => {
        nameWelcomeScreen.style.display = "none";
        questionnaireScreen.style.display = "flex";
        questionnaireScreen.classList.add("fade-in");
        setTimeout(() => questionnaireScreen.classList.add("show"), 50);

        document.getElementById("questionnaireTitle").textContent = "Closed Questions";
        startFloatingGIFs();
    }, 2000);
});

// ---------------- Yes/No Form ----------------
yesnoForm.addEventListener("submit", e => {
    e.preventDefault();

    // store Yes/No answers
    new FormData(yesnoForm).forEach((value,key)=>{
        window.questionnaireData[key] = value;
    });

    yesnoForm.style.display = "none";
    gfForm.style.display = "flex";

    document.getElementById("questionnaireTitle").textContent = "Long Questions";

    startFloatingGIFs();
});

// ---------------- Long Question Form ----------------
const longQuestionSteps = document.querySelectorAll(".long-question-step");
let currentStep = 0;

// Show first step initially
function showCurrentStep() {
    longQuestionSteps.forEach((step, index) => {
        step.style.display = index === currentStep ? "flex" : "none";
    });
}
showCurrentStep();

// "Next" buttons for steps before the last one
document.querySelectorAll(".next-long-question").forEach(btn => {
    btn.addEventListener("click", () => {
        const textareas = longQuestionSteps[currentStep].querySelectorAll("textarea");

        // Ensure all textareas in current step are filled
        for (let ta of textareas) {
            if (!ta.value.trim()) {
                alert("Please answer all questions before continuing.");
                return;
            }
        }

        // Save all answers in current step
        textareas.forEach(ta => {
            window.questionnaireData[ta.name] = ta.value.trim();
        });

        // Move to next step
        currentStep++;
        if (longQuestionSteps[currentStep]) {
            showCurrentStep();
        }
    });
});

// Final Submit button (on last step)
gfForm.addEventListener("submit", e => {
    e.preventDefault();

    // Save all textareas in the current (last) step
    const textareas = longQuestionSteps[currentStep].querySelectorAll("textarea");
    textareas.forEach(ta => {
        if(ta.value.trim()) window.questionnaireData[ta.name] = ta.value.trim();
    });

    // Download all data
    downloadTxtFile(window.bioData || {}, window.questionnaireData);

    // Hide questionnaire and show plinko
    questionnaireScreen.style.display = "none";
    plinkoSection.style.display = "flex";

    stopFloatingGIFs();
});

// ---------------- Plinko Logic ----------------
const {Engine, Render, World, Bodies, Body, Events, Bounds} = Matter;
const engine = Engine.create();
engine.gravity.y = 0.5;
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {width:400, height:600, wireframes:false, background:"#111"}
});

const ground = Bodies.rectangle(200,590,400,20,{isStatic:true});
const leftWall = Bodies.rectangle(-10,300,20,600,{isStatic:true});
const rightWall = Bodies.rectangle(410,300,20,600,{isStatic:true});
World.add(engine.world,[ground,leftWall,rightWall]);

const boxWidth=160, boxHeight=60;
const yesBox=Bodies.rectangle(100,565,boxWidth,boxHeight,{isStatic:true,render:{fillStyle:"#28a745"}});
const noBox=Bodies.rectangle(300,565,boxWidth,boxHeight,{isStatic:true,render:{fillStyle:"#dc3545"}});
World.add(engine.world,[yesBox,noBox]);

const pegRadius=8, rows=8, cols=7;
const pegs=[], xMargin=50, yStart=100, ySpacing=50, xSpacing=(canvas.width-2*xMargin)/(cols-1);
for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
        let x = xMargin + col*xSpacing + (row%2?xSpacing/2:0);
        let y = yStart + row*ySpacing;
        let peg = Bodies.circle(x,y,pegRadius,{isStatic:true,render:{fillStyle:"#fff"}});
        World.add(engine.world,peg); pegs.push(peg);
    }
}

Engine.run(engine);
Render.run(render);

const checkboxes = [];
function dropCheckbox(){
    const checkbox = Bodies.rectangle(noBox.position.x,50,20,20,{
        restitution:0.5, friction:0.05, render:{fillStyle:"#00ffff"}, custom:{scored:false}
    });
    Body.setStatic(checkbox,true);
    World.add(engine.world,checkbox);
    checkboxes.push(checkbox);
    setTimeout(()=>{
        Body.setStatic(checkbox,false);
        Body.setVelocity(checkbox,{x:0,y:2});
        Body.setAngularVelocity(checkbox,0.01);
    },1500);
}

function isOverlapping(bodyA,bodyB){ return Bounds.overlaps(bodyA.bounds, bodyB.bounds); }

Events.on(engine,'collisionStart', event => {
    event.pairs.forEach(pair => {
        checkboxes.forEach(cb => {
            if(pair.bodyA === cb || pair.bodyB === cb){
                const other = pair.bodyA===cb? pair.bodyB: pair.bodyA;
                if(pegs.includes(other)){
                    Body.applyForce(cb, cb.position, {x:(Math.random()-0.5)*0.02, y:-0.02-Math.random()*0.01});
                }
                if(other === noBox){
                    Body.setVelocity(cb, {x:-2,y:-5});
                }
            }
        });
    });
});

Events.on(engine,'afterUpdate',()=>{
    checkboxes.forEach((cb,i)=>{
        if(!cb.custom.scored && isOverlapping(cb, yesBox)){
            alert("Checkbox landed in YES!");
            stopFloatingGIFs();
            startFloatingGIFs();
            cb.custom.scored=true;
            World.remove(engine.world, cb);
            checkboxes.splice(i,1);
        }
    });
});

document.getElementById("yesBtn").addEventListener("click", ()=>{
    const answer = prompt("Are you sure you want to retract your statement?");
    if(answer !== null){
        alert("Statement retracted.");
        stopFloatingGIFs();
        startFloatingGIFs(); 
    }
});

document.getElementById("noBtn").addEventListener("click", ()=>{
    canvas.style.display="block";
    dropCheckbox();
});