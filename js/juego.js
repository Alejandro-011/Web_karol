/* =========================================================
   KAROL PERFORMANCE — DEADLIFT CHALLENGE
   juego.js
   CANVAS GAME ENGINE
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const GAME_TIME = 15;
const KG_PER_REP = 2;

const RECORD_KEY = "deadliftRecord";


/* =========================================================
   ELEMENTOS HTML
   ========================================================= */

const game = document.getElementById("game");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const resultScreen = document.getElementById("resultScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const backButton = document.getElementById("backButton");
const resultBackButton = document.getElementById("resultBackButton");

const liftButton = document.getElementById("liftButton");

const weightValue = document.getElementById("weightValue");
const recordValue = document.getElementById("recordValue");

const timerValue = document.getElementById("timerValue");
const repValue = document.getElementById("repValue");

const resultWeight = document.getElementById("resultWeight");
const resultReps = document.getElementById("resultReps");
const resultRecord = document.getElementById("resultRecord");

const newRecordMessage =
    document.getElementById("newRecordMessage");

const timeProgressBar =
    document.getElementById("timeProgressBar");

const repFlash =
    document.getElementById("repFlash");

const statusMessage =
    document.getElementById("statusMessage");


/* =========================================================
   ESTADO DEL JUEGO
   ========================================================= */

let reps = 0;
let weight = 0;

let record =
    Number(localStorage.getItem(RECORD_KEY)) || 0;

let timeLeft = GAME_TIME;

let gameRunning = false;

let gameTimer = null;

let lastFrameTime = 0;

let animationFrame = null;

let liftAnimation = 0;

let liftVelocity = 0;

let cameraShake = 0;

let totalElapsed = 0;


/* =========================================================
   CANVAS
   ========================================================= */

let canvasWidth = 0;
let canvasHeight = 0;
let pixelRatio = 1;


/* =========================================================
   PERSONAJE
   ========================================================= */

const character = {

    x: 0,
    groundY: 0,

    scale: 1,

    // Animación corporal
    bodyLean: 0,
    hipOffset: 0,
    kneeBend: 0,
    armAngle: 0,

    // Movimiento vertical
    verticalOffset: 0,

    // Escala aproximada
    headRadius: 31,
    torsoWidth: 95,
    torsoHeight: 145,
    upperLeg: 90,
    lowerLeg: 90

};


/* =========================================================
   PARTÍCULAS
   ========================================================= */

const particles = [];


/* =========================================================
   UTILIDADES
   ========================================================= */

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


function lerp(a, b, t) {
    return a + (b - a) * t;
}


function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}


function easeInOutCubic(t) {

    if (t < 0.5) {
        return 4 * t * t * t;
    }

    return 1 - Math.pow(-2 * t + 2, 3) / 2;
}


function random(min, max) {
    return Math.random() * (max - min) + min;
}


/* =========================================================
   RESIZE CANVAS
   ========================================================= */

function resizeCanvas() {

    pixelRatio =
        Math.min(window.devicePixelRatio || 1, 2);

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width =
        Math.floor(canvasWidth * pixelRatio);

    canvas.height =
        Math.floor(canvasHeight * pixelRatio);

    canvas.style.width =
        `${canvasWidth}px`;

    canvas.style.height =
        `${canvasHeight}px`;

    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );

    character.x =
        canvasWidth / 2;

    character.groundY =
        canvasHeight * 0.79;

    updateCharacterScale();
}


function updateCharacterScale() {

    const baseScale =
        Math.min(
            canvasWidth / 900,
            canvasHeight / 850
        );

    character.scale =
        clamp(baseScale, 0.52, 1.12);
}


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================================
   HUD
   ========================================================= */

function updateHUD() {

    weightValue.textContent =
        weight;

    recordValue.textContent =
        record;

    repValue.textContent =
        reps;

    timerValue.textContent =
        Math.max(0, Math.ceil(timeLeft));

    const progress =
        clamp(timeLeft / GAME_TIME, 0, 1);

    timeProgressBar.style.transform =
        `scaleX(${progress})`;

    if (timeLeft <= 5 && gameRunning) {

        timerValue.classList.add("warning");

        timeProgressBar.classList.add("warning");

    } else {

        timerValue.classList.remove("warning");

        timeProgressBar.classList.remove("warning");

    }
}


