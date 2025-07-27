// Player and game state
const maxPlayers = 16;
const minPlayers = 2;

// Screen elements (initialized later in DOMContentLoaded)
let introScreen;
let playerSetupScreen;
let categorySelectionScreen;
let gameScreen;
let endScreen;
let creditsScreen;
let languageSelectionScreen;

// Intro Screen buttons
let introStartBtn;
let introCreditsBtn;
let introLanguageBtn;

// Player Setup Screen elements
let playersContainer;
let addPlayerBtn;
let removePlayerBtn;
let proceedToCategoriesBtn;
let backToIntroBtn;

// Lives Option Elements
let enableLivesCheckbox;
let livesSettingsDiv;
let initialLivesInput;

// Category Selection Screen elements
let naughtyCheckbox;
let naughtyWarning;
let categoryCheckboxes; // NodeList, select all
let categoryWarning;
let startGameBtn;
let backToPlayerSetupBtn;

// Game Screen elements
let currentPlayerElem;
let livesDisplayElem;
let endGameBtn;
let questionCard;
let questionText;
let questionTypeTitle;
let truthDareSelect;
let chooseTruthBtn;
let chooseDareBtn;
let btnComplete;
let btnDrink;

// End Screen elements
let finalStatsElem;
let restartBtn;
let backToMainMenuBtn;

// Credits Screen elements
let socialsBtn;
let backFromCreditsBtn;

// Language Selection Screen elements
let languageRadioButtons; // NodeList, select all
let backFromLanguageBtn;


let players = [];
let stats = {}; // { playerName: { answers: 0, drinks: 0 } }
let playerLives = {}; // { playerName: livesRemaining }
let enableLivesMode = false;
let initialLives = 3;
let currentPlayerIndex = 0;
let selectedCategories = [];
let gameMode = 'truthdare'; // 'truthdare', 'truthonly', 'dareonly'
let currentQuestion = null;
let currentQuestionType = null; // 'truth' or 'dare'
let questionsPool = {
    truth: [],
    dare: []
}; // Pool of questions for the current game based on selected categories
let playedQuestions = {
    truth: new Set(),
    dare: new Set()
}; // To keep track of questions already asked
let gameWinner = null; // New variable to store the winner


// Import QUESTIONS from questions.js (assuming this is handled by your build process or module type)
// If you are directly including this in HTML via <script type="module">, this will work.
import { QUESTIONS } from './questions.js';

