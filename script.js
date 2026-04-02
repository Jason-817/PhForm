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



const welcomeScreen = document.getElementById("welcome-screen");
const questionnaireScreen = document.getElementById("questionnaire-screen");
const nameWelcomeScreen = document.getElementById("name-welcome-screen");
const plinkoSection = document.getElementById("plinko-section");
const welcomeForm = document.getElementById("welcome-form");
const yesnoForm = document.getElementById("yesnoForm");
const gfForm = document.getElementById("gfForm");
const canvas = document.getElementById("gameCanvas");
canvas.style.display = "none";

function resizePlinkoCanvas() {

    const maxHeight = window.innerHeight * 0.55;

    canvas.style.height = maxHeight + "px";

}

window.addEventListener("resize", resizePlinkoCanvas);
resizePlinkoCanvas();

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

["distinguishingFeatures","hobbies","perfectDate"].forEach(name => {
    const el = document.querySelector(`textarea[name='${name}']`);
    if(el){
        el.addEventListener("input", () => {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        });
    }
});

window.bioData = {};
window.questionnaireData = {}; 

const yesnoKeys = {
  q1: "Are you cool with PDA?",
  q2: "Have you ever been heartbroken?",
  q3: "Do you believe people can truly change?"
};

const longQuestionKeys = {

  friendsDescribe: "How would your friends describe you?",
  doWithMoney: 'What would you do if you had "X" millions of pesos?',
  favoriteSongs: "Your favorite songs?",
  favoriteMovies: "Your favorite movies/shows?",
  dreamTravel: "If you could travel anywhere around the world and there were no issues, where would you go?",
  experienceAgain: "What is something you've done/felt/seen/etc. that you wish you could experience again for the first time?",
  idealDateFull: "What is your ideal date from start to finish?",
  salaryExpectation: "Give me a range of the salary you need to have to meet your needs / expected salary of your partner?",
  bfFightScenario: "What are you doing if your boyfriend gets his ass beat in front of you while defending you?",
  dealbreakers: "What are your dealbreakers?",
  partnerQualities: "What are the most important qualities you look for in a romantic partner?",
  misunderstoodTrait: "What is something people usually misunderstand about you?",
  crazyTrait: "If you had to describe one habit or trait of yours that might drive a partner crazy, what would it be and why?",
  selfCompliments: "Give yourself at least 3 compliments (what are you most proud of about yourself?)"
};

// ---------------- Download Text File ----------------
/*function downloadPdfFile(bioData, questionnaireData) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    const bgImg = new Image();
    bgImg.src = "boat.jpg"; // your background image

    bgImg.onload = () => {

        function addPageWithBox(title, content) {
            pdf.addPage();
            pdf.addImage(bgImg, "JPEG", 0, 0, pageWidth, pageHeight);

            const boxMaxWidth = pageWidth - margin * 2;
            const startX = margin;
            const startY = margin;

            const padding = 10; // add some space inside the box

            // Split title and content with padding
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            const titleLines = pdf.splitTextToSize(title, boxMaxWidth - padding * 2);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(12);
            const contentLines = pdf.splitTextToSize(content, boxMaxWidth - padding * 2);

            const lineHeight = 6;

            // Dynamic box height based on content
            const boxHeight =
                titleLines.length * lineHeight + contentLines.length * lineHeight + 20;

            // Draw box at top
            pdf.setFillColor(255, 255, 255); // **white background**
            pdf.setDrawColor(200, 200, 200); // light gray border
            pdf.setLineWidth(0.5);
            pdf.roundedRect(startX, startY, boxMaxWidth, boxHeight, 8, 8, "FD");

            // Draw title
            pdf.text(titleLines, startX + padding, startY + padding);

            // Draw content
            pdf.setFont("helvetica", "normal");
            let yOffset = startY + padding + titleLines.length * lineHeight + 5;

            content.split("\n").forEach(line => {
                const lines = pdf.splitTextToSize(line, boxMaxWidth - padding * 2); // subtract left/right padding
                pdf.text(lines, startX + padding, yOffset);
                yOffset += lines.length * lineHeight;
            });
        }

        // --- Page 1: Biography ---
        const bioLines = [
            `Name: ${bioData.name}`,
            `Age: ${bioData.age}`,
            `Gender: ${bioData.gender}`,
            `Height: ${bioData.height}`,
            `Hobbies: ${bioData.hobbies}`
        ];

        // Create a single string for the box, but split text to size properly
        const bioContent = bioLines.join("\n");
        addPageWithBox("Biography", bioContent);

        // --- Page 2: Closed Questions ---
        let closedContent = "";
        for (let key in questionnaireData) {
            if (yesnoKeys[key]) {
                closedContent += `${yesnoKeys[key]}: ${questionnaireData[key]}\n\n`;
            }
        }
        addPageWithBox("", closedContent.trim());

        // --- Long Questions ---
        for (let key in longQuestionKeys) {
            if (questionnaireData[key]) {
                addPageWithBox(longQuestionKeys[key], questionnaireData[key]);
            }
        }

        pdf.deletePage(1); // remove empty first page
        pdf.save((bioData.name || "application") + "_application.pdf");
    };
}*/

