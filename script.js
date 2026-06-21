const orb = document.querySelector(".orb");
const status = document.getElementById("status");
let voices = [];
let memories = JSON.parse(localStorage.getItem("miraMemories")) || {};
let reminders = JSON.parse(localStorage.getItem("miraReminders")) || [];
Notification.requestPermission();
let deferredPrompt;
const installBtn =
    document.getElementById("installBtn");

speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
    console.log("Voices loaded:", voices.map(v => v.name));
};

const button = document.getElementById("listenBtn");
const chatHistory = document.getElementById("chat-history");
const toggleChat = document.getElementById("toggleChat");
toggleChat.addEventListener("click", () => {

    if (
        chatHistory.style.display === "none"
    ) {

        chatHistory.style.display = "block";

        toggleChat.textContent =
            "Hide Chat History";

    } else {

        chatHistory.style.display = "none";

        toggleChat.textContent =
            "Show Chat History";
    }
});

const recognition = new webkitSpeechRecognition();

button.addEventListener("click", () => {

    status.textContent = "Listening...";

    orb.classList.add("wave");

    recognition.start();
});
recognition.onresult = (event) => { 
    status.textContent = "Ready";

    orb.classList.remove("wave");

   const text = event.results[0][0].transcript;

chatHistory.innerHTML += `
<div class="user-message">
    <strong>You:</strong> ${text}
</div>
`;

const lowerText = text.toLowerCase();

let reply = "";

if (lowerText.includes("youtube")) {
    reply = "Opening YouTube for you.";
    window.open("https://www.youtube.com", "_blank");
}

else if (lowerText.includes("google")) {
    reply = "Opening Google.";
    window.open("https://www.google.com", "_blank");
}

else if (lowerText.includes("github")) {
    reply = "Opening GitHub.";
    window.open("https://github.com", "_blank");
}

else if (lowerText.includes("canva")) {
    reply = "Opening Canva.";
    window.open("https://www.canva.com", "_blank");
}

else if (lowerText.includes("gofundme")) {
    reply = "Opening GoFundMe.";
    window.open("https://www.gofundme.com", "_blank");
}

else if (lowerText.includes("twitter")) {
    reply = "Opening Twitter.";
    window.open("https://www.twitter.com", "_blank");
}

else if (lowerText.includes("facebook")) {
    reply = "Opening Facebook.";
    window.open("https://www.facebook.com", "_blank");
}

else if (lowerText.includes("spotify")) {
    reply = "Opening Spotify.";
    window.open("https://www.spotify.com", "_blank");
}

else if (lowerText.includes("anime verse")) {
    reply = "Opening Animeverse.";
    window.open("https://animeverse-opal.vercel.app/", "_blank");
}

else if (lowerText.includes("search")) {

    const searchTerm = lowerText
        .replace("search for", "")
        .replace("search", "")
        .trim();

    reply = `Searching for ${searchTerm}`;

    window.open(
        `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`,
        "_blank"
    );
}

else if (lowerText.includes("tell me a joke")) {

    const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "I would tell you a UDP joke, but you might not get it.",
        "There are 10 types of people. Those who understand binary and those who do not."
    ];

    reply = jokes[Math.floor(Math.random() * jokes.length)];
}
else if (lowerText.startsWith("remember")) {

    const memory = text.replace(/remember/i, "").trim();

    if (memory.includes(" is ")) {

        const parts = memory.split(" is ");

        const key = parts[0].trim().toLowerCase();

        const value = parts.slice(1).join(" is ").trim();

        memories[key] = value;

        localStorage.setItem(
            "miraMemories",
            JSON.stringify(memories)
        );

        reply = `Okay. I'll remember that ${key} is ${value}.`;

    } else {

        reply = "Please tell me something in the form of X is Y.";
    }
}

else if (lowerText.includes("what do you remember")) {

    const memoryList = Object.entries(memories)
        .map(([key, value]) => `${key} is ${value}`)
        .join(". ");

    reply = memoryList
        ? "I remember: " + memoryList
        : "I don't remember anything yet.";
}



else if (lowerText.includes("forget everything")) {

    memories = {};

    localStorage.removeItem("miraMemories");

    reply = "All memories cleared.";
}
else if (
    lowerText.startsWith("remind me to") &&
    lowerText.includes("in")
) {

    const match = text.match(
        /remind me to (.*) in (\d+) seconds/i
    );

    if (match) {

        const task = match[1];

        const seconds = parseInt(match[2]);

        reply =
            `Okay. I'll remind you to ${task} in ${seconds} seconds.`;

        setTimeout(() => {

            const reminderSpeech =
                new SpeechSynthesisUtterance(
                    `Reminder. ${task}`
                );

            speechSynthesis.speak(
                reminderSpeech
            );

            new Notification(
                "Mira Reminder",
                {
                    body: task
                }
            );

        }, seconds * 1000);
    }
}
else if (lowerText.startsWith("set a reminder")) {

    const reminder = text
        .replace(/set a reminder to/i, "")
        .trim();

    reminders.push(reminder);

    localStorage.setItem(
        "miraReminders",
        JSON.stringify(reminders)
    );

    reply = `Okay. I'll remind you to ${reminder}.`;
}

