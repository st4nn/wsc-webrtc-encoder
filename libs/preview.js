class PreviewOnCanvas {
    constructor(canvas, options = {}) {
        const { videoFrameRate = "29.97", width = 1280, height = 720, frecuency = 140 } = options;
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
        this.frecuency = frecuency;
    }
    status() {
        return this.isDrawingOnCanvas;
    }
    start() {
        if (this.isDrawingOnCanvas) {
            clearTimeout(this.interval);
            this.isDrawingOnCanvas = false;
        }

        this.isDrawingOnCanvas = true;
        const canvas = window.canvas = this.canvasElement;

        const previewStream = canvas.captureStream(27);
        const ctx = canvas.getContext("2d");

        canvas.width = this.settings.width;
        canvas.height = this.settings.height;

        const resources = this.resources.map(({ src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight }) => {
            if (typeof sx === "function") {
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

            return { src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight };
        });

        canvas.width = this.settings.width;
        canvas.height = this.settings.height;

        const draw = (self) => {
            if (self.background) {
                ctx.drawImage(self.background, 0, 0, canvas.width, canvas.height);
            }

            resources.forEach(({ src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight }) => {
                try {
                    if (sHeight) {
                        ctx.drawImage(src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                    } else {
                        if (dHeight) {
                            ctx.drawImage(src, dx, dy, dWidth, dHeight);
                        } else {
                            ctx.drawImage(src, dx, dy);
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            });

            if (self.text) {
                const { value = "", background = false, size = 50, color = "black", subtitle = "" } = self.text;
                if (background) {
                    ctx.drawImage(self.text.background, 0, (canvas.height * 0.833333333));
                }

                ctx.font = `${size}px Arial`;
                ctx.fillStyle = color
                ctx.fillText(value, (canvas.width * 0.034375), (canvas.height * 0.9111111));
                ctx.font = `${size * 0.7}px Arial`;
                ctx.fillText(subtitle, (canvas.width * 0.034375), (canvas.height * 0.9111111) + size * 0.7 + 5);
            }

            this.interval = setTimeout(() => {
                if (this.interval) {
                    draw(this);
                }
            }, this.frecuency);
        }

        draw(this);

        return previewStream;
    }
    stop() {
        if (this.isDrawingOnCanvas) {
            clearTimeout(this.interval);
            this.isDrawingOnCanvas = false;
        }
    }
    update({
        videoFrameRate = this.settings.videoFrameRate,
        width = this.settings.width,
        height = this.settings.height,
        canvas = this.canvasElement
    }) {
        this.stop();
        this.settings = {
            videoFrameRate: parseFloat(videoFrameRate),
            width,
            height
        };
        this.canvasElement = canvas;
        this.start();
    }

    addResources(resources = []) {
        resources.forEach(({ src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight }) => {
            this.resources.push({ src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight });
        });
        this.stop();
        this.start();
    }
    removeAllResources() {
        this.resources = [];
    }
    getAllResources() {
        return {
            resources: this.resources,
            text: this.text,
            background: this.background
        }
    }
    addText({ background, size = 50, color = "#FFFFFF", value = "", subtitle = "" }) {
        this.text = {
            background,
            size,
            color,
            value,
            subtitle
        };
    }
    removeText() {
        this.text = false;
    }

    addBackground(image) {
        this.background = image;
    }

    removeBackground() {
        this.background = false;
    }

    setFrecuency(newFrecuency) {
        try {
            this.frecuency = parseInt(newFrecuency, 10);
            this.start();
        } catch (error) {
            console.error(error);
        }
    }
}

export default PreviewOnCanvas;
