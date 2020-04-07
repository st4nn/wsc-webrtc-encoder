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
        webrtcEncoder.wsc.updateSettings({
            url: document.getElementById("sdpURL").value,
            applicationName: document.getElementById("applicationName").value,
            streamName: document.getElementById("streamName").value,
            videoBitrate: parseInt(document.getElementById("videoBitrate").value, 10),
            audioBitrate: parseInt(document.getElementById("audioBitrate").value, 10),
            videoFrameRate: document.getElementById("videoFrameRate").value,
            videoChoice: document.getElementById("videoChoice").value,
            audioChoice: document.getElementById("audioChoice").value 
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



    document.getElementById("btnShare-Camera").addEventListener("click", (e)=>{
        if (cameraStream === null){
            webrtcEncoder.request().camera(localVideo, 16/9)
            .then((stream)=>{
                cameraStream = stream;

                e.target.innerHTML = "Stop sharing camera";
            })
            .catch(()=>{
                addError("Camera isn't available");
            });
        } else{
            e.target.innerHTML = "Share camera";
            cameraStream.getTracks().forEach(track => track.stop());
            cameraStream = null;
        }
    });

    document.getElementById("btnShare-Screen").addEventListener("click", (e) => {
        if (screenStream === null){
            webrtcEncoder.request().screen(localScreen)
            .then((stream) => {
                screenStream = stream;

                e.target.innerHTML = "Stop sharing screen";
            })
            .catch(() => {
                addError("Screen sharing isn't available");
            });
        } else{
            e.target.innerHTML = "Share screen";
            screenStream.getTracks().forEach(track => track.stop());
            screenStream = null;
        }
    });

    

    document.getElementById("btnShare-Microphone").addEventListener("click", (e) => {
        if (microphoneStream === null) {
            webrtcEncoder.request().microphone(localAudio)
                .then((stream) => {
                    microphoneStream = stream;

                    webrtcEncoder.wsc.onUpdateStream();
                    e.target.innerHTML = "Stop sharing microphone";
                })
                .catch((err) => {
                    console.error(err);
                    addError("Microphone isn't available");
                });
        } else{
            e.target.innerHTML = "Share microphone";
            //microphoneStream.getTracks().forEach(track => track.stop());
            webrtcEncoder.wsc.onUpdateStream();
            microphoneStream = null;
        }
        
    });

    document.getElementById("btnPublishPreview").addEventListener("click", () => {
        const previewResources = webrtcEncoder.previewer.getAllResources();
        webrtcEncoder.program.stop();
        webrtcEncoder.program.removeAllResources();
        webrtcEncoder.program.removeText();
        webrtcEncoder.program.removeBackground();
        
        webrtcEncoder.program.addResources(previewResources.resources);

        webrtcEncoder.program.addText(previewResources.text);
        webrtcEncoder.program.addBackground(previewResources.background);
        const stream = webrtcEncoder.program.start();
        
        //[screenStream, microphoneStream].forEach((objectStream)=>{
        [microphoneStream].forEach((objectStream) => {
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

    document.getElementById("txtVideoFrecuency").addEventListener("change", (e) => {
        webrtcEncoder.previewer.setFrecuency(e.target.value);
        webrtcEncoder.program.setFrecuency(e.target.value);
        document.getElementById("lblVideoFrecuency").innerHTML = e.target.value;
    });

    document.getElementById("txtVideoQuality").addEventListener("change", (e) => {
        
        document.getElementById("lblVideoQuality").innerHTML = e.target.value;
    });

    addConecctionFunctions(webrtcEncoder);

    addLayoutFunctions(webrtcEncoder, localVideo, localScreen);

    addLetterheadFunctions(webrtcEncoder);

    addBackgroundFunctions(webrtcEncoder);
}
