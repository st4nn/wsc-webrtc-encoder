function pageReady(WebRTCEncoder){
    const webrtcEncoder = new WebRTCEncoder({
        canvasPreview: document.getElementById("preview-canvas"),
        canvasProgram: document.getElementById("program-canvas"),
        wsc_settings: {
            url: document.getElementById("sdpURL").value,
            applicationName: document.getElementById("applicationName").value,
            streamName: document.getElementById("streamName").value,
            videoBitrate: parseInt(document.getElementById("videoBitrate").value, 10), 
            audioBitrate: parseInt(document.getElementById("audioBitrate").value, 10), 
            videoFrameRate: document.getElementById("videoFrameRate").value, 
            videoChoice: document.getElementById("videoChoice").value, 
            audioChoice: document.getElementById("audioChoice").value 
        }
    });

    document.getElementById("frmSettings").addEventListener("submit", (e)=>{
        e.preventDefault();
        const elements = e.target.elements;

        webrtcEncoder.wsc.updateSettings({
            url: elements[sdpURL].value,
            applicationName: elements[applicationName].value,
            streamName: elements[streamName].value,
            videoBitrate: parseInt(elements[videoBitrate].value, 10),
            audioBitrate: parseInt(elements[audioBitrate].value, 10),
            videoFrameRate: elements[videoFrameRate].value,
            videoChoice: elements[videoChoice].value,
            audioChoice: elements[audioChoice].value
        });
    });

    const 
        localAudio = document.getElementById("localAudio"), 
        localVideo = document.getElementById("localVideo"),
        localScreen = document.getElementById("localScreen");
        
    let 
        cameraStream = null,
        screenStream = null,
        microphoneStream = null;



    document.getElementById("btnShare-Camera").addEventListener("click", ()=>{
        webrtcEncoder.request().camera(localVideo, 16/9)
        .then((stream)=>{
            cameraStream = stream;
        })
        .catch(()=>{
            addError("Camera isn't available");
        });
    });

    document.getElementById("btnShare-Screen").addEventListener("click", () => {
        webrtcEncoder.request().screen(localScreen)
        .then((stream) => {
            screenStream = stream;
        })
        .catch(() => {
            addError("Screen sharing isn't available");
        });
    });

    document.getElementById("btnShare-Microphone").addEventListener("click", () => {
        webrtcEncoder.request().microphone(localAudio)
        .then((stream) => {
            microphoneStream = stream;
        })
        .catch(() => {
            addError("Microphone isn't available");
        });
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
        const stream = webrtcEncoder.program.start();
        
        //[screenStream, microphoneStream].forEach((objectStream)=>{
        [screenStream, microphoneStream].forEach((objectStream) => {
            if (objectStream !== null){
                objectStream.getAudioTracks().forEach(track => stream.addTrack(track));
            }
        });

        webrtcEncoder.wsc.setStream(stream);
    });

    document.getElementById("btnCast").addEventListener("click", ()=>{
        const broadcastStatus = webrtcEncoder.wsc.getStatus();

        if (broadcastStatus === "broadcasting"){
            webrtcEncoder.wsc.stop();
        } else{
            webrtcEncoder.wsc.start();
        }
    });

    addConecctionFunctions(webrtcEncoder);

    addLayoutFunctions(webrtcEncoder, localVideo, localScreen);

    addLetterheadFunctions(webrtcEncoder);

    addBackgroundFunctions(webrtcEncoder);
}
