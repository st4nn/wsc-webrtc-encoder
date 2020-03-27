let peerConnection = null;
let peerConnectionConfig = { 'iceServers': [] };

let wsURL = "";
let wsConnection = null;
let streamInfo = { applicationName: "", streamName: "", sessionId: "[empty]" };
let userData = { param1: "value1" };
let vBitrate = 0;
let aBitrate = 0;
let vFrameRate = "";
let vChoice = "";
let aChoice = "";
let videoIndex = -1;
let audioIndex = -1;
let localStream = null;

let status = "stopped";

const SDPOutput = new Object();
const callbacks = new Object();

class WSConnection{
    constructor({ url, applicationName, streamName, videoBitrate = 120, audioBitrate = 32, videoFrameRate = "29.97", videoChoice = "42e01f", audioChoice = "opus", onOpen, onClose, onMessage, onError}){
        wsURL = url;

        streamInfo.applicationName = applicationName;
        streamInfo.streamName = streamName;
        streamInfo.sessionId = "[empty]";

        vBitrate = videoBitrate;
        aBitrate = audioBitrate;

        vFrameRate = videoFrameRate;
        vChoice = videoChoice;
        aChoice = audioChoice;
        
        callbacks.onOpen = onOpen;
        callbacks.onClose = onClose;
        callbacks.onMessage = onMessage;
        callbacks.onError = onError;

        for (let callbackIndex in callbacks){
            if (typeof callbacks[callbackIndex] !== "function"){
                callbacks[callbackIndex] = ()=>{};
            }
        }
    }
    setStream(stream){
        localStream = stream;
        if (peerConnection !== null){
            peerConnection.addStream(localStream);
        }
    }

    start(){
        if (localStream !== null){
            if (peerConnection === null) {
                startPublisher();
            }
        } else{
            callbacks.onError({ code: 204, data: "You must set one stream"});
        }
    }

    stop(){
        stopPublisher();
    }

    updateSettings({
        url = wsURL,
        applicationName = streamInfo.applicationName,
        streamName = streamInfo.streamName,
        videoBitrate = vBitrate,
        audioBitrate = aBitrate,
        videoFrameRate = vFrameRate,
        videoChoice = vChoice,
        audioChoice = aChoice
    }) {
        wsURL = url;

        streamInfo.applicationName = applicationName;
        streamInfo.streamName = streamName;
        streamInfo.sessionId = "[empty]";

        vBitrate = videoBitrate;
        aBitrate = audioBitrate;

        vFrameRate = videoFrameRate;
        vChoice = videoChoice;
        aChoice = audioChoice;
    }

    setCallback(type, listener){
        if (typeof type === "string"){
            if (callbacks[type] == undefined){
                console.error("This callback is not defined");
            } else{
                if (typeof listener !== "function"){
                    console.error("Listener must be a function");
                } else{
                    callbacks[type] = listener;
                }
            }
        }
    }
    getStatus(){
        return (peerConnection === null ? "stopped" : "broadcasting");
    }
}

export default WSConnection;

