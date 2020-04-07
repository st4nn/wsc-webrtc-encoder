const currentLetterhead = {};

function addLetterheadFunctions(webrtcEncoder) {
    const letterHeadItems = document.querySelectorAll(".letterheads-design-list .letterhead-item");

    letterHeadItems.forEach((item)=>{
        item.addEventListener("click", ()=>{
            const image = new Image();
            image.src = item.getElementsByTagName("img")[0].src.replace("_256x", "");
            currentLetterhead.background = image;
        });
    });

    document.getElementById("txtLetterhead_Value").addEventListener("change", (e)=>{
        currentLetterhead.value = e.target.value;
    });

    document.getElementById("txtLetterhead_Subtitle").addEventListener("change", (e) => {
        currentLetterhead.subtitle = e.target.value;
    });

    document.getElementById("txtLetterhead_Size").addEventListener("change", (e) => {
        try{
            currentLetterhead.size = parseInt(e.target.value);
        } catch(error){
            document.getElementById("txtLetterhead_Size").value = "30";
        }
    });

    document.getElementById("txtLetterhead_Color").addEventListener("change", (e) => {
        currentLetterhead.color = e.target.value;
    });

    document.getElementById("btnLetterhead_Save").addEventListener("click", (e) => {
        webrtcEncoder.previewer.addText(currentLetterhead);
    });

    document.getElementById("btnLetterhead_Hide").addEventListener("click", (e) => {
        webrtcEncoder.previewer.removeText();
    });
    
}