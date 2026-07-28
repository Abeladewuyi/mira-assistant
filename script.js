const orb = document.querySelector(".orb");
const status = document.getElementById("status");
function onAppReady(userName) {
    welcomeScreen.style.display = "none";
    orbContainer.style.display = "flex";

    // ── ADD THIS LINE ──
    // ── Update sidebar with first name only ──
    const firstName = userName
        ? userName.split(" ")[0]
        : "Guest";

    const nameEl = document.getElementById("sidebarName");
    const avatarEl = document.getElementById("sidebarAvatar");

    if (nameEl) nameEl.textContent = firstName;
    if (avatarEl) avatarEl.textContent = firstName.charAt(0).toUpperCase();

    document.dispatchEvent(new CustomEvent('miraUserLoggedIn', {
        detail: { name: firstName }
    }));

    // ... rest of your existing onAppReady code
}
let voices = [];
let conversationState = null;
let memories = {};
let reminders = [];

try {
    memories = JSON.parse(localStorage.getItem("miraMemories")) || {};
} catch (error) {
    console.error("Failed to load memories:", error);
    memories = {};
}

try {
    reminders = JSON.parse(localStorage.getItem("miraReminders")) || [];
} catch (error) {
    console.error("Failed to load reminders:", error);
    reminders = [];
}

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

alert(`Welcome ${user.displayName}`);

onAppReady(user.displayName);

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

alert(`Welcome back ${user.displayName}`);