/* =========================================================
   INICIAR JUEGO
   ========================================================= */

function startGame() {

    if (gameRunning) {
        return;
    }

    reps = 0;
    weight = 0;

    timeLeft = GAME_TIME;

    totalElapsed = 0;

    liftAnimation = 0;

    cameraShake = 0;

    particles.length = 0;

    gameRunning = true;

    startScreen.hidden = true;
    resultScreen.hidden = true;

    liftButton.style.display = "flex";

    updateHUD();

    lastFrameTime =
        performance.now();

    clearInterval(gameTimer);

    gameTimer = setInterval(() => {

        if (!gameRunning) {
            return;
        }

        timeLeft--;

        updateHUD();

        if (timeLeft <= 0) {
            finishGame();
        }

    }, 1000);

    if (!animationFrame) {

        animationFrame =
            requestAnimationFrame(gameLoop);

    }
}


/* =========================================================
   FINALIZAR JUEGO
   ========================================================= */

function finishGame() {

    if (!gameRunning) {
        return;
    }

    gameRunning = false;

    clearInterval(gameTimer);

    gameTimer = null;

    timeLeft = 0;

    updateHUD();

    const previousRecord = record;

    const finalWeight = weight;

    if (weight > record) {

        record = weight;

        localStorage.setItem(
            RECORD_KEY,
            String(record)
        );

    }

    resultWeight.textContent =
        finalWeight;

    resultReps.textContent =
        reps;

    resultRecord.textContent =
        record;

    if (finalWeight > previousRecord) {

        newRecordMessage.hidden = false;

    } else {

        newRecordMessage.hidden = true;

    }

    setTimeout(() => {

        resultScreen.hidden = false;

        liftButton.style.display = "none";

    }, 250);
}


/* =========================================================
   REPETICIÓN
   ========================================================= */

function performLift() {

    if (!gameRunning) {
        return;
    }

    if (timeLeft <= 0) {
        return;
    }

    reps++;

    weight =
        reps * KG_PER_REP;

    updateHUD();

    triggerLiftAnimation();

    createRepParticles();

    cameraShake = 7;

    showRepMessage();

    repFlash.classList.remove("active");

    void repFlash.offsetWidth;

    repFlash.classList.add("active");
}


/* =========================================================
   ANIMACIÓN DE LEVANTAMIENTO
   ========================================================= */

function triggerLiftAnimation() {

    liftAnimation = 0;

    liftVelocity = 1;
}


/* =========================================================
   MENSAJE DE REPETICIÓN
   ========================================================= */

function showRepMessage() {

    statusMessage.textContent =
        `+${KG_PER_REP} KG`;

    statusMessage.classList.remove("show");

    void statusMessage.offsetWidth;

    statusMessage.classList.add("show");
}


/* =========================================================
   PARTÍCULAS
   ========================================================= */

function createRepParticles() {

    const count =
        canvasWidth < 600 ? 12 : 22;

    for (let i = 0; i < count; i++) {

        particles.push({

            x:
                character.x +
                random(-100, 100),

            y:
                character.groundY -
                random(20, 90),

            vx:
                random(-2.5, 2.5),

            vy:
                random(-4.5, -1),

            size:
                random(1, 3.5),

            life: 1,

            decay:
                random(0.025, 0.055)

        });
    }
}


/* =========================================================
   ACTUALIZAR PARTÍCULAS
   ========================================================= */

function updateParticles(delta) {

    for (let i = particles.length - 1; i >= 0; i--) {

        const p = particles[i];

        p.x += p.vx * delta * 60;

        p.y += p.vy * delta * 60;

        p.vy += 0.12 * delta * 60;

        p.life -= p.decay * delta * 60;

        if (p.life <= 0) {

            particles.splice(i, 1);

        }

    }
}


/* =========================================================
   GAME LOOP
   ========================================================= */

function gameLoop(timestamp) {

    const delta =
        Math.min(
            (timestamp - lastFrameTime) / 1000,
            0.033
        );

    lastFrameTime = timestamp;

    totalElapsed += delta;

    updateLiftAnimation(delta);

    updateParticles(delta);

    updateCamera(delta);

    render();

    animationFrame =
        requestAnimationFrame(gameLoop);
}


