function addBackgroundFunctions(webrtcEncoder) {
    const letterHeadItems = document.querySelectorAll(".background-list .background-item");

    letterHeadItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            if (index > 0){
                const image = new Image();
                image.src = item.getElementsByTagName("img")[0].src.replace("_256x", "");
                webrtcEncoder.previewer.addBackground(image);
            } else{
                webrtcEncoder.previewer.removeBackground();
            }
        });
    });
}