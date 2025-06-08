const PlayerContainer = document.getElementById('player-container');
const TwoPlayersContainer = document.getElementById('two-players-container');
const PlayerNames = document.getElementById('player-names');
const PlayerOptions = document.getElementById('player-options');
const playerNameInput = document.getElementById('player-name');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const PlayersPoints = document.getElementById('players-points');
const PlayerTurn = document.getElementById('player-turn');
const StartQuizzButton = document.getElementById('start-quizz');
const QuizzContainer = document.getElementById('quizz-container');
const HomeScreen = document.getElementById('home-screen');
const EndScreen = document.getElementById('end-screen');
const Result = document.getElementById('result');
const Winner = document.getElementById('winner');
const Question = document.getElementById('question');
const Answer1 = document.getElementById('answer1');
const Answer2 = document.getElementById('answer2');
const Answer3 = document.getElementById('answer3');
const Answer4 = document.getElementById('answer4');
const ThemeOptions = document.getElementById('theme-options');

let question = '', questions = {};
let playerName = '', player1Name = '', player2Name = '';
let pcPoint = 0, playerPoint = 0, player1Point = 0, player2Point = 0;
let playerTurn = '';
let themeChoose = '';

const DisplayTheme = () => {
    HomeScreen.style.display = 'none';
    ThemeOptions.style.display = 'block';
}

const ChooseTheme = (theme) => {
    themeChoose = 'questions.json';
    ThemeOptions.style.display = 'none';
    PlayerOptions.style.display = 'block';
}

const PreQuizz = async (nbr) => {
    PlayerOptions.style.display = 'none';
    PlayerNames.style.display = 'block';
    //* Affiche les choix 1 ou 2 joueurs */
    if (nbr === 0) {
        PlayerContainer.style.display = 'block';
    }
    if (nbr === 1) {
        TwoPlayersContainer.style.display = 'block';
    }
}

const StartQuizz = async () => {
    //* Cache les input de nom de joueur */
    PlayerNames.style.display = 'none';

    //* Affiche le bouton de démarrage du quizz */
    QuizzContainer.style.display = 'block';

    //* Prend les questions et Affiche la prochaine question */
    questions = await GetQuestions();
    NextQuestion();
}

const GetQuestions = async () => {
    const Response = await fetch(themeChoose);
    console.log(Response);
    const Questions = await Response.json().then(data => {
		return data;
	});
	return Questions;
}

const NextQuestion = async () => {
    Result.innerText = '';

	let indexQuestion = 0;
	if (questions.questions.length > 1) {
		indexQuestion = Math.floor(Math.random() * questions.questions.length);
	}else if (questions.questions.length === 1) {
        indexQuestion = 0;
    }else{
        QuizzContainer.style.display = 'none';
        EndScreen.style.display = 'block';
        //** Oui c'est long, c'est pour afficher le message de win*/
        Winner.innerText = (playerTurn === 'PC' || playerTurn === playerName) ? ((pcPoint > playerPoint) ? 'PC avec ' + pcPoint + 'Point(s)' : ((pcPoint === playerPoint) ? 'Égalité': playerName + ' avec ' + playerPoint + ' Point(s)')) : ((player1Point > player2Point) ? player1Name + ' avec ' + player1Point + ' Point(s)' : ((player1Point === player2Point) ? 'Égalité' : player2Name + ' avec ' + player2Point + ' Point(s)'));
        return;
    };

    question = questions.questions[indexQuestion];
    questions.questions.splice(indexQuestion, 1);

    Question.innerText = question.question;
    Answer1.innerText = question.answers[0].answer;
    Answer2.innerText = question.answers[1].answer;
    Answer3.innerText = question.answers[2].answer;
    Answer4.innerText = question.answers[3].answer;

    if(playerTurn === 'PC') {
        //** Désactive les bouttons */
        Answer1.disabled = true;
        Answer2.disabled = true;
        Answer3.disabled = true;
        Answer4.disabled = true;
        
        setTimeout(() => {
            let answer = Math.floor(Math.random() * question.answers.length);
            CheckAnswer(answer);
        }, 1000);
        
        //** Réactive les bouttons */
        Answer1.disabled = false;
        Answer2.disabled = false;
        Answer3.disabled = false;
        Answer4.disabled = false;
    }

}

const CheckAnswer = (answer) => {
    let isCorrect = false;

    if (question.answers[answer].isCorrect) {
        Result.innerText = 'Correct!';
        isCorrect = true;
    } else {
        Result.innerText = 'Incorrect!';
        isCorrect = false;
    }

    if (isCorrect) {
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
                break;
        }
    }
    WaitForNextQuestion();
}

const WaitForNextQuestion = () => {
    setTimeout(() => {
        if (playerTurn === playerName || playerTurn === 'PC') {
            playerTurn = (playerTurn === 'PC') ? playerName : 'PC';
            PlayersPoints.innerText = playerName + ' : ' + playerPoint + '\nPC : ' + pcPoint;
            PlayerTurn.innerText = 'Au tour de ' + playerTurn + ' !';
        } else {
            
        }
        NextQuestion();
    }, 2000);
}

const GetPlayerName = (nbr) => {
    //* Récupèration de nom selon 1 ou 2 joueurs */
    if (nbr === 0) {
        playerName = playerNameInput.value;
        PlayersPoints.innerText = playerName + ' : ' + playerPoint + '\nPC : ' + pcPoint;
        playerTurn = playerName;
        PlayerTurn.innerText = 'Au tour de ' + playerTurn + ' !';
        PlayerContainer.style.display = 'none';
    }else{
        player1Name, player2Name = player1NameInput.value, player2NameInput.value;
        PlayersPoints.innerText = player1Name + ' : ' + player1Point + '\n' + player2Name + ' : ' + player2Point;
        playerTurn = player1Name;
        PlayerTurn.innerText = 'Au tour de ' + playerTurn + ' !';
        TwoPlayersContainer.style.display = 'none';
    }

    //* Affiche le bouton de démarrage du quizz */
    StartQuizzButton.style.display = 'block';
}