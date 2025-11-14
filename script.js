// PAGE SWITCHING
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(pageId).classList.remove("hidden");
}

// SIMPLE AI GENERATOR (you can replace this later)
// Make sure your HTML has these elements:
// <input type="text" id="prompt" placeholder="Enter your prompt">
// <button id="generate">Generate</button>
// <img id="ai-image" src="" alt="Generated Image">

document.getElementById('generate').addEventListener('click', function() {
    const prompt = document.getElementById('prompt').value.trim();

    if (!prompt) {
        alert("Please enter a prompt!");
        return;
    }

    // Unsplash URL that searches by the prompt
    const imageUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(prompt)}`;

    // Set the image src to the new URL
    document.getElementById('ai-image').src = imageUrl;
});

// WHITEBOARD FULL FEATURE SET
let canvas = document.getElementById("board");
let ctx = canvas.getContext("2d");
let drawing = false;
let brushSize = document.getElementById("brushSize");
let colorPicker = document.getElementById("colorPicker");
let erase = false;

let undoStack = [];
let redoStack = [];

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

function startDrawing(e) {
    drawing = true;
    saveState();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = erase ? "#ffffff" : colorPicker.value;

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

function eraseMode() {
    erase = !erase;
}

function clearBoard() {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// AI IMAGE AS BACKGROUND
function useGenerated() {
    let img = document.getElementById("generated-image");
    let temp = new Image();
    temp.src = img.src;

    temp.onload = () => {
        saveState();
        ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
    }
}

// UNDO / REDO
function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = [];
}

function undo() {
    if (undoStack.length === 0) return;
    redoStack.push(canvas.toDataURL());
    let restore = undoStack.pop();
    let img = new Image();
    img.src = restore;
    img.onload = () => ctx.drawImage(img, 0, 0);
}

function redo() {
    if (redoStack.length === 0) return;
    undoStack.push(canvas.toDataURL());
    let restore = redoStack.pop();
    let img = new Image();
    img.src = restore;
    img.onload = () => ctx.drawImage(img, 0, 0);
}

// DOWNLOAD DRAWING
function downloadCanvas() {
    let link = document.createElement("a");
    link.download = "my_drawing.png";
    link.href = canvas.toDataURL();
    link.click();
}

// BLOCK COPYING SHORTCUTS
document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "s" || e.key === "p")) {
        e.preventDefault();
    }
});