else if (
    lowerText.includes("what did i ask you to remind me about") ||
    lowerText.includes("what should you remind me of") ||
    lowerText.includes("do i have any reminders") ||
    lowerText.includes("what reminders do i have") ||
    lowerText.includes("what did i tell you to remind me about")
) {

    reply = reminders.length
        ? "You asked me to remind you about: " + reminders.join(". ")
        : "You don't have any reminders.";
}

else if (
    lowerText.includes("clear reminders")
) {

    reminders = [];

    localStorage.removeItem("miraReminders");

    reply = "All reminders cleared.";
}
else if (
    lowerText.startsWith("what is my ") ||
    lowerText.startsWith("what's my ")
) {

    let key = lowerText
        .replace("what is my ", "")
        .replace("what's my ", "")
        .replace("?", "")
        .trim();

    key = "my " + key;

    if (memories[key]) {

        reply = `Your ${key.replace("my ", "")} is ${memories[key]}.`;

    } else {

        reply = `I don't know your ${key.replace("my ", "")} yet.`;
    }
}
else {

    const commands = {

        "hello": "Hey! Nice to hear from you.",

        "hi": "Hello there!",

        "good morning": "Good morning. How was your night?",

        "it was fine": "I'm glad to hear that. How can i help you today?",

        "good afternoon": "Good afternoon. Hope your day is going well.",

        "good evening": "Good evening. Nice to hear from you.",

        "how are you": "I'm doing great today.",

        "what's your name": "I'm Mira, your AI assistant.",

        "your name": "I'm Mira, your AI assistant.",

        "who created you": "I was created by Abel.",

        "what can you do": "I can search Google, open websites, tell jokes and much more.",

       "what's time": "The time is " + new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'}),

        "what is the time": "The time is " + new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'}),

        "what says the time": "The time is " + new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'}),

        "date": "Today's date is " + new Date().toDateString(),

        "day": "Today is " + new Date().toLocaleDateString('en-US', { weekday: 'long' }),

        "month": "The current month is " + new Date().toLocaleDateString('en-US', { month: 'long' }),

        "year": "The current year is " + new Date().getFullYear(),

        "motivate me": "You don't have to be perfect. Just be better than yesterday.",

        "inspire me": "Small progress every day adds up to big results.",

        "flip a coin": Math.random() < 0.5 ? "Heads." : "Tails.",

        "roll a dice": "You rolled a " + (Math.floor(Math.random() * 6) + 1),

        "who are you": "I'm Mira, your personal AI assistant.",

        "thank you": "You're welcome Abel.",

        "thanks": "Happy to help.",

        "bye": "Goodbye. Have a great day.",

        "don't worry": "okay.",

        "good night": "Good night. Sleep well."
    };

    let commandFound = false;

    for (const command in commands) {

        if (lowerText.includes(command)) {

            reply = commands[command];

            commandFound = true;

            break;
        }
    }

    if (!commandFound) {
        reply = "I don't know that yet.";
    }
}
    const speech = new SpeechSynthesisUtterance(reply);

  const femaleVoice = voices.find(
    voice =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("samantha")
);

if (femaleVoice) {
    speech.voice = femaleVoice;
}

    console.log("Female voice found:", femaleVoice);
    console.log("Actual speech voice:", speech.voice?.name);

    speech.rate = 0.87;
    speech.pitch = 1.2;

    setTimeout(() => {
        chatHistory.innerHTML += `
<div class="mira-message">
    <strong>Mira:</strong> ${reply}
</div>
`;

chatHistory.scrollTop = chatHistory.scrollHeight;
    speechSynthesis.speak(speech);
    
}, 500);
};
if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register("./service-worker.js")
        .then(() => {

            console.log(
                "Mira Service Worker Registered"
            );

        })
        .catch((error) => {

            console.log(error);

        });
}
window.addEventListener(
    "beforeinstallprompt",
    (e) => {

        e.preventDefault();

        deferredPrompt = e;

        installBtn.style.display =
            "block";
    }
);
installBtn.addEventListener(
    "click",
    async () => {

        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const result =
            await deferredPrompt.userChoice;

        console.log(
            result.outcome
        );

        deferredPrompt = null;

        installBtn.style.display =
            "none";
    }
);