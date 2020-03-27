navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

class requester{
    camera(localVideo, ratio = 16/9){
        const constraints = {
            video: { aspectRatio: ratio },
            audio: false
        };

        return new Promise((resolve, reject)=>{
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                    getUserMediaSuccess(stream, localVideo);
                    resolve(stream);
                }).catch((error)=>{
                    errorHandler(error);
                    reject(error);
                });
            }
            else if (navigator.getUserMedia) {
                navigator.getUserMedia(constraints, (stream) => {
                    getUserMediaSuccess(stream, localVideo);
                    resolve(stream);
                }, (error)=>{
                    errorHandler(error);
                    reject(error);
                });
            }
            else {
                reject();
                alert('Your browser does not support getUserMedia API');
            }
        });

        
    }
    
    microphone(localAudio){
        const constraints = {
            video: false,
            audio: true
        };

        return new Promise((resolve, reject) => {
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                    getUserMediaSuccess(stream, localAudio);
                    resolve(stream);
                }).catch((error)=>{
                    errorHandler(error);
                    reject(error);
                });
            }
            else if (navigator.getUserMedia) {
                navigator.getUserMedia(constraints, (stream) => {
                    getUserMediaSuccess(stream, localAudio);
                    resolve(stream);
                }, (error) => {
                    errorHandler(error);
                    reject(error);
                });
            }
            else {
                reject();
                alert('Your browser does not support getUserMedia API');
            }
        });
    }
    
    screen(localScreen){
        const constraints = {
            video: true,
            audio: true
        };

        return new Promise((resolve, reject) => {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia(constraints).then((stream) => {
                    getUserMediaSuccess(stream, localScreen);
                    resolve(stream);
                }).catch((error) => {
                    errorHandler(error);
                    reject(error);
                });
                
            } else if (navigator.getDisplayMedia) {
                navigator.getDisplayMedia(constraints, (stream) => {
                    getUserMediaSuccess(stream, localScreen);
                }, (error) => {
                    errorHandler(error);
                    reject(error);
                });
            } else {
                navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' }, audio: true }).then((stream) => {
                    getUserMediaSuccess(stream, localScreen);
                    resolve(stream);
                }).catch((error) => {
                    errorHandler(error);
                    reject(error);
                });
            }
        });
    }
}

export default requester;

function getUserMediaSuccess(stream, element){
    try {
        element.srcObject = stream;
    } catch (error) {
        element.src = window.URL.createObjectURL(stream);
    }
}

function errorHandler(error) {
    console.error(error);
}