// --- Translation System ---
const translations = {
    en: {
        introSubtitle: "Time to spill the tea... or take a sip.",
        playBtn: "Play",
        languageBtn: "Language",
        creditsBtn: "Credits",
        playerSetupTitle: "Who's Playing?",
        addPlayerBtn: "+ Add Player",
        removePlayerBtn: "- Remove Player",
        enableLivesMode: "Enable Lives Mode",
        startingLives: "Starting Lives:",
        selectCategoriesBtn: "Select Categories",
        chooseFlavorTitle: "Choose Your Flavor",
        categoryCouples: "Couples ❤️",
        categorySpicy: "Spicy 🔥",
        categoryEmbarrassing: "Embarrassing 😳",
        categoryFunny: "Funny 😂",
        categoryNaughty: "Naughty 😈",
        naughtyWarning: "The 'Naughty' pack requires exactly 1 Man and 1 Woman.",
        categoryWarning: "Please select at least one category!",
        startGameBtn: "Start Game",
        endGameBtn: "END",
        truthOrDareTitle: "Truth or Dare?",
        truthBtn: "Truth",
        dareBtn: "Dare",
        forfeitDrinkBtn: "Forfeit & Drink",
        iAnsweredBtn: "I Answered",
        iDidItBtn: "I Did It",
        gameOverTitle: "Game Over!",
        finalStatsTitle: "Final Stats:",
        playAgainBtn: "Play Again",
        backToMenuBtn: "Back to the menu",
        conceptLabel: "Concept:",
        conceptText: "Answer or Drink game",
        developerLabel: "Developer:",
        developerText: "Oeasen",
        socialsBtn: "Socials",
        livesDisplay: "Lives:",
        eliminatedText: "Eliminated",
        playerPlaceholder: "Player",
        selectLanguageTitle: "Select Language",
        creditsTitle: "Credits",
        noTruths: "No 'Truth' questions left. Forfeit or end the game.",
        noDares: "No 'Dare' questions left. Forfeit or end the game.",
        statAnswers: "Completed",
        statForfeits: "Forfeits",
        winnerDeclared: "wins!"
    },
    hu: {
        introSubtitle: "Ideje kitálalni... vagy inni egyet.",
        playBtn: "Játék",
        languageBtn: "Nyelv",
        creditsBtn: "Készítők",
        playerSetupTitle: "Ki Játszik?",
        addPlayerBtn: "+ Játékos",
        removePlayerBtn: "- Játékos",
        enableLivesMode: "Élet Mód",
        startingLives: "Kezdő Életek:",
        selectCategoriesBtn: "Kategóriák",
        chooseFlavorTitle: "Válassz Ízesítést",
        categoryCouples: "Pároknak ❤️",
        categorySpicy: "Pikáns 🔥",
        categoryEmbarrassing: "Kínos 😳",
        categoryFunny: "Vicces 😂",
        categoryNaughty: "Pajkos 😈",
        naughtyWarning: "A 'Pajkos' csomaghoz pontosan 1 Férfi és 1 Nő szükséges.",
        categoryWarning: "Kérlek válassz legalább egy kategóriát!",
        startGameBtn: "Játék Indítása",
        endGameBtn: "VÉGE",
        truthOrDareTitle: "Felelsz vagy Mersz?",
        truthBtn: "Felelsz",
        dareBtn: "Mersz",
        forfeitDrinkBtn: "Feladom és Iszom",
        iAnsweredBtn: "Válaszoltam",
        iDidItBtn: "Megtettem",
        gameOverTitle: "Kék Híd! (Játék Vége!)",
        finalStatsTitle: "Végső Statisztika:",
        playAgainBtn: "Újra",
        backToMenuBtn: "Vissza a menübe",
        conceptLabel: "Koncepció:",
        conceptText: "Felelj vagy Igyál játék",
        developerLabel: "Fejlesztő:",
        developerText: "Oeasen",
        socialsBtn: "Közösségi Média",
        livesDisplay: "Életek:",
        eliminatedText: "Kiesett",
        playerPlaceholder: "Játékos",
        selectLanguageTitle: "Nyelv Kiválasztása",
        creditsTitle: "Készítők",
        noTruths: "Nincs több 'Felelsz' kérdés. Add fel vagy fejezd be a játékot.",
        noDares: "Nincs több 'Mersz' kérdés. Add fel vagy fejezd be a játékot.",
        statAnswers: "Teljesítve",
        statForfeits: "Feladva",
        winnerDeclared: "nyert!"
    },
    sk: {
        introSubtitle: "Je čas priznať farbu... alebo si dať dúšok.",
        playBtn: "Hrať",
        languageBtn: "Jazyk",
        creditsBtn: "Autori",
        playerSetupTitle: "Kto Hrá?",
        addPlayerBtn: "+ Pridať Hráča",
        removePlayerBtn: "- Odstrániť Hráča",
        enableLivesMode: "Režim Životov",
        startingLives: "Počiatočné Životy:",
        selectCategoriesBtn: "Vybrať Kategórie",
        chooseFlavorTitle: "Vyberte si Príchuť",
        categoryCouples: "Páry ❤️",
        categorySpicy: "Pikantné 🔥",
        categoryEmbarrassing: "Trápne 😳",
        categoryFunny: "Zábavné 😂",
        categoryNaughty: "Nezbedné 😈",
        naughtyWarning: "Balíček 'Nezbedné' vyžaduje presne 1 muža a 1 ženu.",
        categoryWarning: "Prosím, vyberte aspoň jednu kategóriu!",
        startGameBtn: "Spustiť Hru",
        endGameBtn: "KONIEC",
        truthOrDareTitle: "Pravda alebo Odvaha?",
        truthBtn: "Pravda",
        dareBtn: "Odvaha",
        forfeitDrinkBtn: "Vzdať sa a Piť",
        iAnsweredBtn: "Odpovedal som",
        iDidItBtn: "Urobil som to",
        gameOverTitle: "Koniec Hry!",
        finalStatsTitle: "Konečné Štatistiky:",
        playAgainBtn: "Hrať Znovu",
        backToMenuBtn: "Návrat do menu",
        conceptLabel: "Koncept:",
        conceptText: "Hra Odpovedz alebo Pi",
        developerLabel: "Vývojár:",
        developerText: "Oeasen",
        socialsBtn: "Sociálne Siete",
        livesDisplay: "Životy:",
        eliminatedText: "Vypadol",
        playerPlaceholder: "Hráč",
        selectLanguageTitle: "Vybrať Jazyk",
        creditsTitle: "Autori",
        noTruths: "Žiadne 'Pravda' otázky. Vzdaj sa alebo ukonči hru.",
        noDares: "Žiadne 'Odvaha' otázky. Vzdaj sa alebo ukonči hru.",
        statAnswers: "Dokončené",
        statForfeits: "Vzdané",
        winnerDeclared: "vyhral!"
    }
};

