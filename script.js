const textarea = document.querySelector("textarea"),
    voiceList = document.querySelector("select"),
    speechBtn = document.querySelector("button");
    speakingIndicator = document.createElement("div");

let synth = speechSynthesis,
    isSpeaking = true;

function populateVoices(){
    if(synth.onvoiceschanged !== undefined){
        synth.onvoiceschanged = voices;
    }
}


function voices() {
    voiceList.innerHTML = '';
    for (let voice of synth.getVoices()) {
        let selected = voice.name === "Google US English" ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
    }
}

populateVoices();


function textToSpeech(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    for (let voice of synth.getVoices()) {
        if (voice.name === voiceList.value) {
            utterance.voice = voice;
        }
    }
    utterance.onstart = function(){
        speechBtn.textContent = "Speaking...";
    };
    utterance.onend = function(){
        speechBtn.textContent = "Convert To Speech";
    };
    synth.speak(utterance);
}


speakingIndicator.style.cssText = `
    text-align: center;
    color: white;
    margin-top: 10px;
`;

document.body.appendChild(speakingIndicator);

speechBtn.addEventListener("click", e => {
    e.preventDefault();
    if (textarea.value !== "") {
        if (!synth.speaking) {
            textToSpeech(textarea.value);
        }
        // Resume/Pause functionality
        if (textarea.value.length > 80) {
            speechBtn.innerText = synth.paused ? "Resume Speech" : "Pause Speech";
            speechBtn.onclick = () => {
                if (synth.paused) {
                    synth.resume();
                    speechBtn.innerText = "Pause Speech";
                } else {
                    synth.pause();
                    speechBtn.innerText = "Resume Speech";
                }
            };
        }
    }
});

voiceList.addEventListener('change', () => {
    if (textarea.value !== '') {
        textToSpeech(textarea.value);
    }
});