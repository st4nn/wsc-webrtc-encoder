function addLayoutFunctions(webrtcEncoder, localVideo, localScreen){
    
    document.getElementById("btn-layout_0").addEventListener("click", ()=>{
        handleLayout(webrtcEncoder, localScreen, localVideo, 0);
    });

    document.getElementById("btn-layout_1").addEventListener("click", () => {
        handleLayout(webrtcEncoder, localScreen, localVideo, 1);
    });

    document.getElementById("btn-layout_2").addEventListener("click", () => {
        handleLayout(webrtcEncoder, localVideo, localScreen, 2);
    });

    document.getElementById("btn-layout_3").addEventListener("click", () => {
        handleLayout(webrtcEncoder, localScreen, localVideo, 2);
    });

    document.getElementById("btn-layout_4").addEventListener("click", () => {
        handleLayout(webrtcEncoder, localScreen, 3);
    });

    document.getElementById("btn-layout_5").addEventListener("click", () => {
        handleLayout(webrtcEncoder, localVideo, 3);
    });
}

function getLayoutFunctions(index){
    let ans = {};
    switch (index) {
        case 0:
            ans = [{
                dx: width => width * 0.0109375,
                dy: height => height * 0.019444444,
                dWidth: width => width * 0.690625,
                dHeight: height => height * 0.6875
            }, {
                sx: width => width * 0.125,
                sy: 0,
                sWidth: width => width * 0.26875,
                sHeight: height => height * 0.461111111,
                dx: width => width * 0.71953125,
                dy: height => height * 0.316666667,
                dWidth: width => width * 0.26875,
                dHeight: height => height * 0.461111111
            }];
            break;
        case 1:
            ans = [{
                dx: width => width * 0.025,
                dy: height => height * 0.013888889,
                dWidth: width => width * 0.56171875,
                dHeight: height => height * 0.752777778
            }, {
                dx: width => width * 0.6203125,
                dy: height => height * 0.388888889,
                dWidth: width => width * 0.35,
                dHeight: height => height * 0.347222222
            }];
            break;
        case 2:
            ans = [{
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
            break;
        default:
            ans = {
                dx: width => width * 0.01796875,
                dy: height => height * 0.020833333,
                dWidth: width => width * 0.9765625,
                dHeight: height => height * 0.972222222
            };
            break;
    }
    return ans;
}

function handleLayout(webrtcEncoder, firstElement, secondElement, layoutIndex){
    webrtcEncoder.previewer.removeAllResources();
    if (typeof secondElement === "number"){
        layoutFunction = getLayoutFunctions(secondElement);
        webrtcEncoder.previewer.addResources([{ src: firstElement, ...layoutFunction }]);
    } else{
        layoutFunction = getLayoutFunctions(layoutIndex);
        webrtcEncoder.previewer.addResources([{ src: firstElement, ...layoutFunction[0] }, { src: secondElement, ...layoutFunction[1] }]);
    }
}