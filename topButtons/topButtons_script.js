let colorButton = document.querySelector('#color_button');
let colorsHolder = document.querySelector('#colors_container');
let colorButtons = document.querySelectorAll('.color_container');
let shrinkLink = document.querySelector('#shrink_link_wrapper')
let linkToFractionButton = document.querySelector('#linkToFraction');
let linkToMainButton = document.querySelector('#linkToMain');
let refButton = document.querySelector('#ref_button');
let refWrapper = document.querySelector('.ref_wrapper');

let canChangeColor = false;

activateColorButtons();

if (linkToFractionButton) {
	linkToFractionButton.addEventListener('click', ev => {
		if (linkToFractionButton.classList.contains('active')) {
			window.location.href = "../fraction/index.html";
		} else {
			linkToFractionButton.classList.add('active');
			linkToFractionButton.innerHTML = 'Тренажер дробів';
			shrinkLink.classList.remove('hiden');
		}
	})
	shrinkLink.addEventListener('click', ev => {
		if (!shrinkLink.classList.contains('hiden')) {
			shrinkLink.classList.add('hiden');
			linkToFractionButton.innerHTML = '<div class="fract"> <div class="numer">1</div> <div class="denom" style="border-top: 2px solid rgb(0, 0, 0)">2</div> </div>';
			linkToFractionButton.classList.remove('active');
		}
	})
} else {
	linkToMainButton.addEventListener('click', ev => {
		if (linkToMainButton.classList.contains('active')) {
			window.location.href = "../main/index.html";
		} else {
			linkToMainButton.classList.add('active');
			linkToMainButton.innerHTML = 'Тренажер множення';
			shrinkLink.classList.remove('hiden');
		}
	})
	shrinkLink.addEventListener('click', ev => {
		if (!shrinkLink.classList.contains('hiden')) {
			shrinkLink.classList.add('hiden');
			linkToMainButton.innerHTML = '2 × 2';
			linkToMainButton.classList.remove('active');
		}
	})
}



refButton.addEventListener('click', ev => {
	refButton.classList.toggle('active');
	refWrapper.classList.toggle('hiden');
})



document.addEventListener('keydown', function(e) {
if (refButton.classList.contains('active') && e.key == 'Escape') {
	refButton.classList.toggle('active');
	refWrapper.classList.toggle('hiden');	
	}
});

colorsHolder.addEventListener('click', ev => {
	if (!canChangeColor) {
		console.log('2');
		colorsHolder.classList.toggle('active');
		setTimeout(() => {
			canChangeColor = true;
		}, 500)
	}
})

function activateColorButtons () {
	for (let button of colorButtons) {
		button.addEventListener('click', ev => {
			console.log('1');
			if (canChangeColor) {
				let color = button.style.backgroundColor;
				document.documentElement.style.setProperty('--green', color);
				colorsHolder.classList.toggle('active');
				setTimeout(() => {
					canChangeColor = false;
				}, 0)
			}
		})
	}
}