/* =========================================================
   ACTUALIZAR ANIMACIÓN
   ========================================================= */

function updateLiftAnimation(delta) {

    if (liftVelocity <= 0) {
        return;
    }

    liftAnimation +=
        delta * 2.7;

    if (liftAnimation >= 1) {

        liftAnimation = 1;

        liftVelocity = -1;

    }

    if (liftVelocity < 0) {

        liftAnimation -=
            delta * 2.1;

        if (liftAnimation <= 0) {

            liftAnimation = 0;

            liftVelocity = 0;

        }

    }
}


/* =========================================================
   CÁMARA
   ========================================================= */

function updateCamera(delta) {

    if (cameraShake > 0) {

        cameraShake =
            Math.max(
                0,
                cameraShake -
                delta * 25
            );

    }
}


/* =========================================================
   RENDER PRINCIPAL
   ========================================================= */

function render() {

    ctx.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );

    ctx.save();

    if (cameraShake > 0) {

        ctx.translate(
            random(-cameraShake, cameraShake),
            random(-cameraShake, cameraShake)
        );

    }

    drawBackground();

    drawFloor();

    drawParticles();

    drawCharacter();

    drawBarbell();

    ctx.restore();
}


/* =========================================================
   FONDO CANVAS
   ========================================================= */

function drawBackground() {

    const gradient =
        ctx.createRadialGradient(
            canvasWidth / 2,
            canvasHeight * 0.62,
            20,
            canvasWidth / 2,
            canvasHeight * 0.62,
            canvasWidth * 0.62
        );

    gradient.addColorStop(
        0,
        "rgba(255,255,255,0.045)"
    );

    gradient.addColorStop(
        0.45,
        "rgba(255,255,255,0.012)"
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


    /*
       Luz superior.
    */

    const topGradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvasHeight
        );

    topGradient.addColorStop(
        0,
        "rgba(255,255,255,0.018)"
    );

    topGradient.addColorStop(
        0.35,
        "rgba(255,255,255,0)"
    );

    topGradient.addColorStop(
        1,
        "rgba(255,0,0,0.018)"
    );

    ctx.fillStyle =
        topGradient;

    ctx.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );
}


/* =========================================================
   SUELO
   ========================================================= */

