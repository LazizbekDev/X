if (!window.hasRun) {
    window.hasRun = true;

    (async () => {
        try {
            const response = await fetch(chrome.runtime.getURL("dummy.json"));
            const translations = await response.json();
            console.log("Translations loaded:", translations);

            const translateIcon = document.createElement("div");
            translateIcon.id = "translate-icon";
            translateIcon.style.position = "absolute";
            translateIcon.style.zIndex = "9999";
            translateIcon.style.cursor = "pointer";
            translateIcon.style.width = "30px";
            translateIcon.style.height = "30px";
            translateIcon.style.backgroundSize = "contain";
            translateIcon.style.borderRadius = "7px";
            translateIcon.style.display = "none"; 
            document.body.appendChild(translateIcon);

            const translateResult = document.createElement("div");
            translateResult.id = "translate-result";
            translateResult.className = "plabel"
            // translateResult.classList = ["panel box box-primary"]
            translateResult.style.position = "absolute";
            translateResult.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
            translateResult.style.color = "black";
            translateResult.style.padding = "4px";
            translateResult.style.borderRadius = "3px";
            translateResult.style.fontSize = "14px";
            translateResult.style.zIndex = "9999";
            translateResult.style.display = "none";
            document.body.appendChild(translateResult);

            function cleanText(text) {
                return text.replace(/[.,\/#!$%\^&\*;:{}=\-_'"`~()]/g, "").replace(/\s+/g, "").toLowerCase();
            }

            function translateText(selectedText) {
                const cleanedText = cleanText(selectedText); 
                const matchResults = Object.entries(translations.translations).filter(([key, value]) => {
                    const cleanedKey = cleanText(key); 
                    return cleanedKey.includes(cleanedText);
                });

                if (matchResults.length > 0) {
                    translateResult.innerHTML = matchResults.map(([key, value]) => `<b>${value}</b></br>`).join('');
                } else {
                    translateResult.innerHTML = ".";
                }
                translateResult.style.display = "block";
            }

            document.addEventListener("mouseup", (event) => {
                try {
                    const selectedText = window
                        .getSelection()
                        .toString()
                        .trim();

                    if (selectedText) {
                        const range = window
                            .getSelection()
                            .getRangeAt(0)
                            .getBoundingClientRect();

                        translateIcon.style.top = `${window.scrollY + range.bottom}px`;
                        translateIcon.style.left = `${window.scrollX + range.right}px`;
                        translateIcon.style.display = "block";
                        translateIcon.dataset.selectedText = selectedText;

                        translateResult.style.top = `${window.scrollY + range.top - translateResult.offsetHeight - 10}px`;
                        translateResult.style.left = `${window.scrollX + range.left}px`;
                    } else {
                        translateIcon.style.display = "none";
                        translateResult.style.display = "none";
                    }
                } catch (error) {
                    console.error("Error positioning translate icon:", error);
                }
            });

            translateIcon.addEventListener("click", () => {
                const selectedText = translateIcon.dataset.selectedText;
                translateText(selectedText);
                translateIcon.style.display = "none"; 
            });

            document.addEventListener("mousedown", (event) => {
                if (!translateIcon.contains(event.target) && !translateResult.contains(event.target)) {
                    translateIcon.style.display = "none";
                    translateResult.style.display = "none";
                }
            });
        } catch (error) {
            console.error("Error initializing content script:", error);
        }
    })();
}
