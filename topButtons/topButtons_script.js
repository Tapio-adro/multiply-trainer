let refButton = document.querySelector('#ref_button');
let colorButton = document.querySelector('#color_button');
let colorsHolder = document.querySelector('#colors_container');
let colorButtons = document.querySelectorAll('.color_container')
let refWrapper = document.querySelector('.ref_wrapper');

let canChangeColor = false;

activateColorButtons();

refButton.addEventListener('click', ev => {
	refButton.classList.toggle('active');
	refWrapper.classList.toggle('hiden');
})

colorButton.addEventListener('click', ev => {
	colorsHolder.classList.toggle('active');
	colorButton.classList.toggle('hiden');
	setTimeout(() => {
		canChangeColor = true;
	}, 500)
})

document.addEventListener('keydown', function(e) {
if (refButton.classList.contains('active') && e.key == 'Escape') {
	refButton.classList.toggle('active');
	refWrapper.classList.toggle('hiden');	
	}
});

function activateColorButtons () {
	for (let button of colorButtons) {
		button.addEventListener('click', ev => {
			if (canChangeColor) {
				let color = button.style.backgroundColor;
				document.documentElement.style.setProperty('--green', color);
				colorsHolder.classList.toggle('active');
				colorButton.classList.toggle('hiden');
				canChangeColor = false;
			}
		})
	}
}