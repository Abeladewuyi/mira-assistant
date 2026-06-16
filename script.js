const orb = document.querySelector(".orb");
const status = document.getElementById("status");
let voices = [];

speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
    console.log("Voices loaded:", voices.map(v => v.name));
};

const button = document.getElementById("listenBtn");
const output = document.getElementById("output");

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

    output.textContent = text;
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

else {

    const commands = {

        "hello": "Hey! Nice to hear from you.",

        "hi": "Hello there!",

        "good morning": "Good morning. How was your night?",

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
    speechSynthesis.speak(speech);
}, 500);
};