let currentLang = 'en'; // Default language

function translateText() {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // Handle specific cases like input placeholders for player names
    document.querySelectorAll('.player-name-input').forEach(input => {
        const row = input.closest('.player-row');
        if (row) {
            const playerIndex = row.dataset.index;
            input.placeholder = `${translations[currentLang].playerPlaceholder} ${parseInt(playerIndex) + 1}`;
        }
    });
    // Update button text for game screen dynamically if no questions left
    if (questionText && (questionText.textContent === translations[currentLang].noTruths || questionText.textContent === translations[currentLang].noDares)) {
        btnDrink.textContent = translations[currentLang].endGameBtn;
    } else if (btnDrink) { // Ensure btnDrink exists before setting text
        btnDrink.textContent = translations[currentLang].forfeitDrinkBtn;
    }
}


// --- Screen Management with Animations ---
let currentScreen; // Will be set in init()

function showScreen(screenToShow) {
    if (currentScreen === screenToShow) {
        currentScreen.classList.add('active');
        currentScreen.style.display = 'flex';
        translateText();
        return;
    }

    if (currentScreen) { // Ensure currentScreen is not null
        currentScreen.classList.add('transition-out');
        currentScreen.classList.remove('active');
        currentScreen.style.display = 'flex'; // Keep flex during transition
    }

    setTimeout(() => {
        if (currentScreen) {
            currentScreen.style.display = 'none';
            currentScreen.classList.remove('transition-out');
        }

        screenToShow.classList.add('active');
        screenToShow.style.display = 'flex';
        currentScreen = screenToShow;
        translateText();
    }, 300);
}


// --- Player Setup Screen Functions ---
function createPlayerRow(playerData, index) {
    const row = document.createElement('div');
    row.classList.add('player-row');
    row.dataset.index = index;

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = `${translations[currentLang].playerPlaceholder} ${index + 1}`;
    nameInput.classList.add('player-name-input');
    nameInput.value = playerData.name || '';
    nameInput.setAttribute('minlength', '1');
    nameInput.setAttribute('maxlength', '20');

    nameInput.addEventListener('input', validatePlayerSetup);
    nameInput.addEventListener('change', updatePlayersDataFromInputs);

    const genderSelect = document.createElement('div');
    genderSelect.classList.add('gender-select');

    const maleLabel = document.createElement('label');
    maleLabel.innerHTML = `<input type="radio" name="gender-${index}" value="man" ${playerData.gender === 'man' ? 'checked' : ''}><span class="gender-label">♂</span>`;
    maleLabel.querySelector('input').addEventListener('change', () => { updatePlayersDataFromInputs(); validatePlayerSetup(); updateNaughtyCheckboxState(); });

    const femaleLabel = document.createElement('label');
    femaleLabel.innerHTML = `<input type="radio" name="gender-${index}" value="woman" ${playerData.gender === 'woman' ? 'checked' : ''}><span class="gender-label">♀</span>`;
    femaleLabel.querySelector('input').addEventListener('change', () => { updatePlayersDataFromInputs(); validatePlayerSetup(); updateNaughtyCheckboxState(); });

    const otherLabel = document.createElement('label');
    otherLabel.innerHTML = `<input type="radio" name="gender-${index}" value="other" ${playerData.gender === 'other' ? 'checked' : ''}><span class="gender-label">?</span>`;
    otherLabel.querySelector('input').addEventListener('change', () => { updatePlayersDataFromInputs(); validatePlayerSetup(); updateNaughtyCheckboxState(); });


    genderSelect.appendChild(maleLabel);
    genderSelect.appendChild(femaleLabel);
    genderSelect.appendChild(otherLabel);

    row.appendChild(nameInput);
    row.appendChild(genderSelect);

    return row;
}

