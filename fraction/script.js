let equations;
let equation;


let maxPoints = 0;
let eqAmount = 0;
let curPoints = 0;
let mistakes = 0;
let actionsSigns = [];

let timeAfterFinish = 3000;


let main = document.querySelector('.main');
let actionHolders = document.querySelectorAll('.actionSign');
let equationText = document.querySelector('.equation_text');
let answerText = document.querySelector('.answer_text');
let equationArea = document.querySelector('.equation_area');
let mistakesHeader = document.querySelector('.mistakes_header');
let sign = document.querySelector('.sign');
let range = document.querySelector('.range');
let rangeValue = document.querySelector('.range_value');
let resultsElem = document.querySelector('.results');
let resultsContent = document.querySelector('.results_content')
let darkBg = document.querySelector('.darkBg')
let correctAnswerContainer = document.querySelector('#correct_answer_wrapper')
let explanationsWrapper = document.querySelector('#explanations_wrapper')
let fullEquationContainer = document.querySelector('#full_equation');
let explanationsContainer = document.querySelector('#explanations_container')
let toTopWrapper = document.querySelector('#to_top_wrapper')
let toTopButton = document.querySelector('#to_top_container')

let results_p1, results_p2, results_holder, results_eqAmount;
let resultsLine, acceptButton;

let trainingInProgress = false;
let lastEquation = false;

let timeStart, trainingDuration;

sign.addEventListener('click', function(e) {
	checkInputs();
});

document.addEventListener('keydown', function(e) {
	if (e.key == 'Enter' && !lastEquation) {
		checkInputs();
	}
});

toTopButton.addEventListener('click', ev => {
	window.scrollTo({
		top: 0,
	    behavior: "smooth"
	});
	answerText.focus();
	setTimeout(() => {
		toTopWrapper.classList.add('hiden');
		explanationsWrapper.classList.add('hiden');
		if (lastEquation) {
			toTopButton.innerHTML = '🠕';
			hideElementsAndShowResult();
			lastEquation = false;
		}
		setTimeout(() => {
			explanationsWrapper.style.display = 'none';
		}, 1000)
	}, 500)
})

range.oninput = function() {
	updateRangeValue();
}

activateActions();
updateRangeValue();

// trainingInProgress = true;
// start();
// doEquation();




function checkInputs() {
	if (!trainingInProgress){
		trainingInProgress = true;
		start();
		doEquation();
	} else if (sign.classList.contains('submit')) {
		checkAnswer();
	} else if (resultsElem.classList.contains("full")) {
		closeResults();
	} else if (sign.classList.contains('reload')) {
		resetData();	
	}
}

function start() {
	toggleEquationArea();
	toggleAnswerTextVisibility();

	changeSignTo('submit');

	timeStart = new Date();

	toggleButtons();
	actionsSigns = getActionSigns();
	equations = createEquationsList(range.value, actionsSigns);
	maxPoints = equations.length;
	eqAmount = equations.length;

	answerText.focus();

	window.scrollTo({
	    results: 80,
	    behavior: "smooth"
	});
}

function resetData() {
	toggleButtons();
	changeSignTo('start');
	equationText.innerHTML = '';
	mistakesHeader.innerHTML = '<div class="mistake_cross"></div>';	
	curPoints = 0;
	trainingInProgress = false;
	mistakesHeader.classList.remove('no_mistakes');
}

function doEquation() {
	answerText.value = '';
	equation = equations.pop();
	let equationString = equation.partial;
	changeEquationText(equationString);
} 

function checkAnswer() {
	let mistake = false;
	let answerString = answerText.value;
	if (!answerString) {
		return;
	} else if (answerString == equation.answer) {
		eqAmount--;
		curPoints++;
		deactivateMistakesHeader();
		showCheckmark();
	} else {
		mistake = true;
		mistakes++;
		updateMistakesHeader();
		showAnswerAndExplanations();
		equationArea.classList.toggle('equation_area-mistake');
		setTimeout(function() {
			equationArea.classList.toggle('equation_area-mistake');
		}, 250);
		eqAmount--;
	}

	rangeValue.innerHTML = eqAmount;

	answerText.focus();

	if (equations.length > 0) {
		doEquation();
	} else {
		if (!mistake) {
			hideElementsAndShowResult();
		} else {
			lastEquation = true;
		}
	}
	
}

