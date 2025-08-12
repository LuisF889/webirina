// Vocabulary list (Russian to English)
const vocabulary = [
    // Greetings and Basics
    { russian: "Привет", english: "hello", alternatives: ["hi", "hey"] },
    { russian: "Пока", english: "bye", alternatives: ["goodbye", "see you"] },
    { russian: "Доброе утро", english: "good morning" },
    { russian: "Добрый вечер", english: "good evening" },
    { russian: "Спасибо", english: "thank you", alternatives: ["thanks"] },
    { russian: "Пожалуйста", english: "please" },
    { russian: "Извините", english: "sorry", alternatives: ["excuse me"] },
    { russian: "Да", english: "yes" },
    { russian: "Нет", english: "no" },
    
    // People and Family
    { russian: "Мама", english: "mother", alternatives: ["mom"] },
    { russian: "Папа", english: "father", alternatives: ["dad"] },
    { russian: "Сестра", english: "sister" },
    { russian: "Брат", english: "brother" },
    { russian: "Друг", english: "friend", alternatives: ["pal", "buddy"] },
    { russian: "Муж", english: "husband" },
    { russian: "Жена", english: "wife" },
    { russian: "Ребёнок", english: "child", alternatives: ["kid"] },
    
    // Common Objects
    { russian: "Дом", english: "house", alternatives: ["home"] },
    { russian: "Стул", english: "chair" },
    { russian: "Стол", english: "table" },
    { russian: "Дверь", english: "door" },
    { russian: "Окно", english: "window" },
    { russian: "Ключ", english: "key" },
    { russian: "Телефон", english: "phone", alternatives: ["mobile", "cell phone"] },
    { russian: "Часы", english: "clock", alternatives: ["watch"] },
    { russian: "Книга", english: "book" },
    { russian: "Ручка", english: "pen" },
    
    // Food and Drink
    { russian: "Вода", english: "water" },
    { russian: "Хлеб", english: "bread" },
    { russian: "Молоко", english: "milk" },
    { russian: "Кофе", english: "coffee" },
    { russian: "Чай", english: "tea" },
    { russian: "Сок", english: "juice" },
    { russian: "Яблоко", english: "apple" },
    { russian: "Суп", english: "soup" },
    
    // Animals
    { russian: "Кошка", english: "cat", alternatives: ["kitty"] },
    { russian: "Собака", english: "dog", alternatives: ["puppy"] },
    { russian: "Птица", english: "bird" },
    { russian: "Рыба", english: "fish" },
    
    // Nature
    { russian: "Солнце", english: "sun" },
    { russian: "Луна", english: "moon" },
    { russian: "Дерево", english: "tree" },
    { russian: "Цветок", english: "flower" },
    { russian: "Огонь", english: "fire" },
    { russian: "Дождь", english: "rain" },
    { russian: "Снег", english: "snow" },
    
    // Time
    { russian: "Час", english: "hour" },
    { russian: "Минута", english: "minute" },
    { russian: "Сегодня", english: "today" },
    { russian: "Завтра", english: "tomorrow" },
    { russian: "Вчера", english: "yesterday" },
    
    // Common Verbs
    { russian: "Есть", english: "to eat", alternatives: ["eat"] },
    { russian: "Пить", english: "to drink", alternatives: ["drink"] },
    { russian: "Спать", english: "to sleep", alternatives: ["sleep"] },
    { russian: "Говорить", english: "to speak", alternatives: ["speak", "talk"] }
];

// DOM elements
const russianWordEl = document.getElementById('russianWord');
const englishWordEl = document.getElementById('englishWord');
const speakBtn = document.getElementById('speakBtn');
const newWordBtn = document.getElementById('newWordBtn');
const pronounceBtn = document.getElementById('pronounceBtn');
const feedbackEl = document.getElementById('feedback');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

// Current word
let currentWord = {};

// Initialize speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 3; // Get multiple recognition alternatives

// Initialize speech synthesis
const synth = window.speechSynthesis;

// Get a random word from vocabulary
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    currentWord = vocabulary[randomIndex];
    russianWordEl.textContent = currentWord.russian;
    englishWordEl.textContent = currentWord.english;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    englishWordEl.style.color = '#666';
}

// Speak the English word
function pronounceWord() {
    if (synth.speaking) {
        synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(currentWord.english);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    synth.speak(utterance);
}

// Check if pronunciation is correct (more flexible matching)
function checkPronunciation(spokenText) {
    const expected = currentWord.english.toLowerCase();
    const spoken = spokenText.toLowerCase().trim();
    
    // Check against main translation and alternatives
    const acceptableAnswers = [expected];
    if (currentWord.alternatives) {
        acceptableAnswers.push(...currentWord.alternatives.map(a => a.toLowerCase()));
    }
    
    // Remove "to " from verb infinitives if present
    const cleanSpoken = spoken.replace(/^to\s+/i, '');
    const cleanExpected = expected.replace(/^to\s+/i, '');
    
    // Check for matches
    const isCorrect = acceptableAnswers.some(answer => {
        const cleanAnswer = answer.replace(/^to\s+/i, '');
        return cleanSpoken === cleanAnswer || 
               cleanSpoken.includes(cleanAnswer) || 
               cleanAnswer.includes(cleanSpoken);
    });
    
    if (isCorrect) {
        feedbackEl.textContent = 'Correct! Well done!';
        feedbackEl.className = 'feedback correct';
        englishWordEl.style.color = '#4caf50';
        correctSound.currentTime = 0;
        correctSound.play();
    } else {
        feedbackEl.textContent = `Incorrect. Try again. You said: "${spoken}"`;
        feedbackEl.className = 'feedback incorrect';
        englishWordEl.style.color = '#f44336';
        wrongSound.currentTime = 0;
        wrongSound.play();
    }
}

// Event listeners
speakBtn.addEventListener('click', () => {
    feedbackEl.textContent = 'Listening... Speak now';
    feedbackEl.className = 'feedback listening';
    recognition.start();
});

pronounceBtn.addEventListener('click', pronounceWord);
newWordBtn.addEventListener('click', getRandomWord);

recognition.onresult = (event) => {
    // Get the best match from recognition results
    let spokenText = event.results[0][0].transcript;
    
    // Check all alternatives if available
    if (event.results[0].length > 1) {
        for (let i = 0; i < event.results[0].length; i++) {
            const alternative = event.results[0][i].transcript.toLowerCase();
            if (alternative.includes(currentWord.english.toLowerCase())) {
                spokenText = currentWord.english;
                break;
            }
        }
    }
    
    checkPronunciation(spokenText);
};

recognition.onerror = (event) => {
    feedbackEl.textContent = 'Error occurred in recognition: ' + event.error;
    feedbackEl.className = 'feedback incorrect';
    wrongSound.currentTime = 0;
    wrongSound.play();
};

// Initialize with a random word
getRandomWord();