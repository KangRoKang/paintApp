
const saveBtn = document.getElementById("save")
const textInput = document.getElementById("text")
const fileInput = document.getElementById("file")
const modeBtn = document.querySelector("#mode-btn")
const eraserBtn = document.querySelector("#eraser-btn")
const destroyBtn = document.querySelector("#destroy-btn")
const colorOptions = Array.from(document.getElementsByClassName("color-option"))
const canvas = document.querySelector("canvas")
const color = document.getElementById("color")
const rotation = document.querySelector("#img-rotation")
const lineWidth = document.querySelector("#line-width")
const ctx = canvas.getContext("2d");
const cursor = document.querySelector(".cursor")

let IMGSRC = ""

CANVASWIDTH = 1100;
CANVASHEIGHT = 655;
canvas.width = CANVASWIDTH
canvas.height = CANVASHEIGHT
ctx.lineCap = "round"
ctx.lineWidth = lineWidth.value/2.5
let isPainting = false;
let isFilling = false;
let isStickering = false;
let isTexting = false;

document.onmousemove = (e) => {
    cursor.style.left = e.pageX + "px";
    if (isTexting){
        cursor.style.top = e.pageY-200 + "px";
    } else{
        cursor.style.top = e.pageY + "px";
    }
    
}

function INITIALIZING(){
    isFilling = false;
    isPainting = false;
    isStickering = false;
    isTexting = false;
}

function onMove(event){
    if(isPainting){
        ctx.lineTo(event.offsetX,event.offsetY)
        ctx.stroke();
        return;
    }
    ctx.beginPath()
    ctx.moveTo(event.offsetX, event.offsetY)
}

function onMouseDown(){
    isPainting = true;
}

function onMouseUp(){
    isPainting = false;
}

function onLineWidthChange(){
    document.getElementById("line-width-text").innerText = `size : ${lineWidth.value} (${parseInt(2/(1/lineWidth.value))}%)`
    ctx.lineWidth = lineWidth.value/2.5
    document.querySelector(".cursorText").style = `font:${lineWidth.value * 2}px serif`
}

function onRotationChange(){
    document.getElementById("img-rotation-text").innerText = `rotation : ${rotation.value}`


}

function onColorChange(event){
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
    document.querySelector(".cursorText").style = `font:${lineWidth.value * 2}px serif;`
}

function onColorClick(event){
    ctx.strokeStyle = event.target.dataset.color;
    ctx.fillStyle = event.target.dataset.color;
    color.value = event.target.dataset.color;
}

function onCanvasClick(event){
    if(isFilling){
        ctx.fillRect(0, 0, CANVASWIDTH, CANVASHEIGHT)
    } else if(isStickering){
        const img = new Image()
        img.src = IMGSRC
        img.onload = function(){
            ctx.drawImage(img, event.offsetX, event.offsetY)
            fileInput.value = null
        }
        IMGSRC = ""
        document.querySelector(".cursorImg").classList.add("hidden")
    } else if(isTexting){
        const text = textInput.value;
    
        if (text !== ""){
        INITIALIZING()
        ctx.lineWidth = 1
        ctx.font = `${lineWidth.value * 2}px serif`
        ctx.fillText(text, event.offsetX, event.offsetY)
        ctx.lineWidth = lineWidth.value/2.5
        }
        textInput.value = "";
        isTexting = false;
        document.querySelector(".cursorText").classList.add("hidden")
    }
}

function onDestroyClick(){
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,CANVASWIDTH,CANVASHEIGHT)
}

function onModeClick(){
    if (isFilling){
        isFilling = false
        modeBtn.innerText = "Mode : 🖌️"
    } else {
        isFilling = true
        modeBtn.innerText = "Mode : 🪣"
    }
}

function onEraserClick(){
    ctx.strokeStyle = "white";
    INITIALIZING()
    modeBtn.innerText = "Mode : 🖌️"
}

function onFileChange(event){
    const file = event.target.files[0]
    const url = URL.createObjectURL(file)
    document.querySelector(".cursorImg").src = url
    document.querySelector(".cursorImg").classList.remove("hidden")
    IMGSRC = url
    INITIALIZING()
    isStickering = true;
    modeBtn.innerText = "Mode : 🖼️"
}

function onDoubleClick(event){
    const text = textInput.value;
    
    if (text !== ""){
    INITIALIZING()
    ctx.lineWidth = 1
    ctx.font = `${lineWidth.value * 2}px serif`
    ctx.fillText(text, event.offsetX, event.offsetY)
    ctx.lineWidth = lineWidth.value/2.5
    }
}

function onSaveClick(){
    const url = canvas.toDataURL();
    const a = document.createElement("a")
    a.href = url
    a.download = "myDrawing.png"
    a.click();
}

function onTextChange(){
    document.querySelector(".cursorText").classList.remove("hidden")
    document.querySelector(".cursorText").innerText = textInput.value;
    INITIALIZING()
    isTexting = true;
    document.querySelector(".cursorText").style = `font:${lineWidth.value * 2}px serif`
    modeBtn.innerText = "Mode : 💬"
}

canvas.addEventListener('dblclick', onDoubleClick)
canvas.addEventListener("mousemove", onMove)
canvas.addEventListener("click", onCanvasClick)
document.addEventListener("mousedown", onMouseDown)
document.addEventListener("mouseup",onMouseUp)

rotation.addEventListener("change",onRotationChange)
lineWidth.addEventListener("change",onLineWidthChange)
color.addEventListener("change",onColorChange)

colorOptions.forEach(color => color.addEventListener("click",onColorClick))

modeBtn.addEventListener("click",onModeClick)
destroyBtn.addEventListener("click",onDestroyClick)
eraserBtn.addEventListener("click",onEraserClick)
fileInput.addEventListener("change", onFileChange)
saveBtn.addEventListener("click",onSaveClick)
textInput.addEventListener("change",onTextChange)