function renderPlayers() {
    playersContainer.innerHTML = '';
    players.forEach((p, i) => {
        const row = createPlayerRow(p, i);
        playersContainer.appendChild(row);
    });
    updateNaughtyCheckboxState();
    validatePlayerSetup();
    translateText();
}

function updateNaughtyCheckboxState() {
    let menCount = 0;
    let womenCount = 0;
    players.forEach(p => {
        if (p.gender === 'man') {
            menCount++;
        } else if (p.gender === 'woman') {
            womenCount++;
        }
    });

    if (players.length === 2 && menCount === 1 && womenCount === 1) {
        naughtyCheckbox.disabled = false;
        naughtyWarning.classList.remove('active');
    } else {
        naughtyCheckbox.checked = false;
        naughtyCheckbox.disabled = true;
        if (players.length > 0) {
             naughtyWarning.classList.add('active');
        } else {
             naughtyWarning.classList.remove('active');
        }
    }
    validateCategorySelection();
}

function updatePlayersDataFromInputs() {
    const rows = playersContainer.querySelectorAll('.player-row');
    players = [];
    rows.forEach(row => {
        const nameInput = row.querySelector('.player-name-input');
        const genderRadio = row.querySelector('input[type="radio"]:checked');
        players.push({
            name: nameInput.value.trim(),
            gender: genderRadio ? genderRadio.value : ''
        });
    });
}

function validatePlayerSetup() {
    updatePlayersDataFromInputs();
    let allValid = true;

    if (players.length < minPlayers || players.length > maxPlayers) {
        allValid = false;
    }

    for (const p of players) {
        if (!p.name || p.name.length < 1 || !p.gender) {
            allValid = false;
            break;
        }
    }
    proceedToCategoriesBtn.disabled = !allValid;
    updateNaughtyCheckboxState();
}

function addPlayer() {
    if (players.length < maxPlayers) {
        players.push({ name: '', gender: '' });
        renderPlayers();
    }
}


// --- Game Initialization & Flow ---
function initializeGame() {
    stats = {};
    playerLives = {};
    currentPlayerIndex = 0;
    questionsPool = { truth: [], dare: [] };
    playedQuestions = { truth: new Set(), dare: new Set() };
    gameWinner = null;

    players.forEach(p => {
        stats[p.name] = { answers: 0, drinks: 0 };
        playerLives[p.name] = enableLivesMode ? initialLives : -1; // -1 means infinite lives
    });

    populateQuestionsPool();
    updateGameDisplay();
    nextQuestion();
}

function populateQuestionsPool() {
    questionsPool = { truth: [], dare: [] };
    selectedCategories.forEach(categoryKey => {
        const categoryQuestions = QUESTIONS[categoryKey];
        if (categoryQuestions) {
            if (categoryQuestions.truth) {
                questionsPool.truth = questionsPool.truth.concat(categoryQuestions.truth);
            }
            if (categoryQuestions.dare) {
                questionsPool.dare = questionsPool.dare.concat(categoryQuestions.dare);
            }
        }
    });

    questionsPool.truth = questionsPool.truth.filter(q => !playedQuestions.truth.has(q));
    questionsPool.dare = questionsPool.dare.filter(q => !playedQuestions.dare.has(q));

    questionsPool.truth.sort(() => Math.random() - 0.5);
    questionsPool.dare.sort(() => Math.random() - 0.5);
}

