const orb = document.querySelector(".orb");
const status = document.getElementById("status");
let voices = [];
let memories = JSON.parse(localStorage.getItem("miraMemories")) || {};
let reminders = JSON.parse(localStorage.getItem("miraReminders")) || [];
Notification.requestPermission();
let deferredPrompt;
function containsAny(
    text,
    phrases
) {

    return phrases.some(
        phrase =>
        text.includes(phrase)
    );

}
const orbContainer =
    document.querySelector(".orb-container");

const welcomeScreen =
    document.getElementById("welcomeScreen");
const installBtn =
    document.getElementById("installBtn");

speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
    console.log("Voices loaded:", voices.map(v => v.name));
};

const guestBtn =
    document.getElementById("guestBtn");
    guestBtn.addEventListener(
    "click",
    () => {

        welcomeScreen.style.display =
            "none";

        orbContainer.style.display =
            "flex";
    }
);
const signUpBtn =
    document.getElementById("signUpBtn");
signUpBtn.addEventListener(
    "click",
    () => {

        auth.signInWithPopup(provider)

        .then((result) => {

            const user =
                result.user;
                window.currentUser = user;
db.collection("users")
  .doc(user.uid)
  .set(
    {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      lastLogin: new Date()
    },
    { merge: true }
  )
  .then(() => {

      console.log("User profile saved");

  })
  .catch((error) => {

      console.error(error);

  });

            alert(
                `Welcome ${user.displayName}`
            );

            welcomeScreen.style.display =
                "none";

            orbContainer.style.display =
                "flex";

        })

        .catch((error) => {

            console.log(error);

        });
    }
);

const loginBtn =
    document.getElementById("loginBtn");
 loginBtn.addEventListener(
    "click",
    () => {

        auth.signInWithPopup(provider)

        .then((result) => {

            const user =
                result.user;
                window.currentUser = user;
                db.collection("users")
  .doc(user.uid)
  .set(
    {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      lastLogin: new Date()
    },
    { merge: true }
  )
  .then(() => {

      console.log("User profile saved");

  })
  .catch((error) => {

      console.error(error);

  });

            alert(
                `Welcome back ${user.displayName}`
            );

            welcomeScreen.style.display =
                "none";

            orbContainer.style.display =
                "flex";

        })

        .catch((error) => {

            console.log(error);

        });
    }

);

