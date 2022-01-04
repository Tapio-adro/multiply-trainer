let indexes = [];

let actions = [];

let defaultNums = [2, 3, 4, 5, 6, 7, 8, 9];
// defaultNums = [2];
let rangeValues = [0.25, 0.5, 1, 2, 4];

let equations = [];

let maxPoints = 0;
let eqAmount = 0;
let curPoints = 0;

let timeAfterFinish = 3000;

let equation;

let multAction = document.querySelector('#multiplication');
let divisAction = document.querySelector('#division');
let lastActiveAction;

let main = document.querySelector('.main');
let numHolders = document.querySelectorAll('.numbers');
let actionHolders = document.querySelectorAll('.actionSign');
let equationText = document.querySelector('.equation_text');
let answerText = document.querySelector('.answer_text');
let equationArea = document.querySelector('.equation_area');
let mistakesArea = document.querySelector('.mistakes_area');
let mistakesHeader = document.querySelector('.mistakes_header');
let sign = document.querySelector('.sign');
let selectAllButton = document.querySelector('.select_all_button');
let range = document.querySelector('.range');
let rangeValue = document.querySelector('.range_value');
let resultsElem = document.querySelector('.results');
let resultsContent = document.querySelector('.results_content')
let darkBg = document.querySelector('.darkBg')

let results_p1, results_p2, results_holder, results_eqAmount;
let rangeLine, acceptButton;

let trainingInProgress = false;

let timeStart, trainingDuration;

let firstEquation = true;

activateButtons();

sign.addEventListener('click', function(e) {
	checkInputs();
});

document.addEventListener('keydown', function(e) {
	if (e.key == 'Enter') {
		checkInputs();
	}
});

range.oninput = function() {
	updateRangeValue();
}

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

function resetData() {
	changeSignTo('start');
	equationText.innerHTML = '';
	firstEquation = true;
	mistakesHeader.innerHTML = '<div class="mistake_cross"></div>';	
	mistakesArea.innerHTML = '';
	curPoints = 0;
	indexes = [];
	actions = [];
	toggleButtons();
	trainingInProgress = false;
	mistakesHeader.classList.remove('no_mistakes');
}

function start() {
	checkActiveActions();
	checkActiveNumbers();

	updateRangeValue();

	toggleButtons();
	toggleEquationArea();
	toggleAnswerTextVisibility();

	changeSignTo('submit');

	timeStart = new Date();

	equations = createEquationsList();
	maxPoints = equations.length;
	eqAmount = equations.length;

	answerText.focus();

	window.scrollTo({
	    results: 80,
	    behavior: "smooth"
	});
}

function doEquation() {
	answerText.value = '';
	equation = equations.pop();
	let equationString = getEquationString(equation);
	if (firstEquation) {
		firstEquation = false;
		showFirstEquation(equationString)
		return;
	}
	changeEquationText(equationString);
} 

function checkAnswer() {
	let answerString = answerText.value;
	if (!answerString) {
		return;
	} else if (answerString == equation.answer) {
		if (equation.type == 'normal') {
			eqAmount--;
			curPoints++;
			deactivateMistakesHeader();
		} else {
			makeMistakeDiv('solved');
		}
	} else {
		equationArea.classList.toggle('equation_area-mistake');
		setTimeout(function() {
			equationArea.classList.toggle('equation_area-mistake');
		}, 250);
		if (equation.type == 'normal') {
			eqAmount--;
			addMistakeDiv();
			addAdditionalEquationToList();
			equationArea.scrollIntoView({behavior: 'smooth'});
		} else {
			makeMistakeDiv('failed');
		}
	}

	rangeValue.innerHTML = eqAmount;

	answerText.focus();

	if (equations.length > 0) {
		doEquation();
	} else {
		hideElementsAndShowResult();
	}
	
}

