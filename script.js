//**! Variables globales */

//** Div */
const MainMenu = document.getElementById('main-menu');
const HomeScreen = document.getElementById('home-screen');
const ThemeOptions = document.getElementById('theme-options');
const PlayerContainer = document.getElementById('player-container');
const TwoPlayersContainer = document.getElementById('two-players-container');
const PlayerNames = document.getElementById('player-names');
const PlayerOptions = document.getElementById('player-options');
const StartQuizzButton = document.getElementById('start-quizz');
const QuizzContainer = document.getElementById('quizz-container');
const EndScreen = document.getElementById('end-screen');

//** Bouttons */
const PlayerNameInput = document.getElementById('player-name');
const Player1NameInput = document.getElementById('player1-name');
const Player2NameInput = document.getElementById('player2-name');

//** p + h */
const PlayerTurn = document.getElementById('player-turn');
const PlayersPoints = document.getElementById('players-points');
const Result = document.getElementById('result');
const Winner = document.getElementById('winner');
const Question = document.getElementById('question');
const Answer1 = document.getElementById('answer1');
const Answer2 = document.getElementById('answer2');
const Answer3 = document.getElementById('answer3');
const Answer4 = document.getElementById('answer4');
const Player2Score = document.getElementById('player2-score');
const TimerQuizz = document.getElementById('timer');

//** Audios */
const Generique = document.getElementById('generique');
const BeepGoodAnswer = document.getElementById('beep-good-answer');

//** Variables */
let titleQuizz = document.getElementById('title-quizz');
let question = '', questions = {};
let playerName = '', player1Name = '', player2Name = '';
let pcPoint = 0, playerPoint = 0, player1Point = 0, player2Point = 0;
let playerTurn = '';
let themeChoose = '';
let stopTimer = false;

//** Fonctions */
const Init = () => {
    //** Retourne à la page d'accueil */
    MainMenu.classList.remove('hidden');
    HomeScreen.classList.remove('hidden');
    ThemeOptions.classList.remove('hidden');
    PlayerOptions.classList.add('hidden');
    PlayerNames.classList.add('hidden');
    PlayerContainer.classList.add('hidden');
    TwoPlayersContainer.classList.add('hidden');
    StartQuizzButton.classList.add('hidden');
    QuizzContainer.classList.add('hidden');
    Player2Score.classList.add('hidden');
    EndScreen.classList.add('hidden');
    //** Réinitialise les variables */
    playerName = '';
    player1Name = '';
    player2Name = '';
    playerTurn = '';
    titleQuizz.innerText = '';
    pcPoint = 0;
    playerPoint = 0;
    player1Point = 0;
    player2Point = 0;
    stopTimer = false;
}

const ChooseTheme = (theme) => {
    //* Affiche le bouton de démarrage du quizz et prend le thème*/
    if (theme === 'qad') {
        themeChoose = 'qui_a_dit.json';
        titleQuizz.innerText = 'Qui a dit ?';
    } else if (theme === 'lqdmv') {
        themeChoose = 'le_quizz_de_ma_vie.json';
        titleQuizz.innerText = 'Le quizz de ma vie !';
    }
    ThemeOptions.classList.add('hidden');
    PlayerOptions.classList.remove('hidden');
}

const PreQuizz = (nbr) => {
    PlayerOptions.classList.add('hidden');
    PlayerNames.classList.remove('hidden');
    //* Affiche les choix 1 ou 2 joueurs */
    if (nbr === 0) {
        PlayerContainer.classList.remove('hidden');
    }
    if (nbr === 1) {
        TwoPlayersContainer.classList.remove('hidden');
    }
}

const StartQuizz = async() => {
    //** Affiche le bouton de démarrage du quizz */
    MainMenu.classList.add('hidden');
    PlayerContainer.classList.add('hidden');
    StartQuizzButton.classList.add('hidden');
    QuizzContainer.classList.remove('hidden');
    //** Commence le Générique */
    Generique.play();
    
    //** Prend les questions et Affiche la prochaine question */
    questions = await GetQuestions();
    NextQuestion();
}

const GetQuestions = async() => {
    //** Prend les questions dans le fichier */
    const Response = await fetch('questions/'+themeChoose);
    const Questions = await Response.json().then(data => {
        return data;
	});
	return Questions;
}

const NextQuestion = async() => {
    //** Affhiche la prochaine question */
    Result.innerText = '';
	
    let indexQuestion = 0;
	if (questions.questions.length > 1) {
        indexQuestion = Math.floor(Math.random() * questions.questions.length);
	}else if (questions.questions.length === 1) {
        indexQuestion = 0;
    } else {
        QuizzContainer.classList.add('hidden');
        EndScreen.classList.remove('hidden');
        //** Oui c'est long, c'est pour afficher le message de win*/
        Winner.innerText = 'Le gagnant est:';
        if (playerTurn === playerName || playerTurn === 'PC') {
            if (pcPoint > playerPoint) {
                Winner.innerText += ' PC avec ' + pcPoint + ' Point(s) !';
            } else if (pcPoint < playerPoint) {
                Winner.innerText += ' ' + playerName + ' avec ' + playerPoint + ' Point(s) !';
            } else {
                Winner.innerText += ' Personne, égalité avec ' + playerPoint + ' Point(s) !';
            }
        } else {
            if (player1Point > player2Point) {
                Winner.innerText += ' ' + player1Name + ' avec ' + player1Point + ' Point(s) !';
            } else if (player1Point < player2Point) {
                Winner.innerText += ' ' + player2Name + ' avec ' + player2Point + ' Point(s) !';
            } else {
                Winner.innerText += ' Personne, égalité avec ' + player1Point + ' Point(s) !';
            }
        }
        return;
    }
    question = questions.questions[indexQuestion];
    questions.questions.splice(indexQuestion, 1);
    //** Affiche la question et les réponses possibles */
    Question.innerText = question.question;
    Answer1.innerText = question.answers[0].answer;
    Answer2.innerText = question.answers[1].answer;
    Answer3.innerText = question.answers[2].answer;
    Answer4.innerText = question.answers[3].answer;
    
    if (playerTurn === 'PC') {
        //** Désactive les bouttons */
        Answer1.disabled = true;
        Answer2.disabled = true;
        Answer3.disabled = true;
        Answer4.disabled = true;
        TimerQuizz.classList.add('hidden');
        
        setTimeout(() => {
            let answer = Math.floor(Math.random() * question.answers.length);
            CheckAnswer(answer);
        }, 1000);
        await WaitForNextQuestion();
        NextQuestion();
        
    } else {
        await TimerQuestion();
        TimerQuizz.innerText = 'Temps restant: 10 secondes';
        await WaitForNextQuestion();
        NextQuestion();
    }
}