function drawFloor() {

    const floorY =
        character.groundY + 4;

    /*
       Sombra principal.
    */

    const shadow =
        ctx.createRadialGradient(
            character.x,
            floorY,
            10,
            character.x,
            floorY,
            260 * character.scale
        );

    shadow.addColorStop(
        0,
        "rgba(0,0,0,0.75)"
    );

    shadow.addColorStop(
        0.55,
        "rgba(0,0,0,0.35)"
    );

    shadow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = shadow;

    ctx.beginPath();

    ctx.ellipse(
        character.x,
        floorY,
        250 * character.scale,
        40 * character.scale,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       Línea del suelo.
    */

    ctx.beginPath();

    ctx.moveTo(
        canvasWidth * 0.18,
        floorY
    );

    ctx.lineTo(
        canvasWidth * 0.82,
        floorY
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.09)";

    ctx.lineWidth = 1;

    ctx.stroke();
}


/* =========================================================
   PERSONAJE
   ========================================================= */

function drawCharacter() {

    const s = character.scale;

    const lift =
        getLiftPose();

    const cx =
        character.x;

    const ground =
        character.groundY;


    /*
       Piernas.
    */

    drawLegs(
        cx,
        ground,
        s,
        lift
    );


    /*
       Torso.
    */

    drawTorso(
        cx,
        ground,
        s,
        lift
    );


    /*
       Cabeza.
    */

    drawHead(
        cx,
        ground,
        s,
        lift
    );


    /*
       Brazos.
    */

    drawArms(
        cx,
        ground,
        s,
        lift
    );
}


/* =========================================================
   POSE
   ========================================================= */

function getLiftPose() {

    /*
       0 = abajo
       1 = arriba
    */

    const t =
        easeInOutCubic(
            liftAnimation
        );

    return {

        bodyLift:
            t * 18,

        knee:
            lerp(
                0.7,
                0.15,
                t
            ),

        torsoAngle:
            lerp(
                0.27,
                0.035,
                t
            ),

        armAngle:
            lerp(
                0.12,
                -0.05,
                t
            )

    };
}


/* =========================================================
   PIERNAS
   ========================================================= */

function drawLegs(
    cx,
    ground,
    s,
    pose
) {

    ctx.save();

    ctx.scale(s, s);

    const baseY =
        ground / s;

    const bodyLift =
        pose.bodyLift;

    const hipY =
        baseY - 185 - bodyLift;

    const kneeY =
        hipY + 78 +
        pose.knee * 25;

    const footY =
        baseY - 3;


    /*
       Pierna izquierda.
    */

    drawMuscleLimb(
        cx / s - 32,
        hipY,
        cx / s - 42,
        kneeY,
        cx / s - 47,
        footY,
        27,
        25
    );


    /*
       Pierna derecha.
    */

    drawMuscleLimb(
        cx / s + 32,
        hipY,
        cx / s + 42,
        kneeY,
        cx / s + 47,
        footY,
        27,
        25
    );


    /*
       Zapatillas.
    */

    drawShoe(
        cx / s - 48,
        footY,
        -1
    );

    drawShoe(
        cx / s + 48,
        footY,
        1
    );

    ctx.restore();
}


/* =========================================================
   EXTREMIDAD MUSCULAR
   ========================================================= */

function drawMuscleLimb(
    x1,
    y1,
    x2,
    y2,
    x3,
    y3,
    width1,
    width2
) {

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    /*
       Parte superior.
    */

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.strokeStyle =
        "#171717";

    ctx.lineWidth =
        width1;

    ctx.stroke();


    /*
       Brillo muscular.
    */

    ctx.beginPath();

    ctx.moveTo(
        x1 - 3,
        y1
    );

    ctx.lineTo(
        x2 - 2,
        y2
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.12)";

    ctx.lineWidth =
        width1 * 0.27;

    ctx.stroke();


    /*
       Pantorrilla.
    */

    ctx.beginPath();

    ctx.moveTo(x2, y2);

    ctx.lineTo(x3, y3);

    ctx.strokeStyle =
        "#131313";

    ctx.lineWidth =
        width2;

    ctx.stroke();


    /*
       Brillo.
    */

    ctx.beginPath();

    ctx.moveTo(
        x2 - 2,
        y2
    );

    ctx.lineTo(
        x3 - 2,
        y3
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.1)";

    ctx.lineWidth =
        width2 * 0.23;

    ctx.stroke();
}


/* =========================================================
   ZAPATILLA
   ========================================================= */

function drawShoe(x, y, direction) {

    ctx.beginPath();

    ctx.moveTo(
        x,
        y - 13
    );

    ctx.lineTo(
        x + direction * 35,
        y - 7
    );

    ctx.quadraticCurveTo(
        x + direction * 42,
        y,
        x + direction * 37,
        y + 6
    );

    ctx.lineTo(
        x - direction * 3,
        y + 6
    );

    ctx.closePath();

    ctx.fillStyle =
        "#0c0c0c";

    ctx.fill();

    ctx.strokeStyle =
        "rgba(255,255,255,0.14)";

    ctx.lineWidth = 2;

    ctx.stroke();
}


/* =========================================================
   TORSO
   ========================================================= */

function drawTorso(
    cx,
    ground,
    s,
    pose
) {

    ctx.save();

    ctx.translate(
        cx,
        ground
    );

    ctx.scale(s, s);

    const lift =
        pose.bodyLift;

    const angle =
        pose.torsoAngle;

    ctx.rotate(angle);


    const torsoTop =
        -315 - lift;

    const torsoBottom =
        -145 - lift;


    /*
       Sombra exterior.
    */

    ctx.beginPath();

    ctx.moveTo(
        -45,
        torsoTop
    );

    ctx.quadraticCurveTo(
        -90,
        torsoTop + 70,
        -63,
        torsoBottom
    );

    ctx.quadraticCurveTo(
        0,
        torsoBottom + 20,
        63,
        torsoBottom
    );

    ctx.quadraticCurveTo(
        90,
        torsoTop + 70,
        45,
        torsoTop
    );

    ctx.closePath();

    ctx.fillStyle =
        "#111111";

    ctx.fill();


    /*
       Pecho.
    */

    ctx.beginPath();

    ctx.moveTo(
        -44,
        torsoTop + 18
    );

    ctx.quadraticCurveTo(
        -5,
        torsoTop - 3,
        0,
        torsoTop + 20
    );

    ctx.quadraticCurveTo(
        5,
        torsoTop - 3,
        44,
        torsoTop + 18
    );

    ctx.quadraticCurveTo(
        62,
        torsoTop + 55,
        48,
        torsoTop + 83
    );

    ctx.lineTo(
        15,
        torsoTop + 70
    );

    ctx.lineTo(
        0,
        torsoTop + 85
    );

    ctx.lineTo(
        -15,
        torsoTop + 70
    );

    ctx.lineTo(
        -48,
        torsoTop + 83
    );

    ctx.quadraticCurveTo(
        -62,
        torsoTop + 55,
        -44,
        torsoTop + 18
    );

    ctx.closePath();

    ctx.fillStyle =
        "#1b1b1b";

    ctx.fill();


    /*
       Línea central del pecho.
    */

    ctx.beginPath();

    ctx.moveTo(
        0,
        torsoTop + 15
    );

    ctx.lineTo(
        0,
        torsoTop + 72
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.12)";

    ctx.lineWidth = 3;

    ctx.stroke();


    /*
       Abdominales.
    */

    drawAbs(
        0,
        torsoTop + 80
    );


    /*
       Cintura.
    */

    ctx.beginPath();

    ctx.moveTo(
        -47,
        torsoBottom - 8
    );

    ctx.quadraticCurveTo(
        0,
        torsoBottom + 13,
        47,
        torsoBottom - 8
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.13)";

    ctx.lineWidth = 5;

    ctx.stroke();

    ctx.restore();
}


/* =========================================================
   ABDOMINALES
   ========================================================= */

function drawAbs(x, y) {

    for (let row = 0; row < 3; row++) {

        const yy =
            y + row * 22;

        ctx.beginPath();

        ctx.roundRect(
            x - 26,
            yy,
            22,
            15,
            5
        );

        ctx.roundRect(
            x + 4,
            yy,
            22,
            15,
            5
        );

        ctx.fillStyle =
            "rgba(255,255,255,0.055)";

        ctx.fill();
    }
}


/* =========================================================
   CABEZA
   ========================================================= */

function drawHead(
    cx,
    ground,
    s,
    pose
) {

    ctx.save();

    ctx.translate(
        cx,
        ground
    );

    ctx.scale(s, s);

    ctx.rotate(
        pose.torsoAngle
    );

    const y =
        -370 - pose.bodyLift;


    /*
       Cuello.
    */

    ctx.fillStyle =
        "#151515";

    ctx.fillRect(
        -17,
        y + 34,
        34,
        44
    );


    /*
       Cabeza.
    */

    ctx.beginPath();

    ctx.ellipse(
        0,
        y,
        34,
        40,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#171717";

    ctx.fill();


    /*
       Mandíbula.
    */

    ctx.beginPath();

    ctx.moveTo(
        -28,
        y + 4
    );

    ctx.quadraticCurveTo(
        -22,
        y + 40,
        0,
        y + 48
    );

    ctx.quadraticCurveTo(
        24,
        y + 39,
        29,
        y + 4
    );

    ctx.fillStyle =
        "#141414";

    ctx.fill();


    /*
       Pelo.
    */

    ctx.beginPath();

    ctx.arc(
        0,
        y - 8,
        35,
        Math.PI,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#080808";

    ctx.fill();


    /*
       Cara iluminada.
    */

    ctx.beginPath();

    ctx.ellipse(
        -8,
        y - 3,
        9,
        18,
        -0.15,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255,255,255,0.06)";

    ctx.fill();


    /*
       Barba.
    */

    ctx.beginPath();

    ctx.arc(
        0,
        y + 17,
        22,
        0,
        Math.PI
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.09)";

    ctx.lineWidth = 5;

    ctx.stroke();


    /*
       Ojos.
    */

    ctx.fillStyle =
        "rgba(255,255,255,0.65)";

    ctx.beginPath();

    ctx.arc(
        -11,
        y - 4,
        2.3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        11,
        y - 4,
        2.3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


/* =========================================================
   BRAZOS
   ========================================================= */

function drawArms(
    cx,
    ground,
    s,
    pose
) {

    ctx.save();

    ctx.translate(
        cx,
        ground
    );

    ctx.scale(s, s);

    ctx.rotate(
        pose.torsoAngle
    );

    const shoulderY =
        -285 - pose.bodyLift;

    const elbowY =
        -185 - pose.bodyLift;

    const handY =
        -128 - pose.bodyLift;


    /*
       Brazo izquierdo.
    */

    drawArm(
        -45,
        shoulderY,
        -85,
        elbowY,
        -83,
        handY
    );


    /*
       Brazo derecho.
    */

    drawArm(
        45,
        shoulderY,
        85,
        elbowY,
        83,
        handY
    );

    ctx.restore();
}


/* =========================================================
   BRAZO
   ========================================================= */

function drawArm(
    shoulderX,
    shoulderY,
    elbowX,
    elbowY,
    handX,
    handY
) {

    /*
       Hombro.
    */

    ctx.beginPath();

    ctx.arc(
        shoulderX,
        shoulderY,
        25,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#191919";

    ctx.fill();


    /*
       Bíceps.
    */

    ctx.beginPath();

    ctx.moveTo(
        shoulderX,
        shoulderY
    );

    ctx.lineTo(
        elbowX,
        elbowY
    );

    ctx.strokeStyle =
        "#171717";

    ctx.lineWidth = 31;

    ctx.lineCap = "round";

    ctx.stroke();


    /*
       Bíceps iluminado.
    */

    ctx.beginPath();

    ctx.moveTo(
        shoulderX - 4,
        shoulderY
    );

    ctx.lineTo(
        elbowX - 4,
        elbowY
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.12)";

    ctx.lineWidth = 7;

    ctx.stroke();


    /*
       Antebrazo.
    */

    ctx.beginPath();

    ctx.moveTo(
        elbowX,
        elbowY
    );

    ctx.lineTo(
        handX,
        handY
    );

    ctx.strokeStyle =
        "#121212";

    ctx.lineWidth = 23;

    ctx.stroke();


    /*
       Mano.
    */

    ctx.beginPath();

    ctx.arc(
        handX,
        handY,
        13,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#0d0d0d";

    ctx.fill();
}


/* =========================================================
   BARRA
   ========================================================= */

function drawBarbell() {

    const s =
        character.scale;

    const ground =
        character.groundY;

    const pose =
        getLiftPose();

    /*
       La barra sigue las manos.
    */

    const barY =
        ground -
        (145 + pose.bodyLift) * s;

    const barWidth =
        Math.min(
            canvasWidth * 0.78,
            650
        );

    const left =
        character.x -
        barWidth / 2;

    const right =
        character.x +
        barWidth / 2;


    /*
       Sombra de barra.
    */

    ctx.save();

    ctx.translate(
        0,
        barY
    );


    /*
       Barra principal.
    */

    const barGradient =
        ctx.createLinearGradient(
            left,
            -4,
            right,
            4
        );

    barGradient.addColorStop(
        0,
        "#555555"
    );

    barGradient.addColorStop(
        0.5,
        "#eeeeee"
    );

    barGradient.addColorStop(
        1,
        "#555555"
    );

    ctx.fillStyle =
        barGradient;

    ctx.fillRect(
        left,
        -3,
        barWidth,
        6
    );


    /*
       Centro de agarre.
    */

    ctx.fillStyle =
        "#111111";

    ctx.fillRect(
        character.x - 58,
        -7,
        116,
        14
    );


    /*
       Textura del agarre.
    */

    ctx.strokeStyle =
        "rgba(255,255,255,0.16)";

    ctx.lineWidth = 1;

    for (
        let x = character.x - 50;
        x < character.x + 50;
        x += 7
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            -6
        );

        ctx.lineTo(
            x + 5,
            6
        );

        ctx.stroke();

    }


    /*
       Discos.
    */

    drawWeightPlates(
        left + 35,
        weight
    );

    drawWeightPlates(
        right - 35,
        weight
    );


    /*
       Collares.
    */

    ctx.fillStyle =
        "#d0d0d0";

    ctx.fillRect(
        left + 20,
        -8,
        9,
        16
    );

    ctx.fillRect(
        right - 29,
        -8,
        9,
        16
    );


    ctx.restore();
}


/* =========================================================
   DISCOS DE PESO
   ========================================================= */

function drawWeightPlates(
    x,
    currentWeight
) {

    const count =
        Math.min(
            1 + Math.floor(currentWeight / 10),
            8
        );

    const maxWeightVisual =
        80;

    const visualWeight =
        Math.min(
            currentWeight,
            maxWeightVisual
        );


    /*
       Disco base.
    */

    const plateCount =
        Math.max(
            1,
            Math.ceil(
                visualWeight / 10
            )
        );


    for (
        let i = 0;
        i < plateCount;
        i++
    ) {

        const offset =
            i * 10;

        const thickness =
            8 + Math.min(
                4,
                currentWeight / 20
            );

        const radius =
            40 +
            Math.min(
                10,
                currentWeight / 8
            );


        ctx.beginPath();

        ctx.roundRect(
            x > character.x
                ? x + offset
                : x - offset - thickness,
            -radius,
            thickness,
            radius * 2,
            3
        );

        ctx.fillStyle =
            i % 2 === 0
                ? "#1a1a1a"
                : "#101010";

        ctx.fill();

        ctx.strokeStyle =
            "rgba(255,255,255,0.14)";

        ctx.lineWidth = 1.5;

        ctx.stroke();


        /*
           Línea interior.
        */

        ctx.beginPath();

        ctx.moveTo(
            x > character.x
                ? x + offset + 3
                : x - offset - thickness + 3,
            -radius + 9
        );

        ctx.lineTo(
            x > character.x
                ? x + offset + 3
                : x - offset - thickness + 3,
            radius - 9
        );

        ctx.strokeStyle =
            "rgba(255,255,255,0.06)";

        ctx.stroke();
    }


    /*
       Disco final grande.
    */

    const finalRadius =
        40 +
        Math.min(
            10,
            currentWeight / 8
        );

    ctx.beginPath();

    ctx.arc(
        x,
        0,
        7,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#050505";

    ctx.fill();

    ctx.strokeStyle =
        "rgba(255,255,255,0.2)";

    ctx.stroke();
}


/* =========================================================
   PARTÍCULAS CANVAS
   ========================================================= */

function drawParticles() {

    for (const p of particles) {

        ctx.globalAlpha =
            clamp(p.life, 0, 1);

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(255,255,255,0.7)";

        ctx.fill();
    }

    ctx.globalAlpha = 1;
}


/* =========================================================
   CONTROLES
   ========================================================= */

liftButton.addEventListener(
    "pointerdown",
    (event) => {

        event.preventDefault();

        performLift();

    }
);


/*
   Click/tap en el Canvas.
*/

canvas.addEventListener(
    "pointerdown",
    (event) => {

        if (!gameRunning) {
            return;
        }

        event.preventDefault();

        performLift();

    }
);


/*
   Teclado.
*/

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code === "Space" ||
            event.key === " "
        ) {

            event.preventDefault();

            performLift();

        }

    }
);


/* =========================================================
   BOTONES
   ========================================================= */

startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    () => {

        resultScreen.hidden = true;

        startGame();

    }
);


backButton.addEventListener(
    "click",
    () => {

        history.back();

    }
);


resultBackButton.addEventListener(
    "click",
    () => {

        history.back();

    }
);


/* =========================================================
   EVITAR DOBLE ACTIVACIÓN
   ========================================================= */

liftButton.addEventListener(
    "click",
    (event) => {

        event.preventDefault();

    }
);


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

resizeCanvas();

updateHUD();

liftButton.style.display = "none";


/* =========================================================
   LOOP INICIAL
   ========================================================= */

lastFrameTime =
    performance.now();

animationFrame =
    requestAnimationFrame(gameLoop);