function downloadPdfFile(bioData, questionnaireData) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const pxPerMm = 96 / 25.4; 
    const containerWidth = pageWidth * pxPerMm;
    const containerHeight = pageHeight * pxPerMm;

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.width = containerWidth + "px";
    container.style.height = containerHeight + "px";
    container.style.fontFamily = "Poppins, sans-serif";
    container.style.fontSize = "14px";
    container.style.padding = "20px";
    container.style.backgroundImage = "url('boat.jpg')";
    container.style.backgroundSize = "100% 100%";
    container.style.backgroundPosition = "center";
    container.style.backgroundRepeat = "no-repeat";
    container.style.color = "#fff"; // make all text white

    // Add a semi-transparent overlay behind text for better readability
    let htmlContent = `
        <div style="
            width:100%; 
            height:100%; 
            display:flex; 
            flex-direction:column; 
            justify-content:flex-start; 
            background: rgba(0,0,0,0.4); /* dark overlay */
            padding: 15px;
            border-radius: 10px;
        ">
            <h2>Biography</h2>
            <p><strong>Name:</strong> ${bioData.name}</p>
            <p><strong>Age:</strong> ${bioData.age}</p>
            <p><strong>Gender:</strong> ${bioData.gender}</p>
            <p><strong>Height:</strong> ${bioData.height}</p>
            <p><strong>Hobbies:</strong> ${bioData.hobbies}</p>
            <hr>
            <h2>Closed Questions</h2>
            ${Object.keys(questionnaireData)
              .filter(k => yesnoKeys[k])
              .map(k => `<p><strong>${yesnoKeys[k]}:</strong> ${questionnaireData[k]}</p>`)
              .join("")}
            <hr>
            <h2>Long Questions</h2>
            ${Object.keys(longQuestionKeys)
              .filter(k => questionnaireData[k])
              .map(k => `<p><strong>${longQuestionKeys[k]}:</strong> ${questionnaireData[k]}</p>`)
              .join("")}
        </div>
    `;
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    html2canvas(container, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        pdf.save((bioData.name || "application") + "_application.pdf");

        container.remove();
    });
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
    welcomeText.textContent = `Welcome ${bioData.name} to the Getting to Know You Application!`;
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

function showCurrentStep() {
    longQuestionSteps.forEach((step, index) => {
        step.style.display = index === currentStep ? "flex" : "none";
    });
}
showCurrentStep();

document.querySelectorAll(".next-long-question").forEach(btn => {
    btn.addEventListener("click", () => {
        const textareas = longQuestionSteps[currentStep].querySelectorAll("textarea");

        for (let ta of textareas) {
            if (!ta.value.trim()) {
                alert("Please answer all questions before continuing.");
                return;
            }
        }

        textareas.forEach(ta => {
            window.questionnaireData[ta.name] = ta.value.trim();
        });

        currentStep++;
        if (longQuestionSteps[currentStep]) showCurrentStep();
    });
});