function hideElementsAndShowResult() {
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

function updateRangeValue () {
	let defaultAmount = getActiveCoefficient() * 8;
	rangeValue.innerHTML = rangeValues[range.value] * defaultAmount;
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
				rangeLine.style.width = (curPoints / maxPoints * 100) + '%';
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
		rangeLine = range_line;
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

function addMistakeDiv() {
	let mistakeDiv = document.createElement('div');
	mistakeDiv.innerHTML = getEquationString(equation, 'full');
	mistakesArea.appendChild(mistakeDiv);
	let mistakeDivs = document.querySelectorAll('.mistakes_area div');
	if (mistakeDivs.length == 1) {
		mistakesHeader.classList.add('active');
	} else {
		mistakesHeader.classList.add('active');
		mistakesHeader.innerHTML += '<div class="mistake_cross"></div>';
	}
	if (mistakeDivs.length > 6) {
		mistakesArea.removeChild(mistakeDivs[0]);
	}
}

function addAdditionalEquationToList() {
	let newEquation = equation;
	newEquation.type = 'additional';
	equations.splice(equations.length - 1, 0, newEquation);
}

function makeMistakeDiv(type) {
	let mistakeDivs = document.querySelectorAll('.mistakes_area div');
	for (let elem of mistakeDivs) {
		if (elem.innerHTML == getEquationString(equation, 'full') 
			&& !elem.classList.contains('failed')
			&& !elem.classList.contains('solved')) {
			elem.classList.add(type);
			return;
		}
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

function getEquationString(equation, mode='default') {
	modes = {
		default: function(equation) {
			return equation.num1 + ' ' + equation.sign + ' ' + equation.num2 + ' = ';
		},
		full: function(equation) {
			return equation.num1 + ' ' + equation.sign + ' ' + equation.num2 + ' = ' + equation.answer;
		}
	}
	return modes[mode](equation);
}

function changeEquationText(str) {
	equationText.classList.add('hiden');
	setTimeout(function() {
		equationText.innerHTML = str;
		equationText.classList.remove('hiden');
	}, 250);
}

function toggleButtons() {
	numHolders.forEach(function(elem) {
		elem.classList.toggle('unactive');
	});

	actionHolders.forEach(function(elem) {
		elem.classList.toggle('unactive');
	});

	selectAllButton.classList.toggle('unactive');

	range.classList.toggle('unactive');
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

function checkActiveNumbers() {
	let activeNumbers = document.querySelectorAll('.numbers.active');
	if (activeNumbers.length == 0) {
		let numbers = document.querySelectorAll('.numbers');
		for (let elem of numbers) {
			if (elem.innerHTML == 2) {
				indexes[0] = 2;
				elem.classList.add('active');
				break;
			}
		}
	} else {
		indexes = [];
		for (let elem of activeNumbers) {
			indexes.push(elem.innerHTML);
		}
	}
}

function checkActiveActions() {
	actions = [];
	let activeActions = document.querySelectorAll('.actionSign.active');
	for (let elem of activeActions) {
		actions.push(elem.innerHTML);
	}
}

function getActiveCoefficient () {
	let activeNumbers = document.querySelectorAll('.numbers.active');
	let numAmount = 0;
	activeNumbers.forEach(() => numAmount++);

	let activeActions = document.querySelectorAll('.actionSign.active');
	let actAmount = 0;
	activeActions.forEach(() => actAmount++);

	// console.log(numAmount, actAmount);

	return numAmount * actAmount;
}

function activateButtons() {

	activateSelectAllButton();
	activateActions();
	activateNumbers();

	function activateSelectAllButton() {
		selectAllButton.addEventListener('click', function(e) {
			selectAllButton.classList.toggle('active');
			changeSelectionOfAllNumbers();
		});
		function changeSelectionOfAllNumbers() {
			let nums = [2, 3, 4, 5, 6, 7, 8, 9];
			let curInterval = setInterval(function() {
				let num = nums.shift();
				let elem = document.querySelector('#n' + num);
				if (selectAllButton.classList.contains('active')) {
					elem.classList.add('active');
				} else {
					elem.classList.remove('active');
				}
				updateRangeValue();
				if (nums.length == 0) {
					clearInterval(curInterval);
				}
			}, 50);
		}
	}
	
	function activateActions() {
		for (let elem of actionHolders) {
			elem.addEventListener('click', function(e) {
				lastActiveAction = this;
				this.classList.toggle('active');
				let activeActions = document.querySelectorAll('.actionSign.active');
				if (activeActions.length == 0) {
					if (lastActiveAction == multAction) {
						divisAction.classList.add('active');
					} else {
						multAction.classList.add('active');
					}
				}
				updateRangeValue();
			});
		}
	}
	
	function activateNumbers() {
		for (let elem of numHolders) {
			elem.addEventListener('click', function(e) {
				this.classList.toggle('active');
				let activeNumbers = document.querySelectorAll('.numbers.active');
				if (activeNumbers.length == 8) {
					selectAllButton.classList.add('active');
				} else {
					selectAllButton.classList.remove('active');
				}
				updateRangeValue();
			});
		}
	}

}

function createEquationsList() {

	let result = generateBaseArray();

	let coefficient = rangeValues[range.value];

	checkBiggerCoefficient();

	result = shuffle(result);

	checkSmallerCoefficient();

	return result;



	function generateBaseArray() {
		let result = [];
		for (let index of indexes) {
			for (let num of defaultNums) {
				if (actions.indexOf('×') != -1) {
					result.push({
						num1: num, 
						num2: index, 
						answer: num * index, 
						type: 'normal',
						sign: '×'});
				}
				if (actions.indexOf('÷') != -1) {
					result.push({
						num1: num * index, 
						num2: index, 
						answer: num, 
						type: 'normal',
						sign: '÷'});
				}	
			}
		}
		return result;
	}

	function checkBiggerCoefficient() {
		if (coefficient > 1) {
			for (let i = coefficient; i > 1; i /= 2) {
				let newArr = [];
				for (let i = 0; i < result.length; i++) {
					newArr.push(Object.assign({}, result[i]));
				}
				result.push(...newArr);
			}
		}
	}

	function checkSmallerCoefficient() {
		if (coefficient < 1) {
			result = result.slice(0, result.length * coefficient)
		}
	}

	function shuffle(arr) {
		let result = [];
		while (arr.length != 0) {
			result.push(...arr.splice(random(arr), 1));
		}
		return result;
	}

	function random(arr) {
		return Math.floor(Math.random() * arr.length);
	}
}

function showFirstEquation(equationString) {
	let chars = equationString.split('');
	let funcInterval = setInterval(function() {
		equationText.innerHTML += chars.shift();
		if (chars.length == 0) {
			clearInterval(funcInterval);
		}
	}, 10);
}