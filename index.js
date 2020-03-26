import RequesResources from "./libs/RequestResources.js";
import Previewer from "./libs/Preview.js";
import Connection from "./libs/Connection.js";

class WebRTCEncoder{
    constructor({ canvasPreview, canvasProgram, wsc_settings = {} }){
        this.previewer = new Previewer(canvasPreview);
        this.program = new Previewer(canvasProgram);
        this.wsc = new Connection(wsc_settings)
    }

    request(){
        return new RequesResources();
    }
}

export { WebRTCEncoder };