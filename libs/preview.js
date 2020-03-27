class PreviewOnCanvas{
    constructor(canvas, options = {}){
        const { videoFrameRate = "29.97", width = 1280, height = 720 } = options;
        this.settings = { 
            videoFrameRate: parseFloat(videoFrameRate),
            width,
            height
        };
        this.canvasElement = canvas;

        this.isDrawingOnCanvas = false;
        this.interval = null;

        this.resources = [];
        this.text = false;
        this.background = false;
    }
    status(){
        return this.isDrawingOnCanvas;
    }
    start(){
        if (this.isDrawingOnCanvas) {
            clearInterval(this.interval);
            this.isDrawingOnCanvas = false;
        } else {
            this.isDrawingOnCanvas = true;
            const canvas = window.canvas = this.canvasElement;

            const previewStream = canvas.captureStream(parseFloat(this.settings.videoFrameRate));
            const ctx = canvas.getContext("2d");

            this.drawingOnCanvas = setInterval(() => {
                canvas.width = this.settings.width;
                canvas.height = this.settings.height;

                if (this.background) {
                    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
                }
                
                this.resources.forEach(( {src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight} )=>{
                    if (typeof sx === "function"){
                        sx = sx(this.settings.width);
                    }

                    if (typeof sy === "function") {
                        sy = sy(this.settings.height);
                    }

                    if (typeof sWidth === "function") {
                        sWidth = sWidth(this.settings.width);
                    }

                    if (typeof sHeight === "function") {
                        sHeight = sHeight(this.settings.height);
                    }

                    if (typeof dx === "function") {
                        dx = dx(this.settings.width);
                    }

                    if (typeof dy === "function") {
                        dy = dy(this.settings.height);
                    }

                    if (typeof dWidth === "function") {
                        dWidth = dWidth(this.settings.width);
                    }

                    if (typeof dHeight === "function") {
                        dHeight = dHeight(this.settings.height);
                    }

                    try{
                        if (sHeight){
                            ctx.drawImage(src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight );
                        } else{
                            if (dHeight){
                                ctx.drawImage(src, dx, dy, dWidth, dHeight);
                            } else{
                                ctx.drawImage(src, dx, dy);
                            }
                        }
                    } catch(error){
                        console.error(error);
                    }
                });

                if (this.text) {
                    const { value = "", background = false, size = 50, color = "black" } = this.text;
                    if (background){
                        ctx.drawImage(this.text.background, 0, (canvas.height * 0.833333333));
                    }

                    ctx.font = `${size}px Arial`;
                    ctx.fillStyle = color
                    ctx.fillText(value, (canvas.width * 0.034375), (canvas.height * 0.944444444));
                }
            }, 140);

            return previewStream;
        }
    }
    stop(){
        if (this.isDrawingOnCanvas) {
            clearInterval(this.interval);
            this.isDrawingOnCanvas = false;
        }
    }
    update({ 
            videoFrameRate = this.settings.videoFrameRate,
            width = this.settings.width,
            height = this.settings.height,
            canvas = this.canvasElement
        }){
        this.stop();
        this.settings = {
            videoFrameRate: parseFloat(videoFrameRate),
            width,
            height
        };
        this.canvasElement = canvas;
        this.start();
    }

    addResource({ src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight }){
        this.resources.push({ src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight });
    }
    removeAllResources(){
        this.resources = [];
    }
    getAllResources(){
        return {
            resources: this.resources,
            text: this.text,
            background: this.background
        }
    }
    addText({ background, size, color, value }){
        this.text = {
            background,
            size,
            color,
            value
        };
    }
    removeText(){
        this.text = false;
    }

    addBackground(image){
        this.background = image;
    }

    removeBackground(){
        this.background = false;
    }
}

export default PreviewOnCanvas;
