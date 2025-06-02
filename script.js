const ChooseNumberOfPlayer = () => {

    const startButton =  document.getElementById('start-button');
    startButton.style.display = 'none';

    const choosePlayer = document.createElement('div');
    choosePlayer.classList.add('choose-player');
    choosePlayer.innerHTML = `
        <h2>Choisissez le nombre de joueur</h2>
        <div class="player-options">
            <button onclick="StartGame(1);" class="player-option" id="player-option1">1 Joueur</button>
            <button onclick="StartGame(2);" class="player-option" id="player-option2">2 Joueurs</button>
        </div>
    `;
    document.body.appendChild(choosePlayer);
}

const StartGame = (nbr) => {
    
    const choosePlayer = document.getElementById('start-button');
    choosePlayer.style.display = 'none';
    if (nbr === 1) {
        QuizzOnePlayer();
    }

    if (nbr === 2) {
        QuizzTwoPlayers();
    }
}

const QuizzOnePlayer = async () => {

    const quizz = document.createElement('div');
    quizz.innerHTML = `
        <h2>Quizz contre le PC</h2>
        <div class="quizz-container">
            <p class="question" id="question"></p>
            <div class="answers">
                <button class="answer" id="answer1"></button>
                <button class="answer" id="answer2"></button>
                <button class="answer" id="answer3"></button>
                <button class="answer" id="answer4"></button>
            </div>
        </div>
    `;
	
    let questions = await GetQuestions();
	
	const indexQuestion = 0
	if (questions.questions.length > 1) {
		indexQuestion = Math.random(0, questions.questions.length - 1);	
	}
    const question = questions.questions[indexQuestion];
    delete questions.questions[indexQuestion]
	
    quizz.getElementsByClassName('question')[0].innerText = question.question;
    
    quizz.getElementById('answer1').innerText = question.answers[0];
    quizz.getElementById('answer2').innerText = question.answers[1];
    quizz.getElementById('answer3').innerText = question.answers[2];
    quizz.getElementById('answer4').innerText = question.answers[3];

	document.body.appendChild(quizz);
}


const QuizzTwoPlayers = () => {


}


const GetQuestions = async () => {
    const response = await fetch('questions.json');
    const questions = await response.json().then(data => {
		return data;
	});
	return questions;
}