gfForm.addEventListener("submit", e => {
    e.preventDefault();

    const textareas = longQuestionSteps[currentStep].querySelectorAll("textarea");
    textareas.forEach(ta => {
        if(ta.value.trim()) window.questionnaireData[ta.name] = ta.value.trim();
    });

    downloadPdfFile(window.bioData || {}, window.questionnaireData);

    setTimeout(()=>{
        questionnaireScreen.style.display = "none";
    },500);
    //plinkoSection.style.display = "flex"; remove comment to reapply the plinko section

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

Events.on(render, 'afterRender', () => {
    const ctx = render.context;
    ctx.font = "bold 20px Poppins"; 
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff"; 
    ctx.fillText("YES", yesBox.position.x, yesBox.position.y);
    ctx.fillText("NO", noBox.position.x, noBox.position.y);
});

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
            plinkoSection.style.display = "none";
            document.getElementById("final-screen").style.display = "flex";
            stopFloatingGIFs();
            launchFinalCelebration(); 
            cb.custom.scored=true;
            World.remove(engine.world, cb);
            checkboxes.splice(i,1);
        }
    });
});

// ---------------- Final Celebration ----------------
function launchFinalCelebration() {
    const fireworksCanvas = document.createElement("canvas");
    fireworksCanvas.id = "fireworksCanvas";
    fireworksCanvas.style.position = "fixed";
    fireworksCanvas.style.top = "0";
    fireworksCanvas.style.left = "0";
    fireworksCanvas.style.width = "100%";
    fireworksCanvas.style.height = "100%";
    fireworksCanvas.style.pointerEvents = "none";
    fireworksCanvas.style.zIndex = "9998";
    document.body.appendChild(fireworksCanvas);

    const fwCtx = fireworksCanvas.getContext("2d");
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;

    class Firework {
        constructor() {
            this.x = Math.random() * fireworksCanvas.width;
            this.y = fireworksCanvas.height;
            this.targetY = Math.random() * fireworksCanvas.height / 2;
            this.particles = [];
            this.exploded = false;
        }
        update() {
            if (!this.exploded) {
                this.y -= 8;
                if (this.y <= this.targetY) this.explode();
            } else {
                this.particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.1;
                    p.alpha -= 0.02;
                });
                this.particles = this.particles.filter(p => p.alpha > 0);
            }
        }
        explode() {
            this.exploded = true;
            for (let i = 0; i < 30; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const speed = Math.random() * 5 + 2;
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    color: `hsl(${Math.random()*360},100%,50%)`
                });
            }
        }
        draw(ctx) {
            if (!this.exploded) {
                ctx.fillStyle = "white";
                ctx.fillRect(this.x, this.y, 2, 10);
            } else {
                this.particles.forEach(p => {
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                });
            }
        }
    }

    const fireworks = [];
    setInterval(() => fireworks.push(new Firework()), 500);

    function animateFireworks() {
        fwCtx.clearRect(0,0,fireworksCanvas.width,fireworksCanvas.height);
        fireworks.forEach(f => {
            f.update();
            f.draw(fwCtx);
        });
        requestAnimationFrame(animateFireworks);
    }
    animateFireworks();

    const emojis = ["🎉","💖","✨","🔥","🥳","🌟"];
    setInterval(() => {
        const emoji = document.createElement("div");
        emoji.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        emoji.className = "flying-emoji";
        emoji.style.left = Math.random() * window.innerWidth + "px";
        emoji.style.fontSize = (20 + Math.random()*30) + "px";
        document.body.appendChild(emoji);
        setTimeout(()=>emoji.remove(), 3000);
    }, 150);
}

document.getElementById("yesBtn").addEventListener("click", ()=> {
    plinkoSection.style.display = "none";
    document.getElementById("final-screen").style.display = "flex";
    stopFloatingGIFs();
    launchFinalCelebration();
});

document.getElementById("noBtn").addEventListener("click", ()=> {
    canvas.style.display = "block";
    dropCheckbox();
});