function wsConnect(url){
    wsConnection = new WebSocket(url);
    wsConnection.binaryType = 'arraybuffer';

    wsConnection.onopen = function () {
        callbacks.onOpen();
        peerConnection = new RTCPeerConnection(peerConnectionConfig);
        
        peerConnection.onconnectionstatechange = (evt)=>{
            const 
                { target = {}} = evt,
                { connectionState = false} = target;

            if (connectionState){
                if (connectionState !== "connected" && connectionState !== "connecting"){
                    callbacks.onError({code: 503, data: "Your connection is lost"});
                    stopPublisher();
                }
            }
        }

        peerConnection.onicecandidate = gotIceCandidate;

        peerConnection.addStream(localStream);
        /*var localTracks = localStream.getTracks();
        for (var localTrack of localTracks) {
            peerConnection.addTrack(localTrack, localStream);
        }*/

        peerConnection.createOffer().then(gotDescription).catch(errorHandler);
    }

    //var offerOptions = {
    // New spec states offerToReceiveAudio/Video are of type long (due to
    // having to tell how many "m" lines to generate).
    // http://w3c.github.io/webrtc-pc/#idl-def-RTCOfferAnswerOptions.
    //  offerToReceiveAudio: 1,
    // offerToReceiveVideo: 1,
    //	codecPayloadType: 0x42E01F,
    // };

    wsConnection.onmessage = function (evt) {
        callbacks.onMessage(evt);

        const msgJSON = JSON.parse(evt.data);
        const msgStatus = Number(msgJSON['status']);

        //const msgCommand = msgJSON['command'];

        if (msgStatus != 200) {
            stopPublisher();
            callbacks.onError(evt);
        }
        else {
            const sdpData = msgJSON['sdp'];
            if (sdpData !== undefined) {
                peerConnection.setRemoteDescription(new RTCSessionDescription(sdpData)).catch(errorHandler);
            }

            const iceCandidates = msgJSON['iceCandidates'];
            if (iceCandidates !== undefined) {
                for (var iceCandidate of iceCandidates) {
                    peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
                }
            }
        }

        if (wsConnection != null)
            wsConnection.close();
        wsConnection = null;
    }

    wsConnection.onclose = function () {
        
    }

    wsConnection.onerror = function (evt) {
        callbacks.onError({code: 404, data: `Connection to ${wsURL} failed`});
        stopPublisher();
    }
}

function startPublisher() {
    wsConnect(wsURL);
}

function stopPublisher() {
    if (peerConnection != null)
        peerConnection.close();
    peerConnection = null;

    if (wsConnection != null)
        wsConnection.close();
    wsConnection = null;

    callbacks.onClose();
}

function gotIceCandidate(event) {
    if (event.candidate != null) {
        //console.log('gotIceCandidate: ' + JSON.stringify({ 'ice': event.candidate }));
    }
}

function gotDescription(description) {
    const enhanceData = new Object();

    if (aBitrate !== undefined)
        enhanceData.audioBitrate = Number(aBitrate);
    if (vBitrate !== undefined)
        enhanceData.videoBitrate = Number(vBitrate);
    if (vFrameRate !== undefined)
        enhanceData.videoFrameRate = Number(vFrameRate);


    description.sdp = enhanceSDP(description.sdp, enhanceData);
    console.log(description);

    return peerConnection.setLocalDescription(description)
        .then(() => {
            wsConnection.send('{"direction":"publish", "command":"sendOffer", "streamInfo":' + JSON.stringify(streamInfo) + ', "sdp":' + JSON.stringify(description) + ', "userData":' + JSON.stringify(userData) + '}');
        })
        .catch(err => {
            console.error(err);
        });
}

function addAudio(sdpStr, audioLine) {
    const sdpLines = sdpStr.split(/\r\n/);
    let sdpStrRet = '';
    let done = false;

    for (var sdpLine of sdpLines) {
        if (sdpLine.length <= 0)
            continue;


        sdpStrRet += sdpLine;
        sdpStrRet += '\r\n';

        if ('a=rtcp-mux'.localeCompare(sdpLine) == 0 && done == false) {
            sdpStrRet += audioLine;
            done = true;
        }


    }
    return sdpStrRet;
}

function addVideo(sdpStr, videoLine) {
    var sdpLines = sdpStr.split(/\r\n/);
    var sdpSection = 'header';
    var hitMID = false;
    var sdpStrRet = '';
    var done = false;

    var rtcpSize = false;
    var rtcpMux = false;

    for (var sdpLine of sdpLines) {
        if (sdpLine.length <= 0)
            continue;

        if (sdpLine.includes("a=rtcp-rsize")) {
            rtcpSize = true;
        }

        if (sdpLine.includes("a=rtcp-mux")) {
            rtcpMux = true;
        }

    }

    for (var sdpLine of sdpLines) {
        sdpStrRet += sdpLine;
        sdpStrRet += '\r\n';

        if (('a=rtcp-rsize'.localeCompare(sdpLine) == 0) && done == false && rtcpSize == true) {
            sdpStrRet += videoLine;
            done = true;
        }

        if ('a=rtcp-mux'.localeCompare(sdpLine) == 0 && done == true && rtcpSize == false) {
            sdpStrRet += videoLine;
            done = true;
        }

        if ('a=rtcp-mux'.localeCompare(sdpLine) == 0 && done == false && rtcpSize == false) {
            done = true;
        }

    }
    return sdpStrRet;
}