function hideElementsAndShowResult() {
	updateRangeValue();

	toggleEquationArea();

	openResults();

	trainingDuration = Math.round(
		(new Date().getTime() - timeStart.getTime()) / 1000);

	equationText.innerHTML = '';

	deactivateMistakesHeader();

	let main = document.querySelector('.main');

	equationText.innerHTML = curPoints + ' / ' + maxPoints;

	checkNoMistakes();

	window.scrollTo({
	    results: 0,
	    behavior: "smooth"
	});

	changeSignTo('hiden');
	toggleAnswerTextVisibility('none');
	setTimeout(function() {
		changeSignTo('reload');
	}, timeAfterFinish);
}

// functions

function showAnswerAndExplanations () {
	let equationDiv= document.createElement('div');
	equationDiv.id = 'equation_with_answer';
	equationDiv.innerHTML = equation.full;
	fullEquationContainer.innerHTML = '';
	fullEquationContainer.appendChild(equationDiv);
	explanationsContainer.innerHTML = equation.explanations;
	explanationsWrapper.style.display = 'block';
	explanationsWrapper.classList.remove('hiden');
	toTopWrapper.classList.remove('hiden');
	if (equations.length == 0) {
		toTopButton.innerHTML = '✓';
	}
	setTimeout(() => {
		explanationsWrapper.scrollIntoView({behavior: "smooth"});
		setTimeout(() => {
			toTopButton.focus();
		}, 500)
	}, 500)
}

function showCheckmark () {
	correctAnswerContainer.classList.toggle('hiden');
	setTimeout(() => {
		correctAnswerContainer.classList.toggle('hiden');
	}, 1500)
}

function updateRangeValue () {
	rangeValue.innerHTML = range.value;
}

function openResults () {

	resultsContent.classList.add("hiden");
	setTimeout(() => {
		resultsElem.classList.add("full");
		darkBg.classList.add('active');

		setTimeout(() => {
			resultsContent.classList.remove("hiden");
			let result = createResult();
			result.forEach(elem => resultsContent.appendChild(elem));
			activateAcceptButton();
			setTimeout(() => {
				resultsLine.style.width = (curPoints / maxPoints * 100) + '%';
			}, 500)
		}, 500)
	}, 500)

	function createResult () {
		let elemArr = [];
		elemArr.push(createSection1());
		elemArr.push(createSection2());
		elemArr.push(createAcceptSign());
		return elemArr;
	}

	function createSection1 (arguments) {
		let sect = document.createElement('section');

		let header = document.createElement('h2');
		header.innerHTML = 'Результат';

		let mark = document.createElement('h3');
		mark.innerHTML = 'Оцінка: ' + Math.round(curPoints / maxPoints * 12);

		let rangeResult = document.createElement('div');
		rangeResult.classList.add('range_result');

		let range_line = document.createElement('div');
		range_line.classList.add('range_line');
		resultsLine = range_line;
		rangeResult.appendChild(range_line);

		let percent = document.createElement('h3');
		percent.classList.add('percent');
		percent.innerHTML = Math.round(curPoints / maxPoints * 10000) / 100  + '%';

		sect.appendChild(header);
		sect.appendChild(mark);
		sect.appendChild(rangeResult);
		sect.appendChild(percent);

		return sect;
	}

	function createSection2 () {
		let sect = document.createElement('section');

		let header = document.createElement('h2');
		header.innerHTML = 'Статистика';

		let table = createTable();

		sect.appendChild(header);
		sect.appendChild(table);

		return sect;
	}

	function createTable () {
		let table = document.createElement('table');
		table.classList.add('stats');

		let tableData = [
			[
				'Всього прикладів:',
				maxPoints
			],
			[
				'Правильних відповідей:',
				curPoints
			],
			[
				'Час виконання:',
				getDuration()
			],
			[
				'Середній час виконання одного виразу:',
				getDuration('average'),
				lastTd = true
			]
		];

		for (let data of tableData) {
			table.appendChild(createTableRow(...data));
		}

		return table;
	}

	function createTableRow (td1, td2, lastTd = false) {
		let row = document.createElement('tr')
		
		let td1Elem = document.createElement('td');
		td1Elem.innerHTML = td1;

		let td2Elem = document.createElement('td');
		td2Elem.innerHTML = td2;

		if(lastTd) {
			td1Elem.classList.add('lastTd');
			td2Elem.classList.add('lastTd');
		}

		row.appendChild(td1Elem);
		row.appendChild(td2Elem);

		return row;
	}

	function createAcceptSign () {
		let button = document.createElement('div');
		button.innerHTML = '✓';
		button.classList.add('acceptButton');
		acceptButton = button;

		let buttonHolder = document.createElement('div');
		buttonHolder.classList.add('buttonHolder');

		buttonHolder.appendChild(button);

		return buttonHolder;
	}

	function activateAcceptButton () {
		acceptButton.addEventListener('click', function () {
			closeResults();
		});
	}
}

