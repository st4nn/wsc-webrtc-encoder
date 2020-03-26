function addConecctionFunctions(webrtcEncoder){
    const connectButton = document.getElementById("btnCast");

    buttonToStart(connectButton);

    webrtcEncoder.wsc.setCallback("onOpen", ()=>{
        buttonToStop(connectButton);
    });

    webrtcEncoder.wsc.setCallback("onClose", () => {
        buttonToStart(connectButton);
    });

    webrtcEncoder.wsc.setCallback("onError", (evt) => {
        console.error(evt);
        const { code = 0 } = evt;
        let message = '';
        switch (code) {
            case 204: //You must set one stream
                message = 'Your program view can\'t be empty';
                break;
            case 404: //Conection failed
                message = 'Connection failed, check your Wowza Streaming Cloud application';
                break;
            case 503: //Conection lost
                message = 'Connection lost';
                break;
            default:
                message = 'There was one error with your broadcast';
                break;
        }

        const container = document.getElementById("error-container");
        const errorAlert = document.createElement("div");
        errorAlert.classList.add("error-alert"); 
        errorAlert.classList.add("bounce-in-right");
        errorAlert.innerHTML = "<p>" + message + "</p>";
        container.append(errorAlert);
        setTimeout(()=>{
            container.removeChild(errorAlert);
        }, 3500);
        

    });

    webrtcEncoder.wsc.setCallback("onMessage", (evt) => {
        
        //console.log("Message: ", evt);
        //buttonToStart(connectButton);
    });
}

function buttonToStart(button){
    button.innerHTML = '<i class="fas fa-broadcast-tower"></i> Connect';
    button.classList.remove("btn-danger");
    button.classList.add("btn-success");
}

function buttonToStop(button){
    button.innerHTML = '<i class="fas fa-stop"></i> Stop';
    button.classList.remove("btn-success");
    button.classList.add("btn-danger");
 }