onAppReady(user.displayName);
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

    const memory = text
        .replace(/^remember(?:\s+that)?\s+/i, "")
        .trim();

    if (memory.includes(" is ")) {

        const parts = memory.split(" is ");

        const key = parts[0].trim().toLowerCase();

        const value = parts.slice(1).join(" is ").trim();

        memories[key] = value;

        localStorage.setItem(
            "miraMemories",
            JSON.stringify(memories)
        );

        if (window.currentUser?.uid) {

            db.collection("users")
              .doc(window.currentUser.uid)
              .collection("memories")
              .doc(key)
              .set({
                  value: value,
                  updatedAt: new Date()
              })
              .catch((error) => {
                  console.error("Failed to save memory to Firestore:", error);
              });

        }

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
        // ── Psychology & Mind ──
    "what is psychology": "Psychology is the scientific study of the mind and behaviour.",
    "what is iq": "IQ stands for Intelligence Quotient. It measures a range of cognitive abilities and intelligence relative to age.",
    "what is eq": "EQ stands for Emotional Quotient. It measures your ability to understand and manage emotions.",
    "what is the subconscious mind": "The subconscious mind stores memories, habits, and beliefs that influence your behaviour without you being aware.",
    "what is cognitive bias": "A cognitive bias is a systematic pattern of thinking that causes errors in judgement or decision making.",
    "what is the placebo effect": "The placebo effect is when a person experiences real improvement after taking an inactive treatment, due to belief alone.",
    "what is confirmation bias": "Confirmation bias is the tendency to search for information that confirms what you already believe.",
    "what is imposter syndrome": "Imposter syndrome is the feeling that you are not as competent as others think, despite evidence of success.",
    "what is gaslighting": "Gaslighting is a form of manipulation where someone causes another person to question their own reality.",
    "what is narcissism": "Narcissism is an excessive interest in oneself, often involving a lack of empathy for others.",
    "what is introvert": "An introvert is someone who gains energy from being alone and finds social interaction draining.",
    "what is extrovert": "An extrovert is someone who gains energy from being around other people and enjoys socialising.",
    "what is a growth mindset": "A growth mindset is the belief that your abilities can be developed through hard work and learning.",
    "what is body language": "Body language is nonverbal communication through gestures, facial expressions, posture, and eye contact.",
    "what is social anxiety": "Social anxiety is intense fear of social situations due to worry about being judged or embarrassed.",
    "what is burnout": "Burnout is a state of physical and emotional exhaustion caused by prolonged stress, often from work.",
    "what is mindfulness": "Mindfulness is the practice of being fully present and aware of the current moment without judgement.",
    "what is self awareness": "Self awareness is the ability to recognise and understand your own emotions, thoughts, and behaviours.",
    "what is emotional intelligence": "Emotional intelligence is the ability to understand, manage, and effectively express your own feelings and understand others.",
    "what is the fight or flight response": "The fight or flight response is a physiological reaction to perceived threat, preparing the body to fight or flee.",

    // ── Business & Entrepreneurship ──
    "what is entrepreneurship": "Entrepreneurship is the process of starting and running a new business, taking on financial risk in hopes of profit.",
    "what is a startup": "A startup is a young company founded to develop a unique product or service, scale it, and disrupt existing markets.",
    "what is a business plan": "A business plan is a document outlining a company's goals, strategies, market analysis, and financial projections.",
    "what is marketing": "Marketing is the process of promoting and selling products or services, including market research and advertising.",
    "what is branding": "Branding is the process of creating a unique identity for a product or company in the consumer's mind.",
    "what is a target market": "A target market is the specific group of people a business aims its products or services at.",
    "what is revenue": "Revenue is the total income a business earns from its sales of goods or services.",
    "what is profit": "Profit is what remains after all expenses have been subtracted from revenue.",
    "what is a business model": "A business model describes how a company creates, delivers, and captures value.",
    "what is supply and demand": "Supply and demand is an economic model where prices are determined by the availability of a product and how much people want it.",
    "what is passive income": "Passive income is money earned with little to no active effort, like rental income, dividends, or royalties.",
    "what is cash flow": "Cash flow is the movement of money in and out of a business over a period of time.",
    "what is a franchise": "A franchise is a business model where one party licenses its brand and methods to another in exchange for fees.",
    "what is roi": "ROI stands for Return on Investment. It measures the profitability of an investment relative to its cost.",
    "what is a pitch": "A pitch is a presentation made to potential investors to convince them to fund your business idea.",
    "what is networking": "Networking is building relationships with people who can offer career opportunities, advice, or support.",
    "what is a niche": "A niche is a specialised segment of a market that a business targets with specific products or services.",
    "what is e-commerce": "E-commerce is the buying and selling of goods and services over the internet.",
    "what is dropshipping": "Dropshipping is a business model where you sell products without holding inventory, shipping directly from the supplier.",
    "what is affiliate marketing": "Affiliate marketing is earning a commission by promoting other companies' products and driving sales.",

    // ── Education ──
    "what is a degree": "A degree is an academic qualification awarded by a university upon completion of a course of study.",
    "what is a phd": "A PhD is a Doctor of Philosophy — the highest academic degree awarded for original research in a field.",
    "what is stem": "STEM stands for Science, Technology, Engineering, and Mathematics — a group of subjects focused on these disciplines.",
    "what is critical thinking": "Critical thinking is the ability to analyse facts objectively and form a reasoned judgement.",
    "what is a scholarship": "A scholarship is financial aid awarded to students based on academic achievement, talent, or financial need.",
    "what is homeschooling": "Homeschooling is educating children at home rather than in a traditional school setting.",
    "what is e-learning": "E-learning is education delivered through digital platforms and the internet.",
    "what is a curriculum": "A curriculum is the subjects and content included in a course of study or educational programme.",
    "how do i study effectively": "Use active recall, spaced repetition, teach what you learn, take breaks, and minimise distractions.",
    "what is a gpa": "GPA stands for Grade Point Average. It's a numerical representation of a student's academic performance.",

    // ── Bible & Faith ──
    "what is the bible": "The Bible is the sacred text of Christianity, consisting of the Old and New Testaments.",
    "who is jesus": "Jesus Christ is the central figure of Christianity, believed by Christians to be the Son of God.",
    "who is god": "God is the supreme being worshipped in many religions as the creator of the universe.",
    "what is prayer": "Prayer is a form of communication with God or a higher power, involving worship, thanksgiving, or requests.",
    "what is faith": "Faith is complete trust or confidence in someone or something, especially in a religious context.",
    "what is sin": "Sin is an act considered immoral or wrong according to religious or moral law.",
    "what is heaven": "Heaven is the concept of a paradise afterlife in many religions where souls go after death.",
    "what is hell": "Hell is the concept of a place of punishment in the afterlife in many religious traditions.",
    "what is grace": "Grace is the free and undeserved help or favor given by God to humans.",
    "what is salvation": "Salvation is the deliverance from sin and its consequences, a central concept in Christianity.",
    "what is the holy spirit": "The Holy Spirit is the third person of the Holy Trinity in Christian belief.",
    "what is baptism": "Baptism is a Christian sacrament of initiation and purification involving water.",
    "what is the gospel": "The Gospel refers to the teachings of Jesus Christ and the first four books of the New Testament.",
    "what is a prophet": "A prophet is someone believed to speak on behalf of God or a divine being.",
    "what is islam": "Islam is a monotheistic religion founded by Prophet Muhammad, with the Quran as its holy book.",
    "what is the quran": "The Quran is the holy book of Islam, believed to be the word of God as revealed to Muhammad.",
    "what is hinduism": "Hinduism is one of the world's oldest religions, originating in India, with diverse beliefs and practices.",
    "what is buddhism": "Buddhism is a religion founded by Siddhartha Gautama, focused on ending suffering through enlightenment.",
    "what is meditation in religion": "In religion, meditation is a practice of focused contemplation to connect with the divine or achieve inner peace.",
    "what is a miracle": "A miracle is an extraordinary event believed to be caused by divine intervention.",

    // ── Cooking & Recipes ──
    "how do i make pasta": "Boil salted water, add pasta, cook for 8 to 10 minutes, drain and add your favourite sauce.",
    "how do i make rice": "Rinse rice, add double the amount of water, bring to boil, then simmer covered for 18 minutes.",
    "how do i make pancakes": "Mix flour, egg, milk and a pinch of salt. Fry spoonfuls in a buttered pan until golden on both sides.",
    "how do i make pizza": "Mix dough, spread tomato sauce, add cheese and toppings, then bake at 220 degrees for 15 minutes.",
    "how do i make fried rice": "Cook rice, fry with eggs, vegetables, soy sauce, and seasoning in a hot wok.",
    "how do i make jollof rice": "Fry tomato paste with onions and peppers, add rice and stock, season and cook until tender.",
    "how do i make soup": "Sauté onions and garlic, add stock, vegetables and protein, season and simmer for 30 minutes.",
    "how do i make bread": "Mix flour, yeast, salt and water. Knead, let rise, shape, let rise again and bake at 200 degrees.",
    "how do i make cake": "Cream butter and sugar, add eggs and flour, mix well and bake at 180 degrees for 30 minutes.",
    "how do i make cookies": "Mix butter, sugar, eggs, flour and chocolate chips. Bake at 180 degrees for 10 to 12 minutes.",
    "how do i fry chicken": "Season chicken, coat in flour, and deep fry in hot oil for 15 to 18 minutes until golden.",
    "how do i make salad": "Chop your favourite vegetables, add protein if desired, and toss with dressing.",
    "how do i make smoothie": "Blend fruit, yoghurt or milk, and ice until smooth. Add honey for sweetness.",
    "how do i make omelette": "Whisk eggs, pour into hot buttered pan, add fillings, fold and serve.",
    "how do i make noodles": "Boil noodles for 3 minutes, drain and stir fry with vegetables, sauce and seasoning.",
    "how do i make stew": "Brown meat, add tomatoes, onions, peppers and stock, season and simmer for 45 minutes.",
    "how do i grill fish": "Season fish, brush with oil, grill for 4 to 5 minutes each side over medium heat.",
    "how do i make guacamole": "Mash avocados, mix with lime juice, diced onion, tomato, coriander and salt.",
    "how do i make mashed potatoes": "Boil potatoes until soft, mash with butter, milk and salt until smooth.",
    "how do i make chocolate cake": "Mix cocoa powder into your cake batter. Add melted chocolate to the frosting for extra richness.",

    // ── Fitness & Exercise ──
    "what is a push up": "A push up is an exercise where you lower and raise your body using your arms while face down.",
    "what is a squat": "A squat is an exercise where you lower your hips from a standing position and then rise back up.",
    "what is a plank": "A plank is a core exercise where you hold a push up position with a straight body.",
    "what is cardio exercise": "Cardio exercise raises your heart rate and improves cardiovascular health. Examples include running and cycling.",
    "what is hiit": "HIIT stands for High Intensity Interval Training, alternating short bursts of intense exercise with rest periods.",
    "how do i get abs": "Combine core exercises like planks and crunches with a healthy diet and reduce overall body fat.",
    "how do i run faster": "Train consistently, do interval sprints, improve your form, and strengthen your legs.",
    "how many calories does running burn": "Running burns approximately 600 calories per hour depending on your weight and speed.",
    "what is yoga": "Yoga is a practice combining physical postures, breathing techniques, and meditation for wellbeing.",
    "what is pilates": "Pilates is a low impact exercise system focusing on core strength, posture, and flexibility.",
    "how do i warm up before exercise": "March in place, do arm circles, leg swings and light stretching for 5 to 10 minutes.",
    "how do i cool down after exercise": "Walk slowly, stretch your major muscle groups, and breathe deeply for 5 to 10 minutes.",
    "how often should i exercise": "Most adults should aim for at least 150 minutes of moderate exercise per week.",
    "what is a rest day": "A rest day is a day off from intense exercise to allow your muscles to recover and grow.",
    "what is strength training": "Strength training uses resistance to build muscle mass, strength, and endurance.",
    "what is flexibility": "Flexibility is the range of motion in your joints and muscles, improved through stretching.",
    "how do i improve posture": "Strengthen your core, stretch your chest and hip flexors, and be mindful of how you sit and stand.",
    "what is a personal trainer": "A personal trainer is a certified fitness professional who creates and guides your exercise programme.",
    "how do i lose belly fat": "Reduce calorie intake, do cardio and strength training, and manage stress and sleep well.",
    "what is body mass index": "BMI is a measure of body fat based on height and weight used to assess whether you are a healthy weight.",

    // ── Music ──
    "what is a chord": "A chord is a group of notes played together to create harmony in music.",
    "what is a scale": "A musical scale is a set of notes arranged in ascending or descending order.",
    "what is tempo": "Tempo is the speed at which a piece of music is played, measured in beats per minute.",
    "what is rhythm": "Rhythm is the pattern of sounds and silences in music over time.",
    "what is melody": "A melody is a sequence of notes that form a recognisable musical phrase or tune.",
    "what is harmony": "Harmony is the combination of different musical notes played or sung simultaneously.",
    "what is a beat": "A beat is the basic unit of time in music, the pulse you tap your foot to.",
    "what is a genre": "A genre is a category of music with shared characteristics, like pop, jazz, or classical.",
    "what is hip hop": "Hip hop is a music genre originating in African American communities, featuring rap, beats and samples.",
    "what is jazz": "Jazz is a music genre that originated in New Orleans, characterised by improvisation and syncopation.",
    "what is classical music": "Classical music refers to formal Western music composed between roughly 1750 and 1820, or broadly any formal orchestral music.",
    "what is afrobeats": "Afrobeats is a West African music genre blending traditional African music with pop, R&B and hip hop.",
    "what is a DJ": "A DJ is a disc jockey who mixes and plays recorded music for an audience.",
    "how do i learn guitar": "Start with basic chords, practise daily, learn simple songs, and consider taking lessons.",
    "how do i learn to sing": "Practise breathing exercises, warm up your voice, match pitch, and consider vocal coaching.",
    "what is a music producer": "A music producer oversees and manages the recording, mixing and production of a song or album.",
    "what is sampling in music": "Sampling is taking a portion of an existing recording and reusing it in a new piece of music.",
    "what is a music video": "A music video is a short film that accompanies and promotes a song.",
    "what makes a good song": "A good song usually has a memorable melody, relatable lyrics, strong rhythm, and emotional resonance.",
    "who is the greatest musician of all time": "That's very subjective, but names like Michael Jackson, Beethoven, and Bob Marley are often mentioned.",

    // ── Movies & TV ──
    "what is a blockbuster": "A blockbuster is a film or TV show that is highly popular and commercially successful.",
    "what is an oscar": "An Oscar is the nickname for the Academy Award, the highest honour in the American film industry.",
    "what is netflix": "Netflix is a streaming service offering a wide range of films, TV shows, and documentaries.",
    "what is a series": "A series or TV show is a set of related episodes broadcast in sequence over time.",
    "what is animation": "Animation is the technique of creating the illusion of movement through a sequence of images.",
    "what is a documentary": "A documentary is a non-fiction film or TV programme presenting factual information about real events.",
    "what is a thriller": "A thriller is a genre of fiction designed to keep the audience in suspense and excitement.",
    "what is a comedy": "A comedy is a genre of entertainment intended to make people laugh.",
    "what is a drama": "A drama is a genre that deals with serious themes through realistic characters and situations.",
    "what is science fiction": "Science fiction is a genre exploring futuristic concepts like space travel, AI, and alternate realities.",
    "what is a sequel": "A sequel is a film, book, or show that continues the story of a previous work.",
    "what is a remake": "A remake is a new version of an older film or show.",
    "what is a box office": "The box office refers to ticket sales revenue for a film.",
    "what is a streaming service": "A streaming service delivers video or audio content over the internet on demand.",
    "what is anime": "Anime is a style of animation originating from Japan, known for colourful art and diverse themes.",
    "what is a manga": "Manga are Japanese comic books and graphic novels, often the source material for anime.",
    "what is a cliffhanger": "A cliffhanger is an ending that leaves the audience in suspense about what happens next.",
    "what is a plot twist": "A plot twist is an unexpected development in a story that changes the direction of the narrative.",
    "what is cgi": "CGI stands for Computer Generated Imagery, used to create visual effects in films and TV.",
    "what is a director": "A film director controls the creative vision of a movie, guiding actors and crew during production.",

    // ── Gaming ──
    "what is esports": "Esports is competitive video gaming at a professional level, often with large prize pools.",
    "what is a console": "A gaming console is a device designed specifically to play video games, like PlayStation or Xbox.",
    "what is fps in gaming": "FPS stands for Frames Per Second, measuring how smoothly a game runs on screen.",
    "what is an open world game": "An open world game lets players freely roam and explore a large virtual environment.",
    "what is a battle royale": "A battle royale is a game mode where many players compete until only one remains.",
    "what is minecraft": "Minecraft is a sandbox game where players build and explore worlds made of blocks.",
    "what is fortnite": "Fortnite is a popular battle royale game developed by Epic Games.",
    "what is a rpg game": "RPG stands for Role Playing Game, where players take on character roles and make story choices.",
    "what is a moba": "MOBA stands for Multiplayer Online Battle Arena, a game genre like League of Legends.",
    "what is a speedrun": "A speedrun is completing a video game as fast as possible, often using tricks and exploits.",
    "what is lag in gaming": "Lag is a delay between a player's action and the game's response, usually due to network issues.",
    "what is a cheat code": "A cheat code is a secret input that gives players special abilities or advantages in a game.",
    "what is level up": "Levelling up means advancing to the next level in a game, usually gaining new abilities.",
    "what is a loot box": "A loot box is an in-game purchase that gives random rewards.",
    "what is a sandbox game": "A sandbox game gives players freedom to create, modify, and explore without set objectives.",
    "what is vr gaming": "VR gaming uses virtual reality headsets to immerse players in a three dimensional game world.",
    "what is a controller": "A gaming controller is a handheld device used to input commands in video games.",
    "what is a walkthrough": "A walkthrough is a guide that explains how to complete a game step by step.",
    "what is multiplayer": "Multiplayer is a game mode where multiple players compete or cooperate simultaneously.",
    "what is a save file": "A save file stores your game progress so you can continue from where you left off.",

    // ── Social Media ──
    "what is instagram": "Instagram is a social media platform for sharing photos and videos.",
    "what is tiktok": "TikTok is a social media app for creating and sharing short videos.",
    "what is snapchat": "Snapchat is an app for sending photos and videos that disappear after viewing.",
    "what is twitter": "Twitter, now called X, is a social media platform for sharing short messages called tweets.",
    "what is linkedin": "LinkedIn is a professional social network for career development and business connections.",
    "what is a hashtag": "A hashtag is a word or phrase preceded by the hash symbol used to categorise content on social media.",
    "what is a meme": "A meme is a humorous image, video, or text that spreads rapidly online.",
    "what is going viral": "Going viral means content spreads rapidly and widely across the internet.",
    "what is a content creator": "A content creator is someone who produces and publishes content online for an audience.",
    "what is an influencer": "An influencer is a social media personality who can affect the opinions and purchases of their followers.",
    "what is a reel": "A reel is a short video format on Instagram or Facebook.",
    "what is a story": "A story is a temporary photo or video post on platforms like Instagram or Snapchat that disappears after 24 hours.",
    "what is engagement rate": "Engagement rate measures how much people interact with your content through likes, comments and shares.",
    "what is a follower": "A follower is someone who subscribes to see your content on social media.",
    "what is a dm": "DM stands for Direct Message, a private message sent between users on social media.",
    "what is cyberbullying": "Cyberbullying is the use of technology to harass, threaten, or humiliate someone.",
    "what is a verified account": "A verified account has a badge confirming it belongs to the claimed person or organisation.",
    "what is a username": "A username is the unique name you use to identify yourself on a platform.",
    "what is social media detox": "A social media detox is a period of voluntarily avoiding social media to improve mental wellbeing.",
    "what is fake news": "Fake news is false or misleading information presented as legitimate news.",

    // ── Fashion & Style ──
    "what is fashion": "Fashion is a popular style of clothing, accessories and behaviour at a given time.",
    "what is streetwear": "Streetwear is a casual fashion style influenced by skate culture, hip hop, and sportswear.",
    "what is haute couture": "Haute couture is high end custom fashion created by top designers.",
    "what is a capsule wardrobe": "A capsule wardrobe is a small collection of versatile, timeless clothing items that work well together.",
    "what is vintage fashion": "Vintage fashion refers to clothing from a previous era, typically at least 20 years old.",
    "what is sustainable fashion": "Sustainable fashion focuses on producing clothing in ways that are environmentally and socially responsible.",
    "what are sneakers": "Sneakers are casual athletic shoes, often collected and worn as a fashion statement.",
    "what is a dress code": "A dress code is a set of rules about what clothing is acceptable in a particular setting.",
    "what is smart casual": "Smart casual is a dress code that combines professional and relaxed clothing elements.",
    "what is athleisure": "Athleisure is a fashion trend combining athletic and leisurewear, designed for both exercise and everyday wear.",
    "how do i dress well": "Know your body shape, invest in quality basics, keep outfits simple and make sure clothes fit well.",
    "what are the fashion seasons": "Fashion traditionally has two main seasons, Spring and Summer, and Autumn and Winter.",
    "what is a fashion designer": "A fashion designer creates clothing, accessories, and footwear.",
    "what is colour theory in fashion": "Colour theory helps you understand which colours complement each other when putting outfits together.",
    "what is a statement piece": "A statement piece is a bold, eye catching item that becomes the focal point of an outfit.",
    "how do i take care of my clothes": "Follow care labels, wash at the right temperature, avoid over drying, and store clothes properly.",
    "what is thrifting": "Thrifting is buying second hand clothing from charity shops or thrift stores.",
    "what is fast fashion": "Fast fashion is the rapid production of high volume, low cost trendy clothing, often harmful to the environment.",
    "what is a fashion week": "Fashion week is a series of events where designers showcase their collections to buyers and media.",
    "what is an outfit of the day": "Outfit of the day, or OOTD, is a term used on social media when sharing your daily outfit.",

    // ── Cars & Transport ──
    "what is an electric car": "An electric car is powered by electric motors and rechargeable batteries instead of petrol.",
    "what is a hybrid car": "A hybrid car uses both a petrol engine and an electric motor for better fuel efficiency.",
    "how do i change a tyre": "Loosen the lug nuts, jack up the car, remove the flat tyre, fit the spare, and tighten the lug nuts.",
    "how do i check my tyre pressure": "Use a pressure gauge on each tyre valve and compare to the recommended pressure in your car manual.",
    "what is an mot": "An MOT is an annual vehicle safety test required in the UK for cars over three years old.",
    "what is horsepower": "Horsepower is a unit measuring the power output of an engine.",
    "what is torque": "Torque is the rotational force an engine produces, affecting how quickly a car accelerates.",
    "what is a manual car": "A manual car requires the driver to change gears using a clutch pedal and gear stick.",
    "what is an automatic car": "An automatic car changes gears automatically without driver input.",
    "how do i parallel park": "Signal, stop beside the car ahead, reverse at an angle into the space, then straighten up.",
    "what is road tax": "Road tax is a government fee for using a vehicle on public roads.",
    "what is car insurance": "Car insurance is a policy that covers financial loss from accidents, theft, or damage to your vehicle.",
    "what is an suv": "An SUV is a Sport Utility Vehicle, a large car built for rough terrain but also used for everyday driving.",
    "what is fuel economy": "Fuel economy measures how far a vehicle can travel per unit of fuel, like miles per gallon.",
    "what is a driving licence": "A driving licence is an official document permitting a person to operate a vehicle.",
    "how do i learn to drive": "Take professional driving lessons, practise regularly, study the highway code, and pass your test.",
    "what is a traffic jam": "A traffic jam is a long line of vehicles unable to move or moving very slowly.",
    "what is a roundabout": "A roundabout is a circular junction where traffic flows in one direction around a central island.",
    "what is public transport": "Public transport is a system of shared vehicles available for use by the public, like buses and trains.",
    "what is uber": "Uber is a ride hailing app that connects passengers with drivers for on demand transportation.",

    // ── Home & Living ──
    "how do i clean my house": "Start from top to bottom, dust surfaces, clean bathrooms, vacuum and mop floors.",
    "how do i organise my room": "Declutter first, assign a place for everything, use storage solutions, and maintain tidiness daily.",
    "how do i unclog a drain": "Pour boiling water, then baking soda and vinegar. Wait 30 minutes then flush with hot water.",
    "how do i fix a leaking tap": "Turn off the water supply, disassemble the tap, replace the washer, and reassemble.",
    "how do i paint a wall": "Clean the wall, apply primer, then paint in W shaped strokes from top to bottom.",
    "what is feng shui": "Feng shui is a Chinese practice of arranging spaces to promote harmony and positive energy flow.",
    "how do i save electricity": "Turn off lights when not in use, use energy efficient bulbs, and unplug devices on standby.",
    "how do i reduce water usage": "Fix leaks, take shorter showers, turn off taps when not in use, and use full loads in washing machines.",
    "what is minimalism in home": "Minimalism in the home is a style that uses only essential items, reducing clutter and excess.",
    "how do i make my home smell nice": "Use diffusers, candles, fresh flowers, open windows, and clean regularly.",
    "what is smart home technology": "Smart home technology lets you control home devices like lights and heating remotely via apps.",
    "how do i deal with mould": "Clean with mould remover, fix the source of moisture, improve ventilation, and use a dehumidifier.",
    "what is a landlord": "A landlord is a person who rents out property to tenants.",
    "what is a mortgage": "A mortgage is a loan taken out to buy property, repaid with interest over a set period.",
    "how do i choose a neighbourhood": "Consider safety, transport links, schools, amenities, and your budget.",
    "what is home insurance": "Home insurance covers damage to your property and possessions from events like fire or theft.",
    "how do i declutter": "Go through belongings category by category, keep only what you use or love, and donate or discard the rest.",
    "what is interior design": "Interior design is the art of enhancing the interior of a space to achieve a more functional and aesthetic environment.",
    "how do i make a small room look bigger": "Use light colours, mirrors, good lighting, and multi functional furniture.",
    "what is a studio apartment": "A studio apartment is a small self contained flat where the living, sleeping and kitchen areas are in one room.",

    // ── Nigeria & Africa specific ──
    "what is nigeria": "Nigeria is the most populous country in Africa, located in West Africa, with Abuja as its capital.",
    "what is the capital of nigeria": "The capital of Nigeria is Abuja.",
    "what is lagos": "Lagos is the largest city in Nigeria and one of the largest in Africa, a major commercial hub.",
    "what is the naira": "The naira is the official currency of Nigeria.",
    "what is afrobeats": "Afrobeats is a genre of music from West Africa, especially Nigeria, blending African sounds with pop and R&B.",
    "who is burna boy": "Burna Boy is a Nigerian singer and songwriter known for his Afrofusion style and Grammy win.",
    "who is wizkid": "Wizkid is a Nigerian Afrobeats artist known globally for his music and collaborations.",
    "what is jollof rice": "Jollof rice is a popular West African dish of rice cooked in a tomato and pepper sauce.",
    "what is nollywood": "Nollywood is the Nigerian film industry, one of the largest film industries in the world.",
    "what is the african union": "The African Union is a continental organisation comprising 55 African countries promoting unity and development.",
    "what is south africa": "South Africa is a country at the southern tip of Africa, known for its diverse culture and history.",
    "what is kenya": "Kenya is an East African country known for its wildlife, landscapes, and athletics.",
    "what is ghana": "Ghana is a West African country known for its rich history, culture, and as the first sub-Saharan country to gain independence.",
    "what is the sahara desert": "The Sahara is the world's largest hot desert, covering much of North Africa.",
    "what is the nile river": "The Nile is one of the world's longest rivers, flowing through northeastern Africa.",
    "what languages are spoken in nigeria": "Nigeria has over 500 languages. The official language is English, with Hausa, Yoruba and Igbo being major languages.",
    "what is pidgin english": "Nigerian Pidgin is a creole language widely spoken across Nigeria as a common tongue.",
    "what is the population of africa": "Africa has a population of over 1.4 billion people across 54 countries.",
    "who is the president of nigeria": "I don't have live data, but you can search for the current Nigerian president for the latest information.",
    "what is the biggest country in africa": "Algeria is the largest country in Africa by land area.",

    // ── Science & Nature ──
    "what is a hurricane": "A hurricane is a powerful tropical storm with winds exceeding 119 kilometres per hour.",
    "what is thunder": "Thunder is the loud sound caused by the rapid expansion of air heated by lightning.",
    "what is lightning": "Lightning is a sudden electrostatic discharge during a thunderstorm.",
    "what is a rainbow": "A rainbow is an arc of colours formed in the sky by the refraction of sunlight through rain droplets.",
    "what is the water cycle": "The water cycle is the continuous movement of water through evaporation, condensation, and precipitation.",
    "what causes seasons": "Seasons are caused by the Earth's tilt on its axis as it orbits the Sun.",
    "what is an eclipse": "An eclipse occurs when one celestial body moves into the shadow of another.",
    "what is a solar eclipse": "A solar eclipse happens when the Moon passes between the Earth and the Sun, blocking sunlight.",
    "what is a lunar eclipse": "A lunar eclipse happens when the Earth comes between the Sun and the Moon.",
    "what is the atmosphere": "The atmosphere is the layer of gases surrounding the Earth held in place by gravity.",
    "what is the food chain": "A food chain is the sequence of who eats whom in an ecosystem.",
    "what is photosynthesis": "Photosynthesis is the process plants use to convert sunlight, water and carbon dioxide into food.",
    "what is a cell": "A cell is the basic structural and functional unit of all living organisms.",
    "what is mitosis": "Mitosis is the process by which a cell divides to produce two identical daughter cells.",
    "what is a fossil": "A fossil is the preserved remains or traces of ancient organisms found in rock.",
    "what is a species": "A species is a group of organisms that can interbreed and produce fertile offspring.",
    "what is natural selection": "Natural selection is the process by which organisms better adapted to their environment tend to survive and reproduce.",
    "what is an ecosystem": "An ecosystem is a community of living organisms interacting with their physical environment.",
    "what is climate": "Climate is the long term pattern of weather in a particular area.",
    "what is a habitat": "A habitat is the natural environment in which a species lives.",

    // ── Politics & Society ──
    "what is a president": "A president is the elected head of state of a republic.",
    "what is a prime minister": "A prime minister is the head of government in parliamentary systems.",
    "what is parliament": "Parliament is the legislative body of a country responsible for making laws.",
    "what is an election": "An election is a formal process by which people vote to choose their leaders.",
    "what is a political party": "A political party is an organised group with shared political beliefs that contests elections.",
    "what is capitalism": "Capitalism is an economic system where businesses and means of production are privately owned.",
    "what is socialism": "Socialism is an economic system where the means of production are owned or regulated by the community.",
    "what is communism": "Communism is a political and economic ideology advocating for collective ownership and a classless society.",
    "what is a constitution": "A constitution is the set of fundamental laws and principles that govern a nation.",
    "what is human rights": "Human rights are basic rights and freedoms that all people are entitled to regardless of nationality.",
    "what is the united nations": "The United Nations is an international organisation founded in 1945 to promote peace and cooperation.",
    "what is nato": "NATO is the North Atlantic Treaty Organisation, a military alliance of North American and European countries.",
    "what is the european union": "The EU is a political and economic union of 27 European countries.",
    "what is globalisation": "Globalisation is the process of increasing interconnection between countries economically, culturally, and politically.",
    "what is a refugee": "A refugee is a person who has fled their home country due to war, persecution, or disaster.",
    "what is immigration": "Immigration is the process of people moving to another country to live permanently.",
    "what is poverty": "Poverty is the state of lacking sufficient money or resources to meet basic needs.",
    "what is inequality": "Inequality refers to differences in income, wealth, or opportunities between people or groups.",
    "what is corruption": "Corruption is dishonest or fraudulent conduct by people in power for personal gain.",
    "what is activism": "Activism is taking action to promote social or political change.",

    // ── Mental Health ──
    "what is therapy": "Therapy is a treatment where a trained professional helps someone work through mental or emotional challenges.",
    "what is cbt": "CBT stands for Cognitive Behavioural Therapy, a type of therapy that helps change negative thought patterns.",
    "what is ptsd": "PTSD is Post Traumatic Stress Disorder, a condition triggered by experiencing or witnessing a traumatic event.",
    "what is adhd": "ADHD is Attention Deficit Hyperactivity Disorder, affecting focus, impulse control and energy levels.",
    "what is ocd": "OCD is Obsessive Compulsive Disorder, involving unwanted repetitive thoughts and behaviours.",
    "what is bipolar disorder": "Bipolar disorder causes extreme mood swings between emotional highs and deep lows.",
    "what is schizophrenia": "Schizophrenia is a serious mental disorder affecting how a person thinks, feels, and perceives reality.",
    "what is eating disorder": "An eating disorder is a serious condition involving unhealthy eating habits and distorted body image.",
    "what is self harm": "Self harm is when someone deliberately hurts themselves as a way of coping with emotional pain.",
    "how do i help someone with depression": "Listen without judgement, encourage them to seek professional help, check in regularly, and show care.",
    "how do i manage anxiety": "Try deep breathing, grounding techniques, regular exercise, limiting caffeine, and speaking to a therapist.",
    "what is a panic attack": "A panic attack is a sudden episode of intense fear with physical symptoms like racing heart and shortness of breath.",
    "how do i calm a panic attack": "Focus on slow deep breaths, ground yourself by noticing things around you, and remind yourself it will pass.",
    "what is loneliness": "Loneliness is the feeling of being isolated or disconnected from others.",
    "what is grief": "Grief is the emotional response to loss, particularly the death of someone close.",
    "how do i deal with grief": "Allow yourself to feel the emotions, talk about the person, seek support, and give yourself time.",
    "what is toxic positivity": "Toxic positivity is the excessive promotion of positive thinking that dismisses or invalidates genuine emotions.",
    "what is self care": "Self care is the practice of taking actions to preserve or improve your own health and wellbeing.",
    "what is a support system": "A support system is a network of people who provide emotional and practical help.",
    "how do i improve my mental health": "Exercise regularly, sleep well, eat nutritiously, connect with others, and seek professional help when needed.",

    // ── Technology & Internet ──
    "what is 5g": "5G is the fifth generation of mobile network technology offering faster speeds and lower latency.",
    "what is artificial intelligence": "AI is technology that enables machines to perform tasks that normally require human intelligence.",
    "what is machine learning": "Machine learning is a type of AI where systems learn from data to improve their performance.",
    "what is the metaverse": "The metaverse is a concept of a persistent virtual world where people can interact, work, and play.",
    "what is blockchain": "Blockchain is a decentralised digital ledger that records transactions across multiple computers.",
    "what is nft": "An NFT is a Non Fungible Token, a unique digital asset verified using blockchain technology.",
    "what is cloud computing": "Cloud computing is the delivery of computing services like storage and software over the internet.",
    "what is a vpn": "A VPN is a Virtual Private Network that encrypts your internet connection for privacy and security.",
    "what is big data": "Big data refers to extremely large datasets that can be analysed to reveal patterns and trends.",
    "what is the dark web": "The dark web is a hidden part of the internet not indexed by search engines, often used anonymously.",
    "what is phishing": "Phishing is a cyber attack where criminals send fake messages to trick people into revealing sensitive information.",
    "what is two factor authentication": "Two factor authentication adds an extra security step when logging in, like a code sent to your phone.",
    "what is open source": "Open source software has its source code freely available for anyone to use, modify, and distribute.",
    "what is an algorithm": "An algorithm is a set of rules or instructions that a computer follows to solve a problem.",
    "what is augmented reality": "Augmented reality overlays digital content onto the real world through a device like a phone.",
    "what is the internet of things": "The Internet of Things refers to everyday objects connected to the internet to collect and share data.",
    "what is a firewall": "A firewall is a security system that monitors and controls network traffic to prevent unauthorised access.",
    "what is a server": "A server is a computer that provides data and services to other computers over a network.",
    "what is data privacy": "Data privacy is the right to control how your personal information is collected and used.",
    "what is a software update": "A software update is a new version of a programme that fixes bugs, improves performance, or adds features.",

    // ── Everyday Adulting ──
    "how do i open a bank account": "Visit a bank or their website with your ID and proof of address to complete an application.",
    "how do i write a cheque": "Write the date, payee name, amount in numbers and words, then sign it.",
    "how do i pay bills": "Set up direct debits, use online banking, or pay at the post office or bank.",
    "how do i do my taxes": "Gather income documents, use tax software or hire an accountant, and submit before the deadline.",
    "how do i apply for a job": "Write a strong CV, craft a cover letter, apply online or in person, and prepare for interviews.",
    "how do i negotiate a contract": "Know your worth, research market rates, be clear about your terms, and be willing to compromise.",
    "how do i rent an apartment": "Research areas, view properties, submit an application, provide references, and sign a lease.",
    "how do i create a will": "List your assets, name beneficiaries, choose an executor, and have it witnessed and signed legally.",
    "how do i invest my money": "Start with a clear goal, research options like stocks or property, diversify, and consider a financial advisor.",
    "how do i build credit": "Pay bills on time, use a credit card responsibly, keep balances low, and avoid too many credit applications.",
    "how do i deal with debt": "List all debts, prioritise by interest rate, create a budget, and contact creditors if struggling.",
    "how do i save for retirement": "Start early, contribute to a pension, take advantage of employer contributions, and invest wisely.",
    "what is a pension": "A pension is a retirement savings plan that provides income after you stop working.",
    "how do i write a formal email": "Use a clear subject line, professional greeting, concise body, and formal sign off.",
    "how do i complain effectively": "Stay calm, be specific about the issue, state what resolution you want, and follow up in writing.",
    "how do i read a contract": "Read every clause carefully, note key dates and obligations, and seek legal advice if unsure.",
    "how do i get a passport": "Complete the application form, provide photos and ID documents, pay the fee, and submit to the passport office.",
    "how do i vote": "Register to vote, find your polling station, bring ID if required, and mark your ballot on election day.",
    "how do i start a small business": "Identify your idea, create a business plan, register your business, sort finances, and start marketing.",
    "how do i manage stress at work": "Take regular breaks, prioritise tasks, communicate with your manager, and maintain work life balance.",

    // ── Nature & Environment ──
    "what are rainforests": "Rainforests are dense forests with high rainfall, home to over half the world's plant and animal species.",
    "what is deforestation": "Deforestation is the large scale removal of forests, threatening ecosystems and accelerating climate change.",
    "what is ocean acidification": "Ocean acidification is the decrease in ocean pH caused by the absorption of carbon dioxide from the atmosphere.",
    "what are coral reefs": "Coral reefs are underwater ecosystems built by colonies of tiny animals, rich in marine biodiversity.",
    "what is wildlife conservation": "Wildlife conservation is the protection of plant and animal species and their habitats.",
    "what is poaching": "Poaching is the illegal hunting or capturing of wild animals.",
    "what is an endangered species": "An endangered species is a plant or animal at risk of extinction due to habitat loss or human activity.",
    "what is a national park": "A national park is a protected area of natural beauty managed by the government.",
    "what is composting": "Composting is the process of decomposing organic waste into nutrient rich soil for gardening.",
    "what are fossil fuels": "Fossil fuels are energy sources formed from ancient organisms, including coal, oil, and natural gas.",
    "what is nuclear energy": "Nuclear energy is produced by splitting atoms in a process called nuclear fission.",
    "what is hydroelectric power": "Hydroelectric power generates electricity using the energy of flowing water.",
    "what is an invasive species": "An invasive species is a non native plant or animal that spreads and harms local ecosystems.",
    "what is the greenhouse effect": "The greenhouse effect is the trapping of heat in the atmosphere by greenhouse gases.",
    "what is carbon neutral": "Being carbon neutral means balancing the amount of carbon emitted with the amount removed or offset.",
    "what is a nature reserve": "A nature reserve is a protected area set aside for wildlife and natural habitats.",
    "what is ecotourism": "Ecotourism is responsible travel to natural areas that conserves the environment and supports local communities.",
    "what is urban farming": "Urban farming is the practice of growing food in cities, including community gardens and rooftop farms.",
    "what causes wildfires": "Wildfires can be caused by lightning, human activity, or extreme heat and dry conditions.",
    "what is the arctic": "The Arctic is the northernmost region of Earth, an ocean largely covered by ice and surrounded by land.",

    // ── Random Daily Questions ──
    "how do i wake up early": "Set a consistent sleep schedule, place your alarm across the room, and have a reason to get up.",
    "how do i stop snoozing": "Place your alarm far from your bed, go to sleep earlier, and avoid screens before bed.",
    "how do i make friends as an adult": "Join clubs or classes, say yes to social events, be genuinely interested in others, and follow up.",
    "how do i deal with awkward silence": "Ask an open ended question, comment on your surroundings, or embrace the silence comfortably.",
    "how do i remember names": "Repeat the name when you meet someone, associate it with something memorable, and use it in conversation.",
    "how do i stop worrying": "Focus on what you can control, challenge anxious thoughts, and practice mindfulness.",
    "how do i be more productive": "Prioritise tasks, eliminate distractions, use time blocks, and take regular short breaks.",
    "how do i say no": "Be polite but firm, give a brief reason, and don't over explain or apologise excessively.",
    "how do i deal with rejection": "Allow yourself to feel it, don't take it personally, learn from it, and move forward.",
    "how do i stop comparing myself": "Focus on your own journey, celebrate your progress, and limit social media consumption.",
    "how do i be more creative": "Try new experiences, read widely, give yourself permission to experiment, and take breaks.",
    "how do i deal with change": "Accept what you cannot control, focus on the positives, give yourself time to adjust, and seek support.",
    "how do i improve my memory": "Use repetition, associate new information with what you know, sleep well, and stay mentally active.",
    "how do i be more organised": "Use a planner, set priorities, break tasks into steps, and tidy your environment regularly.",
    "how do i deal with toxic people": "Set firm boundaries, limit contact, avoid engaging with negativity, and focus on your own wellbeing.",
    "how do i stop overthinking at night": "Write your thoughts down, do a body scan relaxation, and establish a calming bedtime routine.",
    "how do i be present": "Put away your phone, focus on your senses, listen actively, and practise mindfulness.",
    "how do i stop being lazy": "Start with the smallest possible action, remove distractions, reward yourself, and build momentum.",
    "how do i deal with failure": "Accept it, learn from it, separate it from your identity, and use it as motivation to improve.",
    "how do i find my purpose": "Reflect on what gives you energy, what you are good at, and how you can help others.",

    // ── School & Student Life ──
    "how do i pass exams": "Start early, create a study schedule, practise past papers, sleep well, and stay hydrated.",
    "how do i take notes effectively": "Use the Cornell method, summarise in your own words, highlight key points, and review regularly.",
    "how do i write an essay": "Plan your argument, write a clear introduction, develop points in the body, and summarise in the conclusion.",
    "how do i cite sources": "Follow the referencing style required, include author, date, title, and source details.",
    "what is a thesis statement": "A thesis statement is a sentence that summarises the main point or claim of an essay.",
    "how do i avoid plagiarism": "Always cite your sources, paraphrase properly, use quotation marks for direct quotes, and use plagiarism checkers.",
    "how do i manage student loans": "Create a budget, pay interest during studies if possible, and explore repayment plans.",
    "how do i study for a test": "Review notes, test yourself with flashcards, explain concepts out loud, and get enough sleep.",
    "what is critical analysis": "Critical analysis is the detailed examination and evaluation of a text, argument, or work.",
    "how do i write a bibliography": "List all sources you used in alphabetical order following your required citation format.",
    "how do i improve my grades": "Attend class, ask questions, review material regularly, seek help early, and stay organised.",
    "what is a dissertation": "A dissertation is a long research paper submitted as part of a degree programme.",
    "how do i choose a university course": "Consider your interests, career goals, subject strengths, and research course content and job prospects.",
    "what is a gap year": "A gap year is a year taken off between school and university or work for travel, volunteering, or personal development.",
    "how do i deal with exam stress": "Prepare thoroughly, take breaks, practise deep breathing, talk to someone, and maintain perspective.",
    "what is student life like": "Student life involves studying, socialising, managing finances, and developing independence.",
    "how do i balance study and social life": "Prioritise academics, create a schedule, set study goals, and protect time for rest and social activities.",
    "what is a lecture": "A lecture is a formal talk given by a teacher or expert to a group of students.",
    "what is a seminar": "A seminar is a small group academic discussion session, often student led.",
    "how do i deal with homesickness at university": "Stay connected with family, build new friendships, get involved in campus activities, and give yourself time to adjust.",

    // ── Relationships & Dating ──
    "how do i ask someone out": "Be confident, choose a comfortable setting, be direct and genuine, and accept their answer gracefully.",
    "what is a first date": "A first date is an initial outing with someone you are romantically interested in to see if there is a connection.",
    "how do i plan a date": "Consider their interests, choose a location you both enjoy, keep it relaxed, and focus on conversation.",
    "what is flirting": "Flirting is expressing romantic interest through playful conversation, eye contact, and compliments.",
    "what is a long distance relationship": "A long distance relationship is a romantic relationship where partners live far apart.",
    "how do i make a long distance relationship work": "Communicate regularly, set visit schedules, trust each other, and have shared goals.",
    "what is cheating in a relationship": "Cheating is being romantically or sexually unfaithful to your partner.",
    "how do i recover from cheating": "Decide if you want to rebuild trust, seek counselling, communicate openly, and give it time.",
    "what is an open relationship": "An open relationship is one where both partners agree to have romantic or sexual connections outside the relationship.",
    "what is emotional cheating": "Emotional cheating is forming a deep emotional bond with someone outside your relationship that crosses boundaries.",
    "how do i know when to break up": "Consider if your values have changed, if the relationship is harmful, or if you no longer feel happy.",
    "how do i break up with someone": "Be honest and direct, do it in person if possible, be kind, and give them space afterwards.",
    "how do i move on after a breakup": "Allow yourself to grieve, reconnect with friends, rediscover hobbies, and avoid contact for a period.",
    "what is ghosting": "Ghosting is suddenly cutting off all communication with someone without explanation.",
    "what is gaslighting in relationships": "Gaslighting in relationships is when a partner manipulates you into questioning your own reality.",
    "what is a situationship": "A situationship is an undefined romantic connection that is more than friendship but less than a committed relationship.",
    "what are green flags in a relationship": "Green flags include respect, good communication, emotional support, shared values, and consistency.",
    "what are red flags in a relationship": "Red flags include controlling behaviour, lack of respect, dishonesty, jealousy, and poor communication.",
    "how do i build trust in a relationship": "Be consistent, keep your promises, communicate honestly, and show vulnerability.",
    "what is unconditional love": "Unconditional love is affection without limitations or conditions, accepting someone fully as they are.",

    // ── General Knowledge ──
    "what is the population of the world": "The world population is approximately 8 billion people.",
    "what is the richest country in the world": "Luxembourg and Singapore consistently rank among the richest countries by GDP per capita.",
    "what is the poorest country in the world": "Countries like Burundi and Somalia consistently rank among the poorest by GDP per capita.",
    "what is the most spoken language in the world": "Mandarin Chinese has the most native speakers, while English is the most widely spoken overall.",
    "what is the oldest country in the world": "San Marino, founded in 301 AD, is often considered the world's oldest republic.",
    "what is the newest country in the world": "South Sudan became the world's newest country in 2011.",
    "what is the longest word in english": "Pneumonoultramicroscopicsilicovolcanoconiosis is considered the longest word in the English language.",
    "what is the most expensive city in the world": "Cities like Hong Kong, Singapore, and Zurich consistently rank as the most expensive.",
    "how many bones are in the human body": "Adults have 206 bones in the human body.",
    "how many teeth does an adult have": "Adults have 32 teeth including wisdom teeth.",
    "how fast does hair grow": "Hair grows approximately 15 centimetres or 6 inches per year.",
    "how long does it take to form a habit": "Research suggests it takes an average of 66 days to form a new habit.",
    "what is the rarest blood type": "AB negative is the rarest blood type, found in less than 1 percent of the population.",
    "how much of the ocean is unexplored": "Over 80 percent of the world's oceans remain unexplored.",
    "what is the deepest part of the ocean": "The Mariana Trench in the Pacific Ocean is the deepest point, reaching about 11 kilometres down.",
    "how old is the earth": "The Earth is approximately 4.54 billion years old.",
    "how many stars are in the milky way": "The Milky Way contains an estimated 100 to 400 billion stars.",
    "what is the hottest place on earth": "Death Valley in California holds the record for the highest recorded temperature at 56.7 degrees Celsius.",
    "what is the coldest place on earth": "Antarctica holds the record for the coldest temperature ever recorded at minus 89.2 degrees Celsius.",
    "what is the tallest building in the world": "The Burj Khalifa in Dubai is the tallest building at 828 metres.",
    // ── Law & Rights ──
    "what is human rights": "Human rights are basic rights and freedoms that every person is entitled to regardless of nationality or status.",
    "what is democracy": "Democracy is a system of government where citizens vote to elect their leaders and influence policy.",
    "what is the constitution": "A constitution is a set of fundamental laws and principles that govern a country.",
    "what is a lawyer": "A lawyer is a professional who practises law, advising clients and representing them in legal matters.",
    "what is copyright": "Copyright is a legal right that gives creators exclusive control over how their work is used or distributed.",
    "what is a contract": "A contract is a legally binding agreement between two or more parties.",
    "what is privacy": "Privacy is the right of individuals to control information about themselves and their personal lives.",
    "what is freedom of speech": "Freedom of speech is the right to express opinions without censorship or legal punishment.",
    "what is discrimination": "Discrimination is unfair treatment of a person based on characteristics like race, gender, or religion.",
    "what is intellectual property": "Intellectual property refers to creations of the mind, such as inventions, designs, and artistic works, protected by law.",

    // ── Environment ──
    "what is global warming": "Global warming is the long-term rise in Earth's average temperature, primarily caused by greenhouse gas emissions.",
    "what is carbon footprint": "A carbon footprint is the total amount of greenhouse gases produced by an individual, organisation, or product.",
    "what is recycling": "Recycling is the process of converting waste materials into new usable products to reduce environmental impact.",
    "what is deforestation": "Deforestation is the large-scale removal of forests, often for agriculture or development, harming ecosystems.",
    "what is renewable energy": "Renewable energy comes from naturally replenishing sources like the sun, wind, and water.",
    "what is solar energy": "Solar energy is power generated from sunlight using solar panels.",
    "what is wind energy": "Wind energy is electricity generated by wind turbines that convert wind into power.",
    "what is biodiversity": "Biodiversity refers to the variety of life on Earth, including all species of plants, animals, and microorganisms.",
    "what is pollution": "Pollution is the introduction of harmful substances into the environment, damaging air, water, and soil.",
    "what is sustainability": "Sustainability is meeting current needs without compromising the ability of future generations to meet theirs.",

    // ── Art & Creativity ──
    "what is art": "Art is the expression of human creativity and imagination, typically in visual, auditory, or performing forms.",
    "what is music theory": "Music theory is the study of the language and notation of music, including scales, chords, and rhythm.",
    "what is graphic design": "Graphic design is the art of creating visual content to communicate messages using typography, images, and colour.",
    "what is photography": "Photography is the art of capturing images using a camera by recording light.",
    "what is animation": "Animation is the process of creating the illusion of motion by displaying a sequence of images rapidly.",
    "what is a novel": "A novel is a long work of fictional prose narrative, usually involving complex characters and a plot.",
    "what is poetry": "Poetry is a form of literature that uses aesthetic and rhythmic language to evoke emotion and meaning.",
    "what is architecture": "Architecture is the art and science of designing and constructing buildings and other structures.",
    "what is fashion": "Fashion is the prevailing style of clothing, accessories, and culture at a given time.",
    "what is interior design": "Interior design is the art of enhancing the interior of a space to create a more functional and aesthetically pleasing environment.",

    // ── Relationships ──
    "how do i know if someone likes me": "They make consistent effort to spend time with you, remember details about you, and make you feel valued.",
    "how do i get over a breakup": "Give yourself time to grieve, stay active, lean on friends, and focus on personal growth.",
    "how do i communicate better": "Listen actively, speak clearly, be honest, avoid assumptions, and be mindful of your tone.",
    "what is a healthy relationship": "A healthy relationship is built on trust, respect, communication, and mutual support.",
    "how do i deal with loneliness": "Reach out to others, pursue hobbies, volunteer, and remember that feeling lonely is normal and temporary.",
    "how do i forgive someone": "Acknowledge your feelings, choose to let go of resentment, and focus on your own healing rather than the other person.",
    "what is trust": "Trust is the belief in the reliability, honesty, and integrity of another person.",
    "how do i set boundaries": "Be clear about your needs, communicate them calmly, and be consistent in enforcing them.",
    "what is toxic relationship": "A toxic relationship is one that causes emotional harm through patterns of disrespect, manipulation, or abuse.",
    "how do i be a better partner": "Listen, show appreciation, communicate openly, be supportive, and make time for each other.",

    // ── Food & Nutrition ──
    "what are antioxidants": "Antioxidants are compounds that protect your cells from damage caused by free radicals.",
    "what is gluten": "Gluten is a protein found in wheat, barley, and rye that can cause reactions in people with coeliac disease.",
    "what is intermittent fasting": "Intermittent fasting is an eating pattern that cycles between periods of fasting and eating.",
    "what are omega 3s": "Omega-3s are essential fatty acids found in fish and flaxseeds that support heart and brain health.",
    "what is a superfood": "A superfood is a nutrient-rich food considered especially beneficial for health, like blueberries or kale.",
    "what is meal prep": "Meal prep is preparing meals or ingredients in advance to save time and eat healthier throughout the week.",
    "how do i read a nutrition label": "Check serving size, calories, and daily percentages for fat, sodium, carbs, protein, and vitamins.",
    "what is portion control": "Portion control is managing the amount of food you eat to maintain a healthy calorie intake.",
    "what are probiotics": "Probiotics are live bacteria that benefit your gut health when consumed in food like yoghurt or supplements.",
    "what is a detox": "A detox is a short-term dietary change aimed at eliminating toxins, often involving specific foods or juices.",

    // ── Career & Work ──
    "how do i write a cv": "Include your contact info, a personal statement, work experience, education, and relevant skills.",
    "how do i prepare for an interview": "Research the company, practise common questions, dress appropriately, arrive early, and be confident.",
    "what is a cover letter": "A cover letter is a document sent with your CV explaining why you're the right person for a job.",
    "how do i ask for a promotion": "Document your achievements, timing it well, research market salary, and make a clear case to your manager.",
    "what is remote work": "Remote work is working from a location other than a traditional office, often from home.",
    "what is freelancing": "Freelancing is working independently on a contract basis for multiple clients rather than a single employer.",
    "how do i deal with a difficult boss": "Stay professional, communicate clearly, document issues, and focus on what you can control.",
    "what is work life balance": "Work-life balance is maintaining a healthy boundary between your professional and personal life.",
    "how do i negotiate salary": "Research market rates, know your worth, make a specific ask, and be ready to justify it with your achievements.",
    "what is professional development": "Professional development is ongoing learning and skill building to advance your career.",

    // ── Random But Common ──
    "what is the meaning of life": "42 — according to The Hitchhiker's Guide to the Galaxy! But most people find meaning through purpose, relationships, and growth.",
    "do you believe in god": "That's a deeply personal question I respect. Different people find different answers through faith, philosophy, and experience.",
    "what happens after death": "That's one of life's greatest mysteries. Different religions and philosophies offer different answers.",
    "what is karma": "Karma is the belief that your actions, good or bad, will determine your future experiences.",
    "what is the universe": "The universe is all of space, time, matter, and energy — everything that exists.",
    "what is consciousness": "Consciousness is the state of being aware of and able to think about your own existence and surroundings.",
    "what is reality": "Reality is the state of things as they actually exist, as opposed to how they appear or might be imagined.",
    "what is success": "Success means different things to different people — achieving goals, finding happiness, or making a positive impact.",
    "what is failure": "Failure is an unsuccessful attempt — but also one of the most powerful teachers if you learn from it.",
    "what is freedom": "Freedom is the power to act, speak, and think without restriction or external control.",
    "what is happiness": "Happiness is a state of wellbeing and contentment — it comes from within and is different for everyone.",
    "what is beauty": "Beauty is a quality that gives pleasure to the senses or the mind — and it truly is in the eye of the beholder.",
    "what is time": "Time is the progression of events from the past through the present to the future.",
    "what is power": "Power is the ability to influence or control people, events, or resources.",
    "what is wisdom": "Wisdom is the quality of having good judgement based on knowledge and experience.",
    "what is courage": "Courage is the ability to do something that frightens you — acting in spite of fear.",
    "what is loyalty": "Loyalty is a strong feeling of support or allegiance to a person, group, or cause.",
    "what is integrity": "Integrity is the quality of being honest and having strong moral principles.",
    "what is discipline": "Discipline is the ability to control your behaviour and work consistently toward your goals.",
    "what is patience": "Patience is the ability to wait calmly without frustration or complaint.",

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