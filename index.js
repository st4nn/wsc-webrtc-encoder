import RequesResources from "./libs/RequestResources.js";
import Previewer from "./libs/Preview.js";

class WebRTCEncoder{
    constructor({ canvasPreview }){
        this.previewer = new Previewer(canvasPreview);
    }

    request(){
        return new RequesResources();
    }
}

export { WebRTCEncoder };