function enhanceSDP(sdpStr, enhanceData) {
    let sdpLines = sdpStr.split(/\r\n/);
    let sdpSection = 'header';
    let hitMID = false;
    let sdpStrRet = '';
    let sawVideo = false;

    // Firefox provides a reasonable SDP, Chrome is just odd
    // so we have to doing a little mundging to make it all work
    if (!sdpStr.includes("THIS_IS_SDPARTA") || vChoice.includes("VP9")) {
        for (var sdpLine of sdpLines) {
            if (sdpLine.length <= 0)
                continue;

            var doneCheck = checkLine(sdpLine);
            if (!doneCheck)
                continue;

            sdpStrRet += sdpLine;
            sdpStrRet += '\r\n';

        }
        sdpStrRet = addAudio(sdpStrRet, deliverCheckLine(aChoice, "audio"));
        sdpStrRet = addVideo(sdpStrRet, deliverCheckLine(vChoice, "video"));
        sdpStr = sdpStrRet;
        sdpLines = sdpStr.split(/\r\n/);
        sdpStrRet = '';
    }

    for (var sdpLine of sdpLines) {
        if (sdpLine.length <= 0)
            continue;

        if (sdpLine.indexOf("m=audio") == 0 && audioIndex != -1) {
            const audioMLines = sdpLine.split(" ");
            console.log(audioMLines);
            sdpStrRet += audioMLines[0] + " " + audioMLines[1] + " " + audioMLines[2] + " " + audioIndex;
        }
        else if (sdpLine.indexOf("m=video") == 0 && videoIndex != -1) {
            const audioMLines = sdpLine.split(" ");
            sdpStrRet += audioMLines[0] + " " + audioMLines[1] + " " + audioMLines[2] + " " + videoIndex;
        }
        else {
            if (isNaN(sdpLine.substr(0, 1))) {
                sdpStrRet += sdpLine;
            } else {
                continue;
            }
        }

        if (sdpLine.indexOf("a=rtcp-mux") === 0) {
            if (sdpSection == "video"){
                [
                    "a=rtcp-rsize",
                    "a=rtpmap:108 H264/90000",
                    "a=fmtp:108 x-google-min-bitrate=360;x-google-max-bitrate=360",
                    "a=rtcp-fb:108 goog-remb",
                    "a=rtcp-fb:108 transport-cc",
                    "a=rtcp-fb:108 ccm fir",
                    "a=rtcp-fb:108 nack",
                    "a=rtcp-fb:108 nack pli",
                    "a=fmtp:108 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f",
                ].forEach((row) => {
                    sdpStrRet += '\r\n';
                    sdpStrRet += row;
                });
            }
        }

        if (sdpLine.indexOf("m=audio") === 0) {
            sdpSection = 'audio';
            hitMID = false;
        }
        else if (sdpLine.indexOf("m=video") === 0) {
            sawVideo
            sdpSection = 'video';
            hitMID = false;
        }
        else if (sdpLine.indexOf("a=rtpmap") == 0) {
            sdpSection = 'bandwidth';
            hitMID = false;
        }

        if (sdpLine.indexOf("a=mid:") === 0 || sdpLine.indexOf("a=rtpmap") == 0) {
            if (!hitMID) {
                if ('audio'.localeCompare(sdpSection) == 0) {
                    if (enhanceData.audioBitrate !== undefined) {
                        sdpStrRet += '\r\nb=CT:' + (enhanceData.audioBitrate);
                        sdpStrRet += '\r\nb=AS:' + (enhanceData.audioBitrate);
                    }
                    hitMID = true;
                }
                else if ('video'.localeCompare(sdpSection) == 0) {
                    if (enhanceData.videoBitrate !== undefined) {
                        sdpStrRet += '\r\nb=CT:' + (enhanceData.videoBitrate);
                        sdpStrRet += '\r\nb=AS:' + (enhanceData.videoBitrate);
                        if (enhanceData.videoFrameRate !== undefined) {
                            sdpStrRet += '\r\na=framerate:' + enhanceData.videoFrameRate;
                        }
                    }
                    hitMID = true;
                }
                else if ('bandwidth'.localeCompare(sdpSection) == 0) {
                    var rtpmapID;
                    rtpmapID = getrtpMapID(sdpLine);
                    if (rtpmapID !== null) {
                        var match = rtpmapID[2].toLowerCase();
                        if (('vp9'.localeCompare(match) == 0) || ('vp8'.localeCompare(match) == 0) || ('h264'.localeCompare(match) == 0) ||
                            ('red'.localeCompare(match) == 0) || ('ulpfec'.localeCompare(match) == 0) || ('rtx'.localeCompare(match) == 0)) {
                            if (enhanceData.videoBitrate !== undefined) {
                                sdpStrRet += '\r\na=fmtp:' + rtpmapID[1] + ' x-google-min-bitrate=' + (enhanceData.videoBitrate) + ';x-google-max-bitrate=' + (enhanceData.videoBitrate);
                            }
                        }

                        if (('opus'.localeCompare(match) == 0) || ('isac'.localeCompare(match) == 0) || ('g722'.localeCompare(match) == 0) || ('pcmu'.localeCompare(match) == 0) ||
                            ('pcma'.localeCompare(match) == 0) || ('cn'.localeCompare(match) == 0)) {
                            if (enhanceData.audioBitrate !== undefined) {
                                sdpStrRet += '\r\na=fmtp:' + rtpmapID[1] + ' x-google-min-bitrate=' + (enhanceData.audioBitrate) + ';x-google-max-bitrate=' + (enhanceData.audioBitrate);
                            }
                        }
                    }
                }
            }
        }
        sdpStrRet += '\r\n';
    }

    return sdpStrRet;
}

