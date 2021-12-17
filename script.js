let indexes = [];

let actions = [];

let defaultNums = [2, 3, 4, 5, 6, 7, 8, 9];
// let defaultNums = [2];
let rangeValues = [0.25, 0.5, 1, 2, 4];

let equations = [];

let maxPoints = 0;
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

let cp_sign = document.querySelector('.copyright_container');
let cp_text = document.querySelector('.copyright_text');

let trainingInProgress = false;

let firstEquation = true;

activateNumbers();
activateActions();
activateSelectAllButton();

range.oninput = function() {
	rangeValue.innerHTML = rangeValues[range.value] + 'x';
}

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
			if (nums.length == 0) {
				clearInterval(curInterval);
			}
		}, 50);
	}
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

function changeEquationText(str) {
	equationText.classList.add('hiden');
	setTimeout(function() {
		equationText.innerHTML = str;
		equationText.classList.remove('hiden');
	}, 250);
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

function checkAnswer() {
	let answerString = answerText.value;
	if (!answerString) {
		return;
	}
	if (answerString == equation.answer) {
		if (equation.type == 'normal') {
			console.log(curPoints);
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
			addMistakeDiv();
			addAdditionalEquationToList();
			equationArea.scrollIntoView({behavior: 'smooth'});
		} else {
			makeMistakeDiv('failed');
		}
	}

	answerText.focus();

	if (equations.length > 0) {
		doEquation();
	} else {
		hideElementsAndShowResult();
	}
	console.log(equations);
}

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
		mistakesHeader.innerHTML += '✖';
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

function hideElementsAndShowResult() {
	equationText.innerHTML = '';

	deactivateMistakesHeader();
	// deactivateMistakeDivs();

	let main = document.querySelector('.main');

	equationText.innerHTML = curPoints + ' / ' + maxPoints;

	checkNoMistakes();

	window.scrollTo({
	    top: 0,
	    behavior: "smooth"
	});

	changeSignTo('hiden');
	toggleAnswerTextVisibility();
	setTimeout(function() {
		changeSignTo('reload');
	}, timeAfterFinish);
}

function checkNoMistakes() {
	if (curPoints == maxPoints) {
		mistakesHeader.classList.toggle('no_mistakes');
	}
}

function deactivateMistakeDivs() {
	let mistakeDivs = document.querySelectorAll('.mistakes_area div');
	for (let elem of mistakeDivs) {
		elem.classList.add('unactive');
	}
}

function start() {
	checkActiveActions();
	checkActiveNumbers();
	toggleButtons();
	toggleEquationArea();
	changeSignTo('submit');
	toggleAnswerTextVisibility();

	equations = createEquationsList();
	maxPoints = equations.length;

	answerText.focus();

	window.scrollTo({
	    top: 80,
	    behavior: "smooth"
	});
}

function changeSignTo(type) {
	switch (type) {
		case 'start':
			sign.setAttribute('class', 'sign');
			sign.classList.add(type);
			sign.innerHTML = '▶';
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

function toggleAnswerTextVisibility() {
	answerText.classList.toggle('hiden');
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

sign.addEventListener('click', function(e) {
	checkInputs();
});
document.addEventListener('keydown', function(e) {
	if (e.key == 'Enter') {
		checkInputs();
	}
});


answerText.addEventListener('keyup', function(e) {
	if (answerText.value.length > 2) {
		answerText.value = answerText.value.substr(0, 2);
	}
});

function checkInputs() {
	if (!trainingInProgress){
		trainingInProgress = true;
		start();
		doEquation();
	} else if (sign.classList.contains('submit')) {
		checkAnswer();
	} else if (sign.classList.contains('reload')) {
		resetData();	
	}
}

function resetData() {
	changeSignTo('start');
	equationText.innerHTML = '';
	firstEquation = true;
	toggleEquationArea();
	mistakesHeader.innerHTML = '✖';	
	mistakesArea.innerHTML = '';
	curPoints = 0;
	indexes = [];
	actions = [];
	toggleButtons();
	trainingInProgress = false;
	mistakesHeader.classList.remove('no_mistakes');
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
		});
	}
}

function createEquationsList() {
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

	let amount = rangeValues[range.value];

	if (amount > 1) {
		for (let i = amount; i > 1; i /= 2) {
			let newArr = [];
			for (let i = 0; i < result.length; i++) {
				newArr.push(Object.assign({}, result[i]));
			}
			result.push(...newArr);
		}
	}

	result = shuffle(result);

	if (amount < 1) {
		result = result.slice(0, result.length * amount)
	}

	return result;

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