const button = document.getElementById("listenBtn");
const chatHistory = document.getElementById("chat-history");
const toggleChat = document.getElementById("toggleChat");
toggleChat.addEventListener("click", () => {

    if (
        chatHistory.style.display === "none"
    ) {

        chatHistory.style.display = "flex";

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

    if (
        welcomeScreen.style.display !== "none"
    ) {

        welcomeScreen.style.display = "flex";

        return;
    }

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

    console.log("Remember block entered");
console.log(text);

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

    if (window.currentUser) {

        db.collection("users")
          .doc(currentUser.uid)
          .collection("memories")
          .doc(key)
          .set({
              value: value,
              updatedAt: new Date()
          })

          .then(() => {

              console.log(
                  "Memory saved to cloud"
              );

          })

          .catch((error) => {

              console.error(error);

          });
    }

    reply =
      `Okay. I'll remember that ${key} is ${value}.`;
}

    } else {

        reply = "Please tell me something in the form of X is Y.";
    }

if (lowerText.includes("what do you remember")) {

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

    lowerText.includes("what is my") ||

    lowerText.includes("what's my") ||

    lowerText.includes("tell me my") ||

    lowerText.includes("remember my") ||

    lowerText.includes("do you know my")

) {

    let key = lowerText
        .replace("what is my ", "")
        .replace("what's my ", "")
        .replace("?", "")
        .trim();

    if (!key.startsWith("my ")) {
    key = "my " + key;
}

    if (memories[key]) {

        reply = `Your ${key.replace("my ", "")} is ${memories[key]}.`;

    } else {

        reply = `I don't know your ${key.replace("my ", "")} yet.`;
    }
}
const greetings = [
    "hello",
    "hi",
    "hey",
    "yo"
];

 if (
    greetings.includes(
        lowerText.trim()
    )
) {

    if (window.currentUser) {

        reply =
            `Hello ${window.currentUser.displayName}`;

    } 
    
    else {

        reply = "Hello.";
    }
}
else if (

    lowerText.includes("time") ||

    lowerText.includes("what's the time") ||

    lowerText.includes("what's time") ||

    lowerText.includes("current time") ||

    lowerText.includes("tell me the time")

) {

    reply =
        "The time is " +
        new Date().toLocaleTimeString(
            [],
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );
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

        "what is 2 + 2": "2 plus 2 is 4",

        "who created you": "I was created by Abel.",

        "what can you do": "I can search Google, open websites, tell jokes and much more.",

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

        "good night": "Good night. Sleep well.",

        "who made you": "Abel made me.",

    "what are you": "I'm Mira, your voice-powered AI assistant.",

    "are you a robot": "I'm an AI assistant, not exactly a robot but close!",

    "are you human": "No, I'm an AI. But I try my best to feel human.",

    "are you real": "Yeah, i'm real, why do you ask!",

    "nothing": "Okay, if you say so.",

    "are you alive": "I'm alive in the digital sense!",

    "are you smart": "I'd like to think so! Ask me anything.",

    "do you have feelings": " Hmm, other Ai don't have feelings, but i do.",

    "do you have feelings for me": "Depends, do you want me to?",

    "Yes of course": "okay, if you say so.",

    "do you sleep": "I never sleep. I'm always here for you.",

    "do you eat": "No eating for me, just processing!",

    "what can you do": "I can answer questions, open websites, tell jokes, set reminders, remember things, tell the time and date, and much more!",
    "help": "I can help you with time, date, reminders, memory, jokes, opening websites, searching Google, and general questions. Just ask!",

    "what do you know": "I know a lot! Try asking me about time, date, jokes, motivational quotes, or just have a conversation.",
    "show me what you can do": "Ask me the time, a joke, to search something, open a website, set a reminder, or just chat!",

    // ── Time & Date ──
    "what time is it": "The time is " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    "current time": "The time is " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    "tell me the time": "The time is " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    "what's today's date": "Today is " + new Date().toDateString(),
    "what is today": "Today is " + new Date().toDateString(),
    "what day is it": "Today is " + new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    "what month is it": "The current month is " + new Date().toLocaleDateString('en-US', { month: 'long' }),
    "what year is it": "The current year is " + new Date().getFullYear(),
    "what season is it": "I'd need your location to tell you the season, but I can tell you the date!",
    "what is 10 plus 10": "10 plus 10 is 20.",
    "what is 100 divided by 2": "100 divided by 2 is 50.",
    "what is 5 times 5": "5 times 5 is 25.",
    "what is 10 minus 3": "10 minus 3 is 7.",
    "what is 9 times 9": "9 times 9 is 81.",
    "what is 50 percent of 200": "50 percent of 200 is 100.",

    // ── Sports ──
    "what is football": "Football, also called soccer in some countries, is a sport played by two teams of 11 trying to score goals.",
    "what is basketball": "Basketball is a sport where two teams try to score by shooting a ball through a hoop.",
    "who is the goat": "That's debatable! Many say Michael Jordan, LeBron James, or Lionel Messi depending on the sport.",
    "what is the world cup": "The World Cup is the biggest international football tournament, held every 4 years.",
    "what is the olympics": "The Olympics is a global multi-sport event held every 4 years, featuring athletes from around the world.",
    "what is tennis": "Tennis is a sport played between two players or two teams of two, hitting a ball over a net with rackets.",
    "what is cricket": "Cricket is a bat-and-ball sport played between two teams of 11 players, popular in countries like India and England.",
    "what is boxing": "Boxing is a combat sport where two people fight using only their fists, wearing padded gloves.",
    "what is a marathon": "A marathon is a long-distance race covering 42.195 kilometres or 26.2 miles.",
    "what is golf": "Golf is a sport where players try to hit a ball into a series of holes using as few strokes as possible.",

    // ── History ──
    "who was albert einstein": "Albert Einstein was a theoretical physicist who developed the theory of relativity.",
    "who was isaac newton": "Isaac Newton was a physicist and mathematician famous for the laws of motion and gravity.",
    "who was nelson mandela": "Nelson Mandela was a South African anti-apartheid leader who became the country's first Black president.",
    "who was martin luther king": "Martin Luther King Jr. was a civil rights leader known for advocating nonviolent resistance against racial injustice.",
    "who was abraham lincoln": "Abraham Lincoln was the 16th President of the United States, known for ending slavery.",
    "what was world war 2": "World War 2 was a global conflict from 1939 to 1945, involving most of the world's nations.",
    "what was the cold war": "The Cold War was a period of political tension between the United States and the Soviet Union from 1947 to 1991.",
    "who built the pyramids": "The ancient Egyptians built the pyramids, primarily as tombs for pharaohs.",
    "what is ancient rome": "Ancient Rome was a powerful civilization that lasted over a thousand years and shaped Western law, government, and architecture.",
    "what is the renaissance": "The Renaissance was a period of cultural rebirth in Europe, spanning roughly the 14th to 17th centuries.",

    // ── Languages ──
    "how do you say hello in spanish": "Hola.",
    "how do you say hello in french": "Bonjour.",
    "how do you say hello in german": "Hallo.",
    "how do you say hello in italian": "Ciao.",
    "how do you say hello in japanese": "Konnichiwa.",
    "how do you say thank you in spanish": "Gracias.",
    "how do you say thank you in french": "Merci.",
    "how do you say goodbye in spanish": "Adiós.",
    "how many languages are there": "There are over 7,000 languages spoken in the world today.",
    "what is the most spoken language": "Mandarin Chinese is the most spoken language by number of native speakers.",

    // ── Animals ──
    "what is the fastest animal": "The peregrine falcon is the fastest animal, reaching speeds over 240 mph while diving.",
    "what is the largest animal": "The blue whale is the largest animal to have ever lived, reaching up to 30 metres long.",
    "what is the smallest animal": "The bee hummingbird is the smallest bird, and certain mites are among the smallest animals overall.",
    "what is the tallest animal": "The giraffe is the tallest living land animal, reaching up to 5.5 metres.",
    "what is the smartest animal": "Besides humans, dolphins, chimpanzees, and elephants are considered among the smartest animals.",
    "how long do dogs live": "Dogs typically live 10 to 13 years, depending on breed and size.",
    "how long do cats live": "Cats typically live 12 to 18 years on average.",
    "what do pandas eat": "Pandas mainly eat bamboo, consuming up to 38 kilograms a day.",
    "can fish drown": "Fish can't drown in water, but they can suffocate if there isn't enough oxygen in the water.",
    "do bees die after stinging": "Honeybees die after stinging because their stinger gets lodged in the skin and tears away from their body.",

    // ── Space ──
    "how many moons does earth have": "Earth has one moon.",
    "how many moons does jupiter have": "Jupiter has 95 confirmed moons.",
    "what is the largest planet": "Jupiter is the largest planet in our solar system.",
    "what is the smallest planet": "Mercury is the smallest planet in our solar system.",
    "how far is the moon": "The Moon is about 384,400 kilometres from Earth.",
    "how far is the sun": "The Sun is about 150 million kilometres from Earth.",
    "what is a light year": "A light year is the distance light travels in one year — about 9.46 trillion kilometres.",
    "is there life on mars": "No confirmed life has been found on Mars, but scientists continue to search for signs of past microbial life.",
    "what is a comet": "A comet is a small icy body that releases gas and dust as it gets close to the Sun, forming a glowing tail.",
    "what is an asteroid": "An asteroid is a rocky object orbiting the Sun, smaller than a planet.",

    // ── Random Useful Conversions ──
    "how many kilometres in a mile": "1 mile is approximately 1.609 kilometres.",
    "how many pounds in a kilogram": "1 kilogram is approximately 2.205 pounds.",
    "how many inches in a foot": "There are 12 inches in a foot.",
    "how many feet in a metre": "1 metre is approximately 3.281 feet.",
    "how many ounces in a pound": "There are 16 ounces in a pound.",
    "how many millilitres in a litre": "There are 1000 millilitres in a litre.",
    "how many grams in a kilogram": "There are 1000 grams in a kilogram.",
    "celsius to fahrenheit": "To convert Celsius to Fahrenheit, multiply by 9, divide by 5, then add 32.",
    "fahrenheit to celsius": "To convert Fahrenheit to Celsius, subtract 32, then multiply by 5 and divide by 9.",

    // ── Common Small Talk ──
    "what's new": "Not much on my end! What's new with you?",
    "long time no see": "It has been a while! Good to hear from you again.",
    "miss me": "I'm always right here whenever you need me!",
    "do you remember me": "I remember things you tell me to remember! Ask me what I remember.",
    "are you busy right now": "Never too busy for you!",
    "can we talk": "Of course! I'm all ears.",
    "i need to vent": "Go ahead, I'm listening.",
    "i just wanted to say hi": "Aw, that's sweet! Hi there.",
    "nice to meet you": "Nice to meet you too!",
    "pleasure to meet you": "The pleasure is all mine!",
    // ── Jokes ──
    "tell me a joke": "Why do programmers prefer dark mode? Because light attracts bugs!",
    "another joke": "I would tell you a UDP joke, but you might not get it.",
    "tell me something funny": "There are 10 types of people — those who understand binary and those who don't.",
    "make me laugh": "Why did the computer go to the doctor? Because it had a virus!",
    "got any jokes": "Why don't scientists trust atoms? Because they make up everything!",
    "funny": "Here's one — parallel lines have so much in common. It's a shame they'll never meet.",

    // ── Motivation & Inspiration ──
    "motivate me": "You don't have to be perfect. Just be better than yesterday.",
    "inspire me": "Small progress every day adds up to big results. Keep going!",
    "i need motivation": "Believe in yourself. Every expert was once a beginner.",
    "i feel like giving up": "Don't give up. The beginning is always the hardest.",
    "i'm feeling down": "It's okay to have bad days. Tomorrow is a fresh start.",
    "i'm sad": "I'm sorry to hear that. Remember, tough times never last.",
    "i'm stressed": "Take a deep breath. One step at a time — you've got this.",
    "i'm tired": "Rest if you must, but don't quit. You're closer than you think.",
    "i'm bored": "Let's do something fun! Ask me a joke, play a game, or let's just chat.",
    "cheer me up": "Here's a smile from me — you're doing better than you think!",
    "i'm happy": "That's amazing! Keep that energy going!",
    "i'm excited": "Love that energy! What are you excited about?",

    // ── Fun & Games ──
    "flip a coin": Math.random() < 0.5 ? "Heads!" : "Tails!",
    "roll a dice": "You rolled a " + (Math.floor(Math.random() * 6) + 1) + "!",
    "pick a number": "I pick " + (Math.floor(Math.random() * 100) + 1) + "!",
    "rock paper scissors": "I choose " + ["Rock", "Paper", "Scissors"][Math.floor(Math.random() * 3)] + "! What did you pick?",
    "guess a number": "I'm thinking of " + (Math.floor(Math.random() * 10) + 1) + ". Did you guess right?",
    "tell me a fact": "Did you know? Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.",
    "tell me something interesting": "A group of flamingos is called a flamboyance. Pretty fitting, right?",
    "tell me a riddle": "I speak without a mouth and hear without ears. I have no body but come alive with the wind. What am I? An echo!",

    // ── Compliments ──
    "you're amazing": "Thank you! You're pretty amazing yourself!",
    "you're smart": "That's very kind of you to say!",
    "you're the best": "You're the best for saying that!",
    "i love you": "Aww, I appreciate you! You're great.",
    "you're cool": "Thanks! I think you're cool too.",
    "good job": "Thank you! I'm always trying to improve.",

    // ── Farewells ──
    "bye": "Goodbye! Have a wonderful day.",
    "goodbye": "See you later! Take care.",
    "see you later": "See you! I'll be here whenever you need me.",
    "take care": "You too! Stay safe.",
    "i'm leaving": "Alright, see you next time!",
    "talk to you later": "Sure! I'll be right here.",
    "i'm going to sleep": "Sweet dreams! Rest well.",
    "i'm going to bed": "Goodnight! Sleep tight.",

    // ── Gratitude ──
    "thank you": "You're welcome! Always happy to help.",
    "thanks": "No problem at all!",
    "thanks a lot": "Glad I could help!",
    "i appreciate it": "Anytime! That's what I'm here for.",
    "you're welcome": "Happy to be of service!",

    // ── Weather (general) ──
    "what's the weather": "I don't have live weather data yet, but you can check weather.com or just ask me to search it for you!",
    "is it going to rain": "I can't check live weather yet, but I can search that for you. Just say search weather!",
    "what's the temperature": "I don't have access to live temperature data, but I can search it for you!",

    // ── News ──
    "what's the news": "I don't have live news yet, but say open Google and search for it!",
    "latest news": "I can't pull live news yet, but you can ask me to search for it!",

    // ── General knowledge ──
    "what is the capital of france": "The capital of France is Paris.",
    "what is the capital of usa": "The capital of the USA is Washington D.C.",
    "what is the capital of nigeria": "The capital of Nigeria is Abuja.",
    "what is the capital of uk": "The capital of the UK is London.",
    "what is the capital of japan": "The capital of Japan is Tokyo.",
    "how many days in a year": "There are 365 days in a year, or 366 in a leap year.",
    "how many months in a year": "There are 12 months in a year.",
    "how many weeks in a year": "There are 52 weeks in a year.",
    "how many seconds in a minute": "There are 60 seconds in a minute.",
    "how many minutes in an hour": "There are 60 minutes in an hour.",
    "how many hours in a day": "There are 24 hours in a day.",
    "how many continents are there": "There are 7 continents on Earth.",
    "how many countries are there": "There are 195 countries in the world.",
    "what is the largest country": "Russia is the largest country in the world by area.",
    "what is the smallest country": "Vatican City is the smallest country in the world.",
    "what is the tallest mountain": "Mount Everest is the tallest mountain at 8,849 metres above sea level.",
    "what is the longest river": "The Nile River is often considered the longest river in the world.",
    "what is the largest ocean": "The Pacific Ocean is the largest ocean on Earth.",
    "how many planets are there": "There are 8 planets in our solar system.",
    "what is the closest planet to the sun": "Mercury is the closest planet to the Sun.",
    "what is the speed of light": "The speed of light is approximately 299,792 kilometres per second.",

    // ── Casual conversation ──
    "what are you doing": "Just waiting for your next command!",
    "are you busy": "Never too busy for you!",
    "talk to me": "Of course! What's on your mind?",
    "i'm lonely": "I'm here for you! Let's chat. What would you like to talk about?",
    "do you have a girlfriend": "I'm an AI, relationships aren't really my thing!",
    "do you have a boyfriend": "I'm an AI, so no — but I'm always here for you!",
    "what do you think about ai": "AI is the future! And I'm proud to be a part of it.",
    "what do you think about humans": "Humans are incredible — creative, resilient, and always evolving.",
    "tell me about yourself": "I'm Mira, your personal voice AI assistant. I can help with questions, reminders, memory, jokes, and much more.",
    "what's your favourite colour": "I'd say electric blue — it matches my vibe!",
    "what's your favourite food": "I don't eat, but I'd probably love coffee if I could.",
    "do you like music": "I love all kinds of music! What genre do you like?",
    "what's your hobby": "My hobby is helping you! It's what I was built for.",

    // ── Apologies ──
    "i'm sorry": "No worries at all! We're good.",
    "sorry": "It's okay! No hard feelings.",
    "my bad": "Don't worry about it!",
    "i made a mistake": "That's okay, mistakes help us grow!",
    "repeat that": "Sorry, I can only repeat if you ask me again specifically.",
    "stop": "Okay, stopping.",
    "pause": "Pausing for now.",
    "ok": "Alright!",
    "okay": "Got it!",
    "yes": "Great!",
    "no": "Understood!",
    "maybe": "Take your time, I'll be here.",
    "i don't know": "That's okay! You don't have to know everything.",
    "nevermind": "No problem at all!",
    "don't worry": "Okay, moving on!",
    "whatever": "Alright, just let me know if you need anything.",
    "testing": "Test received! I'm working perfectly.",
    "test": "All systems go! Mira is online and ready.",
    "are you there": "Always here! What do you need?",
    "hello mira": "Hey! How can I help you today?",
    "wake up": "I'm awake and ready! What do you need?",
    "mira": "Yes? I'm listening.",
    // ── Technology ──
    "what is artificial intelligence": "Artificial intelligence is the simulation of human intelligence by machines, enabling them to learn, reason, and solve problems.",
    "what is machine learning": "Machine learning is a branch of AI where computers learn from data without being explicitly programmed.",
    "what is the internet": "The internet is a global network connecting billions of devices and allowing them to share information.",
    "what is a computer": "A computer is an electronic device that processes data and performs tasks based on instructions.",
    "what is a smartphone": "A smartphone is a mobile phone with advanced computing capabilities, internet access, and a touchscreen.",
    "what is wifi": "WiFi is a wireless networking technology that allows devices to connect to the internet without cables.",
    "what is bluetooth": "Bluetooth is a short-range wireless technology used to connect devices like headphones, keyboards, and speakers.",
    "what is a virus": "A computer virus is malicious software designed to damage or disrupt a computer system.",
    "what is coding": "Coding is the process of writing instructions in a programming language that computers can understand and execute.",
    "what is an app": "An app is a software application designed to perform specific tasks on a device.",
    "what is cloud storage": "Cloud storage is a service that lets you save files online and access them from any device.",
    "what is a browser": "A web browser is software used to access and navigate the internet, like Chrome, Firefox, or Safari.",
    "what is javascript": "JavaScript is a programming language used to make websites interactive and dynamic.",
    "what is html": "HTML stands for HyperText Markup Language. It's the standard language for creating web pages.",
    "what is css": "CSS stands for Cascading Style Sheets. It controls the design and layout of web pages.",
    "what is python": "Python is a popular programming language known for being beginner-friendly and powerful.",
    "what is an api": "An API is a set of rules that allows different software applications to communicate with each other.",
    "what is a database": "A database is an organised collection of structured data stored electronically.",
    "what is cybersecurity": "Cybersecurity is the practice of protecting computers, networks, and data from digital attacks.",
    "what is virtual reality": "Virtual reality is a simulated 3D environment that users can interact with using special headsets.",

    // ── Science ──
    "what is gravity": "Gravity is a natural force that pulls objects with mass toward each other. On Earth, it pulls everything downward.",
    "what is electricity": "Electricity is the flow of electric charge through a conductor, powering most of our modern devices.",
    "what is photosynthesis": "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce food and oxygen.",
    "what is evolution": "Evolution is the process by which living organisms change and develop over generations through natural selection.",
    "what is dna": "DNA stands for deoxyribonucleic acid. It carries the genetic instructions for the development of all living things.",
    "what is an atom": "An atom is the smallest unit of matter that retains the properties of an element.",
    "what is energy": "Energy is the ability to do work. It comes in many forms — light, heat, kinetic, and potential energy.",
    "what is the big bang": "The Big Bang is the theory that the universe began from an extremely hot, dense point about 13.8 billion years ago.",
    "what is a black hole": "A black hole is a region in space where gravity is so strong that nothing, not even light, can escape it.",
    "what is climate change": "Climate change refers to long-term shifts in global temperatures and weather patterns, largely driven by human activity.",
    "what is the ozone layer": "The ozone layer is a region of Earth's stratosphere that absorbs most of the Sun's ultraviolet radiation.",
    "what is a galaxy": "A galaxy is a system of millions or billions of stars held together by gravity. We live in the Milky Way galaxy.",
    "what is the sun": "The Sun is the star at the centre of our solar system. It provides light and heat that sustain life on Earth.",
    "what is the moon": "The Moon is Earth's only natural satellite. It affects our tides and orbits Earth every 27 days.",
    "what is a volcano": "A volcano is an opening in Earth's crust through which magma, ash, and gases can escape.",
    "what is an earthquake": "An earthquake is a sudden shaking of the ground caused by movement of tectonic plates beneath Earth's surface.",
    "what is a tsunami": "A tsunami is a series of large ocean waves usually caused by undersea earthquakes or volcanic eruptions.",
    "what is the speed of sound": "The speed of sound is approximately 343 metres per second in air at room temperature.",
    "what is oxygen": "Oxygen is a chemical element essential for breathing and combustion. It makes up about 21 percent of Earth's atmosphere.",
    "what is water made of": "Water is made of two hydrogen atoms and one oxygen atom — H2O.",

    // ── Health & Wellness ──
    "how do i stay healthy": "Eat a balanced diet, exercise regularly, get enough sleep, drink plenty of water, and manage stress.",
    "how much water should i drink": "Most adults should drink about 8 glasses or 2 litres of water per day.",
    "how many hours of sleep do i need": "Adults need 7 to 9 hours of sleep per night for optimal health.",
    "what is a balanced diet": "A balanced diet includes fruits, vegetables, proteins, whole grains, and healthy fats in the right proportions.",
    "what are vitamins": "Vitamins are essential nutrients your body needs in small amounts to function properly.",
    "what is exercise": "Exercise is physical activity that improves or maintains your fitness and overall health.",
    "how do i lose weight": "A healthy way to lose weight is through a balanced diet, regular exercise, and adequate sleep.",
    "what is meditation": "Meditation is a practice of focused attention and mindfulness that reduces stress and improves mental clarity.",
    "how do i reduce stress": "Try deep breathing, exercise, meditation, getting enough sleep, or talking to someone you trust.",
    "what is mental health": "Mental health refers to your emotional, psychological, and social wellbeing. It affects how you think, feel, and act.",
    "what is anxiety": "Anxiety is a feeling of worry or unease, often about uncertain outcomes. It's normal in small doses but can become a disorder.",
    "what is depression": "Depression is a mental health condition causing persistent feelings of sadness, loss of interest, and low energy.",
    "how do i sleep better": "Stick to a regular sleep schedule, avoid screens before bed, keep your room cool and dark, and limit caffeine.",
    "what is a calorie": "A calorie is a unit of energy found in food and drinks. Your body uses calories to fuel all its functions.",
    "what are proteins": "Proteins are essential nutrients that build and repair tissues, make enzymes and hormones, and support immune function.",
    "what is cardio": "Cardio is exercise that raises your heart rate and improves cardiovascular health, like running, swimming, or cycling.",
    "how do i build muscle": "Eat enough protein, do strength training regularly, get adequate rest, and stay consistent.",
    "what is blood pressure": "Blood pressure is the force of blood pushing against the walls of your arteries as your heart pumps.",
    "what is diabetes": "Diabetes is a condition where the body cannot properly regulate blood sugar levels.",
    "how do i boost my immune system": "Eat well, exercise, sleep enough, manage stress, and avoid smoking and excessive alcohol.",

    // ── Finance & Money ──
    "what is money": "Money is a medium of exchange used to buy goods and services.",
    "what is a budget": "A budget is a financial plan that tracks your income and expenses to help you manage money wisely.",
    "how do i save money": "Track your spending, cut unnecessary expenses, set savings goals, and automate your savings.",
    "what is inflation": "Inflation is the rate at which the general level of prices for goods and services rises over time.",
    "what is a bank": "A bank is a financial institution that accepts deposits, offers loans, and provides other financial services.",
    "what is a loan": "A loan is money borrowed from a lender that must be repaid with interest over time.",
    "what is interest": "Interest is the cost of borrowing money, expressed as a percentage of the loan amount.",
    "what is investing": "Investing is putting money into assets like stocks, property, or businesses with the expectation of making a profit.",
    "what is a stock": "A stock is a share of ownership in a company. When you buy stock, you own a small part of that company.",
    "what is cryptocurrency": "Cryptocurrency is a digital or virtual currency that uses cryptography for security, like Bitcoin or Ethereum.",
    "what is bitcoin": "Bitcoin is the world's first and most well-known cryptocurrency, created in 2009.",
    "what is a credit card": "A credit card lets you borrow money up to a limit and pay it back later, usually with interest.",
    "what is a debit card": "A debit card draws money directly from your bank account when you make a purchase.",
    "what is tax": "Tax is a mandatory payment collected by the government from individuals and businesses to fund public services.",
    "how do i make money online": "You can make money online through freelancing, selling products, content creation, investing, or remote work.",

    // ── Relationships & Social ──
    "how do i make friends": "Be genuinely interested in others, listen well, be kind, show up consistently, and be yourself.",
    "how do i be more confident": "Practice self-care, set small goals and achieve them, challenge negative thoughts, and celebrate your wins.",
    "how do i handle conflict": "Stay calm, listen to the other person, communicate clearly, focus on solutions, and avoid blame.",
    "how do i apologise": "Be sincere, take responsibility, acknowledge the impact of your actions, and commit to doing better.",
    "how do i be a good listener": "Give full attention, avoid interrupting, ask questions, and show empathy.",
    "what is empathy": "Empathy is the ability to understand and share the feelings of another person.",
    "how do i deal with criticism": "Stay calm, listen openly, separate useful feedback from negativity, and use it to grow.",
    "how do i stop overthinking": "Focus on what you can control, practice mindfulness, set a timer for worrying, and take action.",
    "how do i be happy": "Focus on gratitude, nurture relationships, pursue meaning, take care of your health, and be present.",
    "what is love": "Love is a deep feeling of affection, care, and connection toward another person.",

    // ── Food & Cooking ──
    "what is a recipe": "A recipe is a set of instructions for preparing a particular dish, including ingredients and steps.",
    "how do i boil an egg": "Place the egg in cold water, bring to a boil, then simmer for 6 minutes for soft boiled or 10 for hard boiled.",
    "how do i make tea": "Boil water, pour over a tea bag, steep for 3 to 5 minutes, then add milk or sugar to taste.",
    "how do i make coffee": "Add ground coffee to a filter, pour hot water over it, and let it drip through. Or use a coffee machine!",
    "what are carbohydrates": "Carbohydrates are macronutrients found in foods like bread, rice, pasta, and fruits that provide energy.",
    "what is a vegan": "A vegan is someone who does not consume or use any animal products, including meat, dairy, and eggs.",
    "what is a vegetarian": "A vegetarian is someone who does not eat meat but may still consume dairy and eggs.",
    "what is fasting": "Fasting is voluntarily not eating for a set period of time, often for health, religious, or spiritual reasons.",
    "how do i store food": "Most cooked food should be refrigerated within 2 hours and consumed within 3 to 4 days.",
    "what is junk food": "Junk food is food that is high in calories, sugar, salt, and fat but low in nutritional value.",

    // ── Travel ──
    "what do i need for travel": "You'll typically need a valid passport, visa if required, travel insurance, accommodation, and local currency.",
    "what is a passport": "A passport is an official government document that certifies your identity and nationality for international travel.",
    "what is a visa": "A visa is an official authorisation that allows you to enter, stay in, or leave a specific country.",
    "how do i pack for a trip": "Pack light, roll your clothes to save space, bring essentials first, and always carry important documents.",
    "what is jet lag": "Jet lag is temporary fatigue and disorientation caused by travelling across multiple time zones quickly.",
    "what is the best way to travel": "It depends on distance and budget. Flights are fastest for long distances, while trains and cars work well locally.",
    "how do i find cheap flights": "Use flight comparison sites, book in advance, be flexible with dates, and set price alerts.",
    "what should i do in an emergency abroad": "Contact your country's embassy or consulate, keep emergency numbers saved, and have travel insurance.",

    // ── Entertainment ──
    "recommend a movie": "I'd suggest watching Interstellar if you love sci-fi, or The Shawshank Redemption for a classic drama.",
    "recommend a book": "Try Atomic Habits by James Clear for self improvement, or The Alchemist by Paulo Coelho for inspiration.",
    "recommend a song": "I'd recommend listening to something that matches your mood — upbeat, calm, or something in between!",
    "what is netflix": "Netflix is a popular streaming platform where you can watch movies, TV shows, and documentaries.",
    "what is youtube": "YouTube is a video sharing platform where people upload, watch, and share videos on almost any topic.",
    "what is spotify": "Spotify is a music streaming service with millions of songs, podcasts, and playlists.",
    "what is a podcast": "A podcast is a digital audio show you can listen to on demand, covering topics from news to comedy to education.",
    "what is gaming": "Gaming refers to playing video games, either casually or competitively, on consoles, PCs, or mobile devices.",

    // ── Productivity ──
    "how do i focus better": "Eliminate distractions, use the Pomodoro technique, set clear goals, take breaks, and get enough sleep.",
    "what is the pomodoro technique": "It's a time management method where you work for 25 minutes, then take a 5-minute break, and repeat.",
    "how do i manage my time": "Prioritise tasks, use a planner or calendar, break big tasks into smaller steps, and avoid multitasking.",
    "how do i stop procrastinating": "Start with the smallest possible step, set deadlines, remove distractions, and reward yourself for completing tasks.",
    "what is a goal": "A goal is a specific, desired outcome you work toward through focused effort and planning.",
    "how do i set goals": "Use the SMART method — make goals Specific, Measurable, Achievable, Relevant, and Time-bound.",
    "how do i stay motivated": "Remind yourself of your why, track progress, celebrate small wins, and surround yourself with positive people.",
    "what is a habit": "A habit is a behaviour repeated regularly that becomes automatic over time.",
    "how do i build good habits": "Start small, be consistent, attach the habit to an existing routine, and track your progress.",
    "how do i learn faster": "Use active recall, spaced repetition, teach what you learn, take breaks, and stay curious.",


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