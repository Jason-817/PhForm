// Floating GIFs
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

// Auto-expand textareas
["distinguishingFeatures","hobbies","perfectDate"].forEach(name => {
    const el = document.querySelector(`textarea[name='${name}']`);
    if(el){
        el.addEventListener("input", () => {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        });
    }
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
document.getElementById("continueGif").addEventListener("click", (e) => {
    const rect = e.target.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Spawn small floating GIFs from GIF location
    for (let i = 0; i < 15; i++) {
        const gif = document.createElement("img");
        gif.src = "yes.gif";
        gif.classList.add("floating-gif");
        const size = 15 + Math.random() * 25;
        gif.style.width = size + "px";
        gif.style.left = startX + (Math.random() - 0.5) * 50 + "px";
        gif.style.top = startY + (Math.random() - 0.5) * 50 + "px";
        gif.style.animationDuration = (3 + Math.random() * 3) + "s";
        gif.style.zIndex = "0";
        document.body.appendChild(gif);
        activeGIFs.push(gif);
    }

    // Fade in questionnaire screen
    nameWelcomeScreen.style.display = "none";
    questionnaireScreen.style.display = "flex";
    questionnaireScreen.classList.add("fade-in");
    setTimeout(() => {
        questionnaireScreen.classList.add("show");
    }, 50);

    startFloatingGIFs(); // Start continuous floating GIFs after click
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
            startFloatingGIFs();
            cb.custom.scored=true;
            World.remove(engine.world, cb);
            checkboxes.splice(i,1);
        }
    });
});

// YES/NO button handling
document.getElementById("yesBtn").addEventListener("click", ()=>{
    const answer = prompt("Are you sure you want to retract your statement?");
    if(answer !== null){
        alert("Statement retracted.");
        startFloatingGIFs();
    }
});

document.getElementById("noBtn").addEventListener("click", ()=>{
    canvas.style.display="block";
    dropCheckbox();
});