function closeResults () {
	darkBg.classList.toggle('active');
	resultsElem.classList.add('hiden');
	setTimeout(() => {
		resultsContent.innerHTML = '';
		resultsElem.classList.remove('hiden');
		resultsElem.classList.remove('full');
	}, 1000)
}

function getDuration (option) {
	let sec = trainingDuration;

	sec = option == 'average' ? 
		Math.round((sec / maxPoints) * 100) / 100 : sec;

	let mins = Math.floor(sec / 60);
	let secs = sec - mins * 60;

	mins = mins ? mins + 'хв ' : '';
	secs = secs != 0 ? secs + 'с' : '';

	return mins + secs;
}

answerText.addEventListener('keyup', function(e) {
	if (answerText.value.length > 2) {
		answerText.value = answerText.value.substr(0, 2);
	}
});

function deactivateMistakesHeader() {
	let mistakeDivs = document.querySelectorAll('.mistakes_area div:not(.failed, .solved)');
	if (mistakeDivs.length == 0) {
		mistakesHeader.classList.remove('active');
	}
}

function checkNoMistakes() {
	if (curPoints == maxPoints) {
		mistakesHeader.classList.toggle('no_mistakes');
	}
}

function toggleAnswerTextVisibility(mode) {
	answerText.classList.toggle('hiden');
	if (mode == 'none') {
		setTimeout(() => {
			answerText.classList.toggle('none');
			setTimeout(() => {
				answerText.classList.toggle('none');
			}, 500)
		}, 500)
	}
}

function changeEquationText(str) {
	equationText.classList.add('hiden');
	setTimeout(function() {
		equationText.innerHTML = str;
		equationText.classList.remove('hiden');
	}, 250);
}

function updateMistakesHeader () {
	if (mistakes == 1) {
		mistakesHeader.classList.add('active');
	} else {
		mistakesHeader.classList.add('active');
		mistakesHeader.innerHTML += '<div class="mistake_cross"></div>';
	}
}

function changeSignTo(type) {
	switch (type) {
		case 'start':
			sign.setAttribute('class', 'sign');
			sign.classList.add(type);
			sign.innerHTML = '<div id="sign_start"></div>';
			break;
		case 'submit':
			sign.setAttribute('class', 'sign');
			sign.classList.add(type);
			sign.innerHTML = '⇨';
			break;
		case 'hiden':
			sign.setAttribute('class', 'sign');
			sign.classList.add(type);
			sign.innerHTML = '';
			break;
		case 'reload':
			sign.setAttribute('class', 'sign');
			sign.classList.add('reload');
			sign.innerHTML = '↻';
			break;
	}
}

function toggleEquationArea() {
	equationArea.classList.toggle('equation_area-active');
}

function activateActions() {
	for (let elem of actionHolders) {
		elem.addEventListener('click', function(e) {
			lastActiveAction = this;
			this.classList.toggle('active');
			let isLastPlus = true;
			if (this.id == 'plus_sign') {
				isLastPlus = false;
			}
			let activeActions = document.querySelectorAll('.actionSign.active');
			if (activeActions.length == 0) {
				if (isLastPlus) {
					let plusAction = document.querySelector('#plus_sign')
					plusAction.classList.add('active');
				} else {
					let minusAction = document.querySelector('#minus_sign')
					minusAction.classList.add('active');
				}
			}
			updateRangeValue();
		});
	}
}

function getActionSigns () {
	let actions = [];
	let activeActions = document.querySelectorAll('.actionSign.active');
	for (let action of activeActions) {
		let sign = action.innerHTML;
		if (sign == '−') {
			actions.push('-');
		} else {
			actions.push(sign);
		}
	}
	return actions;
}

function toggleButtons() {
	actionHolders.forEach(function(elem) {
		elem.classList.toggle('unactive');
	});

	range.classList.toggle('unactive');
}