function getNextPlayer() {
    let activePlayers = players.filter(p => !enableLivesMode || playerLives[p.name] > 0);
    
    if (enableLivesMode && activePlayers.length === 1) {
        declareWinner(activePlayers[0]);
        return null;
    }

    if (activePlayers.length === 0) {
        return null;
    }

    let nextIdx = currentPlayerIndex;
    let attempts = 0;
    do {
        nextIdx = (nextIdx + 1) % players.length;
        attempts++;
        if (attempts > players.length * 2) {
            console.warn("Could not find next active player, ending game.");
            return null;
        }
    } while (enableLivesMode && playerLives[players[nextIdx].name] <= 0);

    currentPlayerIndex = nextIdx;
    return players[currentPlayerIndex];
}

function nextPlayerTurnSetup() {
    const nextPlayerObj = getNextPlayer();
    if (!nextPlayerObj) {
        // If getNextPlayer returned null, it means game is over (winner declared or no active players)
        endGame();
        return;
    }
    currentPlayerElem.textContent = nextPlayerObj.name;
    updateLivesDisplay();

    questionCard.classList.remove('active');
    truthDareSelect.classList.remove('hidden');
    btnComplete.classList.add('hidden');
    btnDrink.textContent = translations[currentLang].forfeitDrinkBtn;
    questionTypeTitle.textContent = translations[currentLang].truthOrDareTitle;
    questionText.textContent = '';
}

function nextQuestion() {
    const currentPlayer = players[currentPlayerIndex];
    if (enableLivesMode && currentPlayer && playerLives[currentPlayer.name] <= 0) {
        nextPlayerTurnSetup();
        return;
    }
    nextPlayerTurnSetup();
}


function showQuestion(text, type) {
    currentQuestion = text;
    currentQuestionType = type;

    if (!text) {
        questionTypeTitle.textContent = '';
        questionText.textContent = type === 'truth' ? translations[currentLang].noTruths : translations[currentLang].noDares;
        btnComplete.classList.add('hidden');
        btnDrink.textContent = translations[currentLang].endGameBtn;
        return;
    }

    questionTypeTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    questionText.textContent = text;
    questionCard.classList.add('active');
    truthDareSelect.classList.add('hidden');
    btnComplete.classList.remove('hidden');
    btnDrink.textContent = translations[currentLang].forfeitDrinkBtn;
}

// --- Game Actions ---
function handleTruthDareChoice(type) {
    populateQuestionsPool();

    let question;
    if (type === 'truth') {
        question = pickRandom(questionsPool.truth);
        if (question) {
            playedQuestions.truth.add(question);
        }
    } else { // type === 'dare'
        question = pickRandom(questionsPool.dare);
        if (question) {
            playedQuestions.dare.add(question);
        }
    }
    showQuestion(question, type);
}

function handleComplete() {
    const currentPlayer = players[currentPlayerIndex];
    if (currentQuestion && currentQuestionType) {
        stats[currentPlayer.name].answers++;
    }
    nextQuestion();
}

function handleForfeitDrink() {
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) { // Prevent error if current player is undefined for some reason
        endGame();
        return;
    }

    stats[currentPlayer.name].drinks++;
    if (enableLivesMode) {
        playerLives[currentPlayer.name]--;
    }

    if (questionText && (questionText.textContent === translations[currentLang].noTruths || questionText.textContent === translations[currentLang].noDares)) {
        endGame();
    } else {
        nextQuestion();
    }
}

function declareWinner(winner) {
    gameWinner = winner;
    // Don't call endGame() here, getNextPlayer() will return null, and nextPlayerTurnSetup() will call endGame()
}

function endGame() {
    showScreen(endScreen);
    renderFinalStats();
}

function updateGameDisplay() {
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer) {
        currentPlayerElem.textContent = currentPlayer.name;
    } else {
        currentPlayerElem.textContent = '';
    }
    updateLivesDisplay();
}

function updateLivesDisplay() {
    const currentPlayer = players[currentPlayerIndex];
    if (enableLivesMode && currentPlayer) {
        livesDisplayElem.classList.remove('hidden');
        livesDisplayElem.textContent = `${translations[currentLang].livesDisplay} ${playerLives[currentPlayer.name]}`;
        if (playerLives[currentPlayer.name] > 0 && playerLives[currentPlayer.name] <= Math.ceil(initialLives / 3)) {
            livesDisplayElem.classList.add('low-lives');
        } else {
            livesDisplayElem.classList.remove('low-lives');
        }
    } else {
        livesDisplayElem.classList.add('hidden');
    }
}

