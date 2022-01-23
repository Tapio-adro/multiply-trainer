let equationTypes = ['full', '1st_part', '2nd_part']

let actionSigns = ['+', '-', '×', '÷'];

function createEquationsList (amount, actions) {
    actionSigns = actions;
    let equations = [];
    for (let i = 0; i < amount; i++) {
        let equation = createEquation();

        simplifyEquation(equation);
        
        toMixedEquation(equation);
        
        let explanationSteps = createExplanations(clone(equation));
    
        let full = createEquationElements(equation, false);
        
        let partial = full.cloneNode(true);

        let answerElement = partial.lastElementChild;
    
        let answer = partial.removeChild(answerElement).innerHTML;

        let explanations = document.createElement('ol');
        for (let step of explanationSteps) {
            let li = document.createElement('li');
            li.innerHTML = createEquationElements(step).outerHTML;
            explanations.appendChild(li);
        }
        
        full = full.innerHTML;
        partial = partial.innerHTML;
        explanations = explanations.outerHTML;
    
        equations.push({full, partial, explanations, answer});
    }
    return equations;
}

function createExplanations (equation) {

    let steps = [];

    for (let part of equation.parts) {
        if (!(part instanceof Fraction)) {
            addStep(part);
        }
    }

    let finalEq = createFinalEquation();

    addStep(finalEq, true);

    return steps;

    function addStep (part, final = false) {
        steps.push(Fraction.actionExplanations(part, final));
    }

    function createFinalEquation () {
        let eqs = [];

        for (let part of equation.parts) {
            if (part instanceof Fraction) {
                eqs.push(part);
            } else {
                eqs.push(part.answer);
            }
        }
    
        let finalEq = {
            answer: new Fraction(0, equation.answer, 1),
            sign: equation.sign,
            eqs: eqs,
        };

        return finalEq;
    }
}

function createEquationElements (equation, isStringToPrint = true) {
    let elements = document.createElement('div');
    elements.classList.add('equation_container');
    
    let partsOfEq = equation;

    if(!isStringToPrint) {
        partsOfEq = createStringToPrint(equation);
    }

    let printDEM = false;

    for (let key in partsOfEq) {
        let part = partsOfEq[key];
        if (part == 'DEM') {
            printDEM = true;
            continue;
        }
        if (part instanceof Fraction || typeof part === 'object') {
            if ((part.isDecimal() || part.isInteger()) && printDEM){
                addToField(part.toDecimal());
            } else {
                if (part.whole != 0) {
                    addToField(part.whole);
                }
    
                let fract = document.createElement('div');
                fract.className = 'fract';
    
                let numer = document.createElement('div');
                numer.className = 'numer';
                numer.innerHTML = part.numer;
    
                let denom = document.createElement('div');
                denom.className = 'denom';
                denom.innerHTML = part.denom;
    
                fract.appendChild(numer);
                fract.appendChild(denom);
                elements.appendChild(fract);
            }

        } else {
            addToField(part);
        }
        printDEM = false;
    }

    function addToField (str) {
        let elem = document.createElement('div');
        elem.className = 'eqPart';
        elem.innerHTML = str;
        elements.appendChild(elem);
    }

    return elements;
}

function createStringToPrint (equation) {
    let partsOfEq = [];

    let part1 = equation.parts[0];
    let part2 = equation.parts[1];

    addPart(part1);
    partsOfEq.push(equation.sign);
    addPart(part2);
    partsOfEq.push('=');
    partsOfEq.push('DEM');
    partsOfEq.push(equation.answer);

    function addPart (part) {
        if (part instanceof Fraction) {
            partsOfEq.push('DEM');
            partsOfEq.push(part);
        } else {
            let [eq1, eq2] = part.eqs;
            partsOfEq.push('(');
            partsOfEq.push('DEM');
            partsOfEq.push(eq1);
            partsOfEq.push(part.sign);
            partsOfEq.push('DEM');
            partsOfEq.push(eq2);
            partsOfEq.push(')');
        }
    }
    return partsOfEq;
}

function toMixedEquation (equation) {
    for (let i = 0; i < equation.parts.length; i++) {
        let parts = equation.parts;
        if (parts[i] instanceof Fraction) {
            parts[i].toMixed();
        } else {
            parts[i].answer.toMixed();
            for (let j = 0; j < parts[i].eqs.length; j++) {
                parts[i].eqs[j].toMixed();
            }
        }
    }
}

function simplifyEquation (equation) {
    for (let part of equation.parts) {
        if (part instanceof Fraction) {
            part.simplifyFraction();
        } else {
            part.answer.simplifyFraction();
            for (let eq of part.eqs) {
                eq.simplifyFraction();
            }
        }
    }
}

function createEquation () {
    let eqType = randomFromArray(equationTypes);
    let answer = getRandom(1, 10);

    let sign = getRandomSign();
    let sign_part1, sign_part2;
    let part1 = {}, part2 = {};

    let [fract1, fract2] = answer.divideNumber(sign)

    switch (eqType) {
        case 'full':
            sign_part1 = getRandomSign();
            part1.eqs = fract1.divideFraction(sign_part1); 
            part1.sign = sign_part1; 
            part1.answer = fract1; 

            sign_part2 = getRandomSign();
            part2.sign = sign_part2; 
            part2.eqs = fract2.divideFraction(sign_part2); 
            part2.answer = fract2; 
            break;
        case '1st_part':
            sign_part1 = getRandomSign();
            part1.eqs = fract1.divideFraction(sign_part1); 
            part1.sign = sign_part1; 
            part1.answer = fract1; 

            part2 = fract2;
            break;
        case '2nd_part':
            part1 = fract1;

            sign_part2 = getRandomSign();
            part2.sign = sign_part2; 
            part2.eqs = fract2.divideFraction(sign_part2); 
            part2.answer = fract2; 
            break;
    }

    return {parts: [part1, part2], sign, answer};
}



function getRandomSign () {
    return randomFromArray(actionSigns);
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Fraction) {
        copy = new Fraction(obj.whole, obj.numer, obj.denom);
        return copy;
    }

    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }


    throw new Error("Unable to copy obj! Its type isn't supported.");
}

