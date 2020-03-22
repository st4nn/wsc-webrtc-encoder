function addLayoutFunctions(webrtcEncoder, localVideo, localScreen){
    
    document.getElementById("btn-layout_0").addEventListener("click", ()=>{
        handleLayout(webrtcEncoder, localScreen, localVideo, 0);
    });

    document.getElementById("btn-layout_1").addEventListener("click", () => {
        handleLayout(webrtcEncoder, localVideo, localScreen, 0);
    });

    document.getElementById("btn-layout_2").addEventListener("click", () => {
        handleLayout(webrtcEncoder, localVideo, localScreen, 1);
    });

    document.getElementById("btn-layout_3").addEventListener("click", () => {
        handleLayout(webrtcEncoder, localScreen, localVideo, 1);
    });

    document.getElementById("btn-layout_4").addEventListener("click", () => {
        handleLayout(webrtcEncoder, localScreen, 2);
    });

    document.getElementById("btn-layout_5").addEventListener("click", () => {
        handleLayout(webrtcEncoder, localVideo, 2);
    });
}

function getLayoutFunctions(index){
    if (index === 0) {
        return [{
            dx: width => width * 0.0109375,
            dy: height => height * 0.019444444,
            dWidth: width => width * 0.690625,
            dHeight: height => height * 0.6875
        }, {
            dx: width => width * 0.71953125,
            dy: height => height * 0.316666667,
            dWidth: width => width * 0.26875,
            dHeight: height => height * 0.461111111
        }];
    } else{
        if (index === 1) {
            return [{
                dx: width => width * 0.009375,
                dy: height => height * 0.315277778,
                dWidth: width => width * 0.4796875,
                dHeight: height => height * 0.475
            }, {
                dx: width => width * 0.50703125,
                dy: height => height * 0.031944444,
                dWidth: width => width * 0.4796875,
                dHeight: height => height * 0.475
            }];
        } else{
            return {
                dx: width => width * 0.01796875,
                dy: height => height * 0.020833333,
                dWidth: width => width * 0.9765625,
                dHeight: height => height * 0.972222222
            }
        }
    }
}

function handleLayout(webrtcEncoder, firstElement, secondElement, layoutIndex){
    webrtcEncoder.previewer.removeAllResources();
    if (typeof secondElement === "number"){
        layoutFunction = getLayoutFunctions(secondElement);
        webrtcEncoder.previewer.addResource({ src: firstElement, ...layoutFunction });
    } else{
        layoutFunction = getLayoutFunctions(layoutIndex);
        webrtcEncoder.previewer.addResource({ src: firstElement, ...layoutFunction[0] });
        webrtcEncoder.previewer.addResource({ src: secondElement, ...layoutFunction[1] });
    }
    if (!webrtcEncoder.previewer.status()) {
        webrtcEncoder.previewer.start();
    }
}