function getSelectedCategories() {
    // Ensure categoryCheckboxes is defined before using it
    if (!categoryCheckboxes) return [];
    return Array.from(categoryCheckboxes)
        .filter(chk => chk.checked)
        .map(chk => chk.value);
}

function pickRandom(arr) {
    if (!arr || arr.length === 0) return null;
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
}

function renderFinalStats() {
    finalStatsElem.innerHTML = ''; // Clear previous stats

    if (gameWinner) {
        const winnerMessage = document.createElement('h2');
        winnerMessage.classList.add('winner-message');
        winnerMessage.textContent = `${gameWinner.name} ${translations[currentLang].winnerDeclared}`;
        finalStatsElem.appendChild(winnerMessage);
        // Removed game-over-winner class from finalStatsElem, apply directly to message if needed
    } else {
        const gameOverTitle = document.createElement('h2');
        gameOverTitle.classList.add('game-over-title');
        gameOverTitle.textContent = translations[currentLang].gameOverTitle;
        finalStatsElem.appendChild(gameOverTitle);
    }

    const statsTitle = document.createElement('h3');
    statsTitle.classList.add('stats-title');
    statsTitle.textContent = translations[currentLang].finalStatsTitle;
    finalStatsElem.appendChild(statsTitle);

    const sortedPlayers = [...players].sort((a, b) => {
        const aStats = stats[a.name];
        const bStats = stats[b.name];

        const aEliminated = enableLivesMode && playerLives[a.name] !== -1 && playerLives[a.name] <= 0;
        const bEliminated = enableLivesMode && playerLives[b.name] !== -1 && playerLives[b.name] <= 0;

        // Winners first
        if (gameWinner && a.name === gameWinner.name) return -1;
        if (gameWinner && b.name === gameWinner.name) return 1;

        // Eliminated players last
        if (aEliminated && !bEliminated) return 1;
        if (!aEliminated && bEliminated) return -1;

        // Players with more answers rank higher
        if (aStats.answers !== bStats.answers) {
            return bStats.answers - aStats.answers;
        }
        // Then by fewer drinks
        return aStats.drinks - bStats.drinks;
    });

    sortedPlayers.forEach(player => {
        const playerName = player.name;
        const pStats = stats[playerName];
        const isEliminated = enableLivesMode && playerLives[playerName] !== -1 && playerLives[playerName] <= 0;
        const isWinner = gameWinner && gameWinner.name === playerName;

        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player-score-item');

        let statusText = '';
        let icon = '👥'; // Default icon
        if (isWinner) {
            playerDiv.classList.add('winner-score');
            statusText = ` (${translations[currentLang].winnerDeclared})`;
            icon = '👑';
        } else if (isEliminated) {
            playerDiv.classList.add('eliminated-score');
            statusText = ` (${translations[currentLang].eliminatedText})`;
            icon = '💀';
        }
        
        playerDiv.innerHTML = `
            <div class="score-icon">${icon}</div>
            <div class="player-name">${playerName}${statusText}</div>
            <div class="score-stats">
                <span class="stat-answers">${translations[currentLang].statAnswers}: <strong>${pStats.answers}</strong></span>
                <span class="stat-forfeits">${translations[currentLang].statForfeits}: <strong>${pStats.drinks}</strong></span>
            </div>
        `;
        finalStatsElem.appendChild(playerDiv);
    });
}


function validateCategorySelection() {
    selectedCategories = getSelectedCategories();
    if (selectedCategories.length > 0) {
        startGameBtn.disabled = false;
        categoryWarning.classList.remove('active');
    } else {
        startGameBtn.disabled = true;
        categoryWarning.classList.add('active');
    }

    const hasTruth = selectedCategories.some(cat => QUESTIONS[cat] && QUESTIONS[cat].truth && QUESTIONS[cat].truth.length > 0);
    const hasDare = selectedCategories.some(cat => QUESTIONS[cat] && QUESTIONS[cat].dare && QUESTIONS[cat].dare.length > 0);

    if (hasTruth && hasDare) {
        gameMode = 'truthdare';
        chooseTruthBtn.classList.remove('hidden');
        chooseDareBtn.classList.remove('hidden');
    } else if (hasTruth) {
        gameMode = 'truthonly';
        chooseTruthBtn.classList.remove('hidden');
        chooseDareBtn.classList.add('hidden');
    } else if (hasDare) {
        gameMode = 'dareonly';
        chooseTruthBtn.classList.add('hidden');
        chooseDareBtn.classList.remove('hidden');
    } else {
        gameMode = 'none';
        chooseTruthBtn.classList.add('hidden');
        chooseDareBtn.classList.add('hidden');
    }
}

