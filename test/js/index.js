function pageReady(WebRTCEncoder){
    const webrtcEncoder = new WebRTCEncoder({
        canvasPreview: document.getElementById("preview-canvas")
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

    addLayoutFunctions(webrtcEncoder, localVideo, localScreen);

    addLetterheadFunctions(webrtcEncoder);

    addBackgroundFunctions(webrtcEncoder);
}