function deliverCheckLine(profile, type) {
    var outputString = "";
    for (var line in SDPOutput) {
        var lineInUse = SDPOutput[line];
        outputString += line;
        if (lineInUse.includes(profile)) {
            if (profile.includes("VP9") || profile.includes("VP8")) {
                var output = "";
                var outputs = lineInUse.split(/\r\n/);
                for (var position in outputs) {
                    var transport = outputs[position];
                    if (transport.indexOf("transport-cc") !== -1 || transport.indexOf("goog-remb") !== -1 || transport.indexOf("nack") !== -1) {
                        continue;
                    }
                    output += transport;
                    output += "\r\n";
                }

                if (type.includes("audio")) {
                    audioIndex = line;
                }

                if (type.includes("video")) {
                    videoIndex = line;
                }

                return output;
            }
            if (type.includes("audio")) {
                audioIndex = line;
            }

            if (type.includes("video")) {
                videoIndex = line;
            }
            return lineInUse;
        }
    }
    return outputString;
}

function checkLine(line) {
    if (line.startsWith("a=rtpmap") || line.startsWith("a=rtcp-fb") || line.startsWith("a=fmtp")) {
        var res = line.split(":");

        if (res.length > 1) {
            var number = res[1].split(" ");
            if (!isNaN(number[0])) {
                if (!number[1].startsWith("http") && !number[1].startsWith("ur")) {
                    var currentString = SDPOutput[number[0]];
                    if (!currentString) {
                        currentString = "";
                    }
                    currentString += line + "\r\n";
                    SDPOutput[number[0]] = currentString;
                    return false;
                }
            }
        }
    }

    return true;
}

function getrtpMapID(line) {
    var findid = new RegExp('a=rtpmap:(\\d+) (\\w+)/(\\d+)');
    var found = line.match(findid);
    return (found && found.length >= 3) ? found : null;
}

function errorHandler(error) {
    console.error(error);
}