// --- Game Reset Function ---
function resetGame() {
    players = [];
    addPlayer();
    addPlayer();

    stats = {};
    playerLives = {};
    currentPlayerIndex = 0;
    selectedCategories = [];
    gameMode = 'truthdare';
    currentQuestion = null;
    currentQuestionType = null;
    questionsPool = {
        truth: [],
        dare: []
    };
    playedQuestions = {
        truth: new Set(),
        dare: new Set()
    };
    gameWinner = null;

    enableLivesCheckbox.checked = false;
    livesSettingsDiv.classList.add('hidden');
    initialLivesInput.value = 3;
    initialLives = 3;

    categoryCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    naughtyCheckbox.checked = false;
    naughtyCheckbox.disabled = true;
    naughtyWarning.classList.remove('active');
    categoryWarning.classList.remove('active');
    startGameBtn.disabled = true;
    renderPlayers();

    questionCard.classList.remove('active');
    truthDareSelect.classList.remove('hidden');
    btnComplete.classList.add('hidden');
    btnDrink.textContent = translations[currentLang].forfeitDrinkBtn;
    questionTypeTitle.textContent = translations[currentLang].truthOrDareTitle;
    questionText.textContent = '';
    livesDisplayElem.classList.add('hidden');
}


// --- Initialization Function ---
function init() {
    // Assign DOM elements to variables AFTER the DOM is loaded
    introScreen = document.getElementById('intro-screen');
    playerSetupScreen = document.getElementById('player-setup-screen');
    categorySelectionScreen = document.getElementById('category-selection-screen');
    gameScreen = document.getElementById('game-screen');
    endScreen = document.getElementById('end-screen');
    creditsScreen = document.getElementById('credits-screen');
    languageSelectionScreen = document.getElementById('language-selection-screen');

    introStartBtn = document.getElementById('intro-start-btn');
    introCreditsBtn = document.getElementById('intro-credits-btn');
    introLanguageBtn = document.getElementById('intro-language-btn');

    playersContainer = document.getElementById('players-list');
    addPlayerBtn = document.getElementById('add-player-btn');
    removePlayerBtn = document.getElementById('remove-player-btn');
    proceedToCategoriesBtn = document.getElementById('proceed-to-categories-btn');
    backToIntroBtn = document.getElementById('back-to-intro-btn');

    enableLivesCheckbox = document.getElementById('enable-lives-checkbox');
    livesSettingsDiv = document.getElementById('lives-settings');
    initialLivesInput = document.getElementById('initial-lives-input');

    naughtyCheckbox = document.getElementById('naughty-checkbox');
    naughtyWarning = document.getElementById('naughty-warning');
    categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    categoryWarning = document.getElementById('category-warning');
    startGameBtn = document.getElementById('start-game-btn');
    backToPlayerSetupBtn = document.getElementById('back-to-player-setup-btn');

    currentPlayerElem = document.getElementById('current-player');
    livesDisplayElem = document.getElementById('lives-display');
    endGameBtn = document.getElementById('end-game-btn');
    questionCard = document.getElementById('question-card');
    questionText = document.getElementById('question-text');
    questionTypeTitle = document.getElementById('question-type-title');
    truthDareSelect = document.getElementById('truth-dare-select');
    chooseTruthBtn = document.getElementById('choose-truth-btn');
    chooseDareBtn = document.getElementById('choose-dare-btn');
    btnComplete = document.getElementById('btn-complete');
    btnDrink = document.getElementById('btn-drink');

    finalStatsElem = document.getElementById('final-stats');
    restartBtn = document.getElementById('restart-btn');
    backToMainMenuBtn = document.getElementById('back-to-main-menu-btn');

    socialsBtn = document.getElementById('socials-btn');
    backFromCreditsBtn = document.getElementById('back-from-credits-btn');

    languageRadioButtons = document.querySelectorAll('input[name="language-select"]');
    backFromLanguageBtn = document.getElementById('back-from-language-btn');

    // --- Event Listeners ---
    // Intro Screen buttons
    introStartBtn.addEventListener('click', () => showScreen(playerSetupScreen));
    introCreditsBtn.addEventListener('click', () => showScreen(creditsScreen));
    introLanguageBtn.addEventListener('click', () => showScreen(languageSelectionScreen));

    // Player Setup Screen
    addPlayerBtn.addEventListener('click', addPlayer);

    removePlayerBtn.addEventListener('click', () => {
        if (players.length > minPlayers) {
            const lastPlayerRow = playersContainer.lastElementChild;
            if (lastPlayerRow) {
                lastPlayerRow.classList.add('removing');
                lastPlayerRow.addEventListener('animationend', () => {
                    players.pop();
                    lastPlayerRow.remove();
                    validatePlayerSetup();
                }, { once: true });
            }
        }
    });

    // Lives Mode Toggling
    enableLivesCheckbox.addEventListener('change', () => {
        enableLivesMode = enableLivesCheckbox.checked;
        if (enableLivesMode) {
            livesSettingsDiv.classList.remove('hidden');
        } else {
            livesSettingsDiv.classList.add('hidden');
        }
        validatePlayerSetup();
    });

    initialLivesInput.addEventListener('input', () => {
        let value = parseInt(initialLivesInput.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 10) {
            value = 10;
        }
        initialLivesInput.value = value;
        initialLives = value;
    });

    proceedToCategoriesBtn.addEventListener('click', () => {
        showScreen(categorySelectionScreen);
        validateCategorySelection();
    });

    // **FIX:** Added the missing event listener for the back button.
    backToIntroBtn.addEventListener('click', () => showScreen(introScreen));

    // Category Selection Screen
    backToPlayerSetupBtn.addEventListener('click', () => showScreen(playerSetupScreen));

    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            validateCategorySelection();
            if (checkbox.id === 'naughty-checkbox') {
                updateNaughtyCheckboxState();
            }
        });
    });

    naughtyCheckbox.addEventListener('change', () => {
        validateCategorySelection();
    });

    startGameBtn.addEventListener('click', () => {
        initializeGame();
        showScreen(gameScreen);
    });

    // Game Screen
    endGameBtn.addEventListener('click', () => endGame());
    chooseTruthBtn.addEventListener('click', () => handleTruthDareChoice('truth'));
    chooseDareBtn.addEventListener('click', () => handleTruthDareChoice('dare'));
    btnComplete.addEventListener('click', () => handleComplete());
    btnDrink.addEventListener('click', () => handleForfeitDrink());

    // End Screen
    restartBtn.addEventListener('click', () => {
        resetGame(); // Reset all game state
        showScreen(playerSetupScreen); // Go to player setup screen
        translateText(); // Translate texts to current language
    });
    backToMainMenuBtn.addEventListener('click', () => {
        resetGame(); // Reset all game state
        showScreen(introScreen); // Go to the intro screen
        translateText(); // Translate texts to current language
    });

    // Credits Screen
    backFromCreditsBtn.addEventListener('click', () => showScreen(introScreen));
    socialsBtn.addEventListener('click', () => window.open('https://github.com/Oeasen', '_blank'));

    // Language Selection Screen
    backFromLanguageBtn.addEventListener('click', () => showScreen(introScreen));
    languageRadioButtons.forEach(radio => {
        radio.addEventListener('change', (event) => {
            currentLang = event.target.value;
            translateText();
            renderPlayers();
            updateNaughtyCheckboxState();
        });
    });

    // Initial setup calls
    currentScreen = introScreen; // Set initial screen
    showScreen(introScreen); // Show intro screen initially
    addPlayer(); // Add initial players
    addPlayer();
    translateText();
    document.querySelector(`input[name="language-select"][value="${currentLang}"]`).checked = true;
    validatePlayerSetup();
}

// Ensure the init function runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);