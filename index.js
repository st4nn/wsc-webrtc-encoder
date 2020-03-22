import RequesResources from "./libs/RequestResources.js";
import Previewer from "./libs/Preview.js";

class WebRTCEncoder{
    constructor({ canvasPreview, canvasProgram }){
        this.previewer = new Previewer(canvasPreview);
        this.program = new Previewer(canvasProgram);
    }

    request(){
        return new RequesResources();
    }
}

export { WebRTCEncoder };