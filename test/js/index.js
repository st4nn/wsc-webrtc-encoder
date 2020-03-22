function pageReady(WebRTCEncoder){
    const webrtcEncoder = new WebRTCEncoder({
        canvasPreview: document.getElementById("preview-canvas"),
        canvasProgram: document.getElementById("program-canvas")
    });

    const 
        localAudio = document.getElementById("localAudio"), 
        localVideo = document.getElementById("localVideo"),
        localScreen = document.getElementById("localScreen");

    document.getElementById("btnShare-Camera").addEventListener("click", ()=>{
        webrtcEncoder.request().camera(localVideo);
    });

    document.getElementById("btnShare-Screen").addEventListener("click", () => {
        webrtcEncoder.request().screen(localScreen);
    });

    document.getElementById("btnShare-Microphone").addEventListener("click", () => {
        webrtcEncoder.request().microphone(localAudio);
    });

    document.getElementById("btnPublishPreview").addEventListener("click", () => {
        const previewResources = webrtcEncoder.previewer.getAllResources();
        webrtcEncoder.program.stop();
        webrtcEncoder.program.removeAllResources();
        webrtcEncoder.program.removeText();
        webrtcEncoder.program.removeBackground();
        
        previewResources.resources.forEach((resource)=>{
            webrtcEncoder.program.addResource(resource);
        });

        webrtcEncoder.program.addText(previewResources.text);
        webrtcEncoder.program.addBackground(previewResources.background);
        webrtcEncoder.program.start();
    });

    

    addLayoutFunctions(webrtcEncoder, localVideo, localScreen);

    addLetterheadFunctions(webrtcEncoder);

    addBackgroundFunctions(webrtcEncoder);
}
