class requester{
    camera(localVideo){
        const constraints = {
            video: true,
            audio: false,
        };

        if (navigator.mediaDevices){
            if(navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                    getUserMediaSuccess(stream, localVideo);
                }).catch(errorHandler);
            }
        }
        else if(navigator.getUserMedia) {
            navigator.getUserMedia(constraints, (stream) => {
                getUserMediaSuccess(stream, localVideo);
            }, errorHandler);
        }
        else {
            alert('Your browser does not support getUserMedia API');
        }
    }
    
    microphone(localAudio){
        const constraints = {
            video: false,
            audio: true
        };

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                getUserMediaSuccess(stream, localAudio);
            }).catch(errorHandler);
        }
        else if (navigator.getUserMedia) {
            navigator.getUserMedia(constraints, (stream) => {
                getUserMediaSuccess(stream, localAudio);
            }, errorHandler);
        }
        else {
            alert('Your browser does not support getUserMedia API');
        }
    }
    
    screen(localScreen){
        const constraints = {
            video: true
        };

        if (navigator.mediaDevices.getDisplayMedia) {
            navigator.mediaDevices.getDisplayMedia(constraints).then((stream) => {
                getUserMediaSuccess(stream, localScreen);
            }).catch(errorHandler);
            
        } else if (navigator.getDisplayMedia) {
            navigator.getDisplayMedia(constraints, (stream) => {
                getUserMediaSuccess(stream, localScreen);
            }, errorHandler);
        } else {
            navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } }).then((stream) => {
                getUserMediaSuccess(stream, localScreen);
            }).catch(errorHandler);
        }
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