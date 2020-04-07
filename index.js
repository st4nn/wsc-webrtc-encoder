import RequestResources from "./libs/requestResources.js";
import Previewer from "./libs/preview.js";
import Connection from "./libs/connection.js";

class WebRTCEncoder{
    constructor({ canvasPreview, canvasProgram, wsc_settings = {} }){
        this.previewer = new Previewer(canvasPreview);
        this.program = new Previewer(canvasProgram);
        this.wsc = new Connection(wsc_settings)
    }

    request(){
        return new RequestResources();
    }
}

export default WebRTCEncoder;