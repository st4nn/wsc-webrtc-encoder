function loadControllers(){
    document.getElementById("btnSettings").addEventListener("click", handleSettingsModal);
    document.getElementById("settings-section-overlay").addEventListener("click", handleSettingsModal);
    document.getElementById("settings-section-close").addEventListener("click", handleSettingsModal);

    document.getElementById("frmSettings").addEventListener("submit", function(e){
        e.preventDefault();
        handleSettingsModal();
    });

    document.getElementById("btnShare-Camera").addEventListener("click", () => {
        document.getElementById("localVideo").classList.toggle("show");
    });

    document.getElementById("btnShare-Screen").addEventListener("click", () => {
        document.getElementById("localScreen").classList.toggle("show");
    });

    document.getElementById("btnShare-Microphone").addEventListener("click", () => {
        document.getElementById("localAudio").classList.toggle("show");
    });

    const layoutItems = document.querySelectorAll(".layouts .layout-item");
    layoutItems.forEach((layout)=>{
        layout.addEventListener("click", ()=>{
            const selectedLayout = document.querySelectorAll(".layouts .layout-item.selected");
            selectedLayout.forEach((previousSelected)=>{
                previousSelected.classList.toggle("selected");
            });
            layout.classList.toggle("selected");
        }); 
    });

    const letterheadItems = document.querySelectorAll(".letterheads-design-list .letterhead-item");
    letterheadItems.forEach((letterhead) => {
        letterhead.addEventListener("click", () => {
            const selectedLayout = document.querySelectorAll(".letterheads-design-list .letterhead-item.selected");
            selectedLayout.forEach((previousSelected) => {
                previousSelected.classList.toggle("selected");
            });
            letterhead.classList.toggle("selected");
        });
    });

    const backgroundItems = document.querySelectorAll(".background-list .background-item");
    backgroundItems.forEach((background) => {
        background.addEventListener("click", () => {
            const selectedLayout = document.querySelectorAll(".background-list .background-item.selected");
            selectedLayout.forEach((previousSelected) => {
                previousSelected.classList.toggle("selected");
            });
            background.classList.toggle("selected");
        });
    });
    
}

function handleSettingsModal(){
    document.getElementById("settings-section").classList.toggle("show");
}

function addError(message){
    const container = document.getElementById("error-container");
    const errorAlert = document.createElement("div");
    errorAlert.classList.add("error-alert");
    errorAlert.classList.add("bounce-in-right");
    errorAlert.innerHTML = "<p>" + message + "</p>";
    container.append(errorAlert);
    setTimeout(() => {
        container.removeChild(errorAlert);
    }, 3500);
}