const CheckAnswer = (answer) => {
    //** Désactive les bouttons */
    Answer1.disabled = true;
    Answer2.disabled = true;
    Answer3.disabled = true;
    Answer4.disabled = true;
    
    //** Vérifie la réponse */    
    let isCorrect = false;
    
    if (question.answers[answer].isCorrect) {
        Result.innerText = 'Correct!';
        isCorrect = true;
    } else {
        Result.innerText = 'Incorrect!';
        isCorrect = false;
        for (answer in question.answers) {
            if (question.answers[answer].isCorrect) {
                Result.innerText += '\nLa bonne réponse était: ' + question.answers[answer].answer;
            }
        }
    }

    if (isCorrect) {
        //** Son de bonne réponse */
        BeepGoodAnswer.play();
        switch (playerTurn) {
            case playerName :
                playerPoint++;
                break;    
            case player1Name :
                player1Point++;
                break;
            case player2Name :
                player2Point++;
                break;
            default:
                pcPoint++;
                for (answer in question.answers) {
                    if (question.answers[answer].isCorrect) {
                        Result.innerText += '\nLa bonne réponse était: ' + question.answers[answer].answer;
                    }
                }
                break;
        }
    }
    stopTimer = true;
}

const WaitForNextQuestion = async() => {
    //** Attend 2 secondes avant de passer à la question suivante */
    return new Promise(resolve => {
        setTimeout(() => {
            if (playerTurn === playerName || playerTurn === 'PC') {
                playerTurn = (playerTurn === 'PC') ? playerName : 'PC';
                PlayersPoints.innerText = playerName + ' : ' + playerPoint + '\nPC : ' + pcPoint;
            } else {
                playerTurn = (playerTurn === player1Name) ? player2Name : player1Name;
                PlayersPoints.innerText = player1Name + ' : ' + player1Point + '\n' + player2Name + ' : ' + player2Point;
            }
        PlayerTurn.innerText = 'Au tour de ' + playerTurn + ' !';
        //** Réactive les bouttons */
        Answer1.disabled = false;
        Answer2.disabled = false;
        Answer3.disabled = false;
        Answer4.disabled = false;
        resolve();
    }, 2000);
});
}

const GetPlayerName = (nbr) => {
    //* Récupèration de nom selon 1 ou 2 joueurs */
    if (nbr === 0) {
        if(PlayerNameInput.value === '') {
            alert('Veuillez entrer un nom de joueur !');
            return;
        }
        if (/^pc$/i.test(PlayerNameInput.value.trim())) {
            alert('Le nom du joueur ne peut pas être "PC" !');
            return;
        }
        
        playerName = PlayerNameInput.value;
        PlayersPoints.innerText = playerName + ' : ' + playerPoint + '\nPC : ' + pcPoint;
        playerTurn = playerName;
        PlayerTurn.innerText = 'Au tour de ' + playerTurn + ' !';
        PlayerContainer.classList.add('hidden');
    }else{
        if(Player1NameInput.value === '' || Player2NameInput.value === '') {
            alert('Veuillez entrer un nom de joueur !');
            return;
        }
        if (/^pc$/i.test(Player1NameInput.value.trim()) || /^pc$/i.test(Player2NameInput.value.trim())) {
            alert('Le nom du joueur ne peut pas être "PC" !');
            return;
        }
        
        player1Name = Player1NameInput.value; 
        player2Name = Player2NameInput.value;
        PlayersPoints.innerText = player1Name + ' : ' + player1Point + '\n' + player2Name + ' : ' + player2Point;
        let temp = Math.floor(Math.random() * 2);
        playerTurn = (temp === 0) ? player1Name : player2Name;
        PlayerTurn.innerText = 'Au tour de ' + playerTurn + ' !';
        TwoPlayersContainer.classList.add('hidden');
    }
    
    //* Affiche le bouton de démarrage du quizz */
    PlayerNames.classList.add('hidden');
    StartQuizzButton.classList.remove('hidden');
}

const TimerQuestion = async() => {
    return new Promise(resolve => {
        stopTimer = false;
        let timerQuestion = 10;
        TimerQuizz.classList.remove('hidden');
        const Interval = setInterval(() => {
            timerQuestion--;
            TimerQuizz.innerText = 'Temps restant: ' + timerQuestion + ' secondes';
            if (timerQuestion <= 0 || stopTimer === true) {
                TimerQuizz.classList.add('hidden');
                if (timerQuestion <= 0) {
                    Result.innerText = 'Temps écoulé !';
                }
                clearInterval(Interval);
                resolve();
            }
        }, 1000);
    });
}

Init();