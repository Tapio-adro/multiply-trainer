let Fraction = function (whole, numer, denom) {
    this.whole = whole;
    this.numer = numer;
    this.denom = denom;
}

Number.prototype.divideNumber = function (sign) { 
    let that = this;
    let divisor = getDivisor();
    let part1, part2;
    let fract1, fract2;
    switch (sign) {
        case '+':
            part1 = getRandomMax(divisor - 1);
            part2 = divisor - part1;
    
            if(part1 == part2) {
                getRandomMax(2) == 1 ? (part1--, part2++) : (part1++, part2--);
            }
        
            fract1 = new Fraction(0, this * part1, divisor);
            fract2 = new Fraction(0, this * part2, divisor);
            break;
        case '-':
            part2 = getRandomMax(divisor - 1);
            part1 = divisor + part2;
    
            fract1 = new Fraction(0, this * part1, divisor);
            fract2 = new Fraction(0, this * part2, divisor);
            break;
        case '×':
            part1 = getRandomMax(divisor - 1);
            part2 = divisor - part1;
    
            fract1 = new Fraction(0, this * part1, part2);
            fract2 = new Fraction(0, part2, part1);
            break;
        case '÷':
            part1 = getRandomMax(divisor - 1);
            part2 = divisor - part1;
    
            fract1 = new Fraction(0, this * part1, part2);
            fract2 = new Fraction(0, part1, part2);
            break;
    }

    if (fract1.isInteger() || fract2.isInteger()
    || isOne(fract1) || isOne(fract2)) {
        return that.divideNumber(sign);
    }

    return [fract1, fract2]; 
}
Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}

Fraction.prototype.isDecimal = function () {
    let denom = this.denom;
    if (this.numer == 0) {return true;}
    while (denom > 1) {
        denom = denom % 2 == 0 ? denom / 2 : denom / 5;
    }
    return denom == 1;
}

Fraction.prototype.toDecimal = function () {
    return this.whole + this.numer / this.denom;
}

Fraction.prototype.isInteger = function () {
    return this.numer / this.denom % 1 == 0;
}

Fraction.prototype.divideFraction = function (sign) {
    let that = this.copy();
    let divisor = getDivisor();
    let part1, part2;
    let fract1, fract2;
    switch (sign) {
        case '+':
            this.numer *= divisor;
            this.denom *= divisor;
            part2 *= divisor;
            part1 = getRandomMax(this.numer - 1);
            part2 = this.numer - part1;
                
            fract1 = new Fraction(0, part1, this.denom);
            fract2 = new Fraction(0, part2, this.denom);
            break;
        case '-':
            fract1 = new Fraction(0, this.numer + divisor, this.denom);
            fract2 = new Fraction(0, divisor, this.denom);
            break;
        case '÷':
        case '×':
            if (this.isFractionPrime()) {
                let [divisor1, divisor2] = getRandomDivisors();

                fract1 = new Fraction(0, this.numer * divisor1, this.denom * divisor2);
                fract2 = new Fraction(0, divisor2, divisor1);
            } else {
                let numerDividers = getDividers(that.numer);
                let denomDividers = getDividers(that.denom);

                let [numerPart1, numerPart2] = splitDividers(numerDividers);
                let [denomPart1, denomPart2] = splitDividers(denomDividers);

                fract1 = new Fraction(0, numerPart1, denomPart1);
                fract2 = new Fraction(0, numerPart2, denomPart2);
            }
            break;

            function getRandomDivisors () {
                let divisor1 = getRandom(2, 5),
                    divisor2 = getRandom(2, 5);
                
                if (divisor1 == divisor2) {
                    return getRandomDivisors ();
                }

                return [divisor1, divisor2];
            }

            function getDividers (num) {
                let dividers = [];
                while (num != 1) {
                    for (let i = 2; i <= num; i++) {
                        if (num % i == 0) {
                            num /= i;
                            dividers.push(i);
                            break;
                        }
                    }
                }
                return dividers
            }

            function splitDividers (arr) {
                let half = Math.floor(arr.length / 2);
            
                let arr1 = [],
                    arr2 = [];
            
                while (half != 0) {
                    arr1.push(arr.pop());
                    half--;
                }
            
                arr2 = arr;
            
                let product1 = 1;
                for (let elem of arr1) {
                    product1 *= elem;
                }
                let product2 = 1;
                for (let elem of arr2) {
                    product2 *= elem;
                }
            
                return [product1, product2];
            }
    }

    if (sign == '÷') {
        [fract2.numer, fract2.denom] = [fract2.denom, fract2.numer];
    }

    if((isOne(fract1) || isOne(fract2)) 
        && (sign == '×' || sign == '÷')) {
        if (sign == '×') {
            fract1.numer *= divisor;
            fract2.denom *= divisor;
        } else {
            fract1.numer *= divisor;
            fract2.numer *= divisor;
        }
    }
    if (containsZero()) {
        return that.divideFraction(sign);
    }

    return [fract1, fract2]; 

    function containsZero () {
        if ((fract1.numer == 0 && fract1.whole == 0)
        || (fract2.numer == 0 && fract2.whole == 0)){
            console.log(that);
            console.log(fract1, fract2);
            console.log('ZERO');
            return true;
        }
    }
}

Fraction.prototype.isFractionPrime = function () {
    let denom = this.denom,
        numer = this.numer;

    let denomIsPrime = true,
        numerIsPrime = true;

    for (let i = 2; i < denom; i++) {
        if (denom % i == 0) {
            denomIsPrime = false;
            break;
        }
    }
    for (let i = 2; i < numer; i++) {
        if (numer % i == 0) {
            numerIsPrime = false;
            break;
        }
    }

    return numerIsPrime && denomIsPrime;
}

Fraction.prototype.simplifyFraction = function () {
    let max = Math.max(this.denom, this.numer);
    let flag = true;
    while (flag) {
        flag = false;
        for (let i = 2; i < max; i++) {
            if ([this.denom, this.numer].every((elem) => elem % i == 0)) {
                this.numer /= i;
                this.denom /= i;
                flag = true;
                break;
            }
        }
    }
}

Fraction.prototype.toMixed = function () {
    this.whole = this.numer < this.denom ? 
        0 : Math.floor(this.numer / this.denom);
    this.numer -= this.whole * this.denom;
    if (this.numer == 0) {
        this.denom = 1;
    }
}

Fraction.prototype.copy = function () {
    let {whole, numer, denom} = this;
    return new Fraction(whole, numer, denom);
}

Fraction.prototype.toUnproper = function () {
    if (this.isDecimal()) {
        let num = this.whole + this.numer / this.denom;
        let tens = 0;
        while (num % 1 != 0) {
            tens++;
            num *= 10;
        }
        this.whole = 0;
        this.numer = num;
        this.denom = Math.pow(10, tens);
    } else {
        this.numer += this.denom * this.whole;
        this.whole = 0;
    }
}

Fraction.isEqual = function(fr1, fr2) {
    const keys1 = Object.keys(fr1);
    for (let key of keys1) {
      if (fr1[key] !== fr2[key]) {
        return false;
      }
    }
    return true;
}

Fraction.actionExplanations = function (equation, final = false) {
    let eq = Object.assign(equation);
    let {answer, sign, eqs} = eq;
    if (answer instanceof Fraction) {
        answer.toUnproper();
    }
    let [eq1, eq2] = eqs;
    let step = [];

    if (final) {
        for (let eq of eqs) {
            eq.toUnproper();
        }
    }

    let onlyDecimal = false;

    switch (sign) { 
        case '+':
        case '-':
            if (eq1.isDecimal() && eq2.isDecimal()) {
                onlyDecimal = true;
                addEqs(1);
            } else {
                addEqs(1);
                let check = eq1.copy();
                if (eq1.isDecimal()) {
                    eq1.toUnproper();
                    addEqs(0);
                    if (eq1.denom != 1) {
                        eq1.simplifyFraction();
                        addEqs(0);
                    }
                } else if (eq1 instanceof Fraction) {
                    eq1.toUnproper();
                    if (!Fraction.isEqual(check, eq1)) {
                        addEqs(0);
                        eq1.simplifyFraction();
                        check = eq1.copy();
                        if (!Fraction.isEqual(check, eq1)) {
                            addEqs(0);
                        }  
                    }                    
                }
                check = eq2.copy();
                if (eq2.isDecimal()) {
                    eq2.toUnproper();
                    addEqs();
                    if (eq2.denom != 1) {
                        eq2.simplifyFraction();
                        addEqs();
                    }
                } else if (eq2 instanceof Fraction) {
                    eq2.toUnproper();
                    if (!Fraction.isEqual(check, eq2)) {
                        addEqs();
                        eq2.simplifyFraction();
                        check = eq2.copy();
                        if (!Fraction.isEqual(check, eq2)) {
                            addEqs();
                        }  
                    }                    
                }

                if(eq1.denom != eq2.denom) {
                    let lcm = findLCM(eq1.denom, eq2.denom);
    
                    let factor1 = lcm / eq1.denom;
                    let factor2 = lcm / eq2.denom;
    
                    eq1.denom *= factor1;
                    eq1.numer *= factor1;
    
                    eq2.denom *= factor2;
                    eq2.numer *= factor2;
    
                    addEqs();
                }

                let wholeFr = new Fraction(0,
                    eq1.numer + ' ' + sign + ' ' + eq2.numer,
                    eq1.denom);

                add1Eq(wholeFr);
                switch (sign) {
                    case '+':
                        wholeFr.numer = eq1.numer + eq2.numer;
                        break;
                    case '-':
                        wholeFr.numer = eq1.numer - eq2.numer;
                        break;
                }
                if (!Fraction.isEqual(answer, wholeFr)) {
                    add1Eq(wholeFr);
                }
                
            }
            break;
        case '×':
            if (eq1.isDecimal() && eq2.isDecimal()) {
                onlyDecimal = true;
                addEqs(1);
                let [num1, tens1] = decimalTo_IntTens(eq1);
                let [num2, tens2] = decimalTo_IntTens(eq2);
                let tensMult = tens1 * tens2;
                let eqStr1 = eq1.toDecimal();
                let eqStr2 = eq2.toDecimal();
                let isDecimal1 = !eq1.isInteger();
                let isDecimal2 = !eq2.isInteger();
                if (!eq1.isInteger()) {
                    eqStr1 = '' + num1 + ' ÷ ' + tens1;
                }
                if (!eq2.isInteger()) {
                    eqStr2 = '' + num2 + ' ÷ ' + tens2;
                }
                let fullStr = eqStr1 + ' × ' + eqStr2;
                step.push(fullStr + ' =');
                if (isDecimal1) {
                    fullStr = '(' + num1 + ' × ' + num2 + ')' + ' ÷ ' + tensMult;
                    step.push(fullStr + ' =');
                }
                fullStr = (num1 * num2) + ' ÷ ' + tensMult;
                step.push(fullStr + ' =');

                break;
            } 
        case '÷':
            addEqs(1);
            let check = eq1.copy();
            if (eq1.isDecimal()) {
                eq1.toUnproper();
                addEqs(0);
                if (eq1.denom != 1) {
                    eq1.simplifyFraction();
                    addEqs(0);
                }
            } else if (eq1 instanceof Fraction) {
                eq1.toUnproper();
                if (!Fraction.isEqual(check, eq1)) {
                    addEqs(0);
                    eq1.simplifyFraction();
                    check = eq1.copy();
                    if (!Fraction.isEqual(check, eq1)) {
                        addEqs(0);
                    }  
                }                    
            }
            check = eq2.copy();
            if (eq2.isDecimal()) {
                eq2.toUnproper();
                addEqs();
                if (eq2.denom != 1) {
                    eq2.simplifyFraction();
                    addEqs();
                }
            } else if (eq2 instanceof Fraction) {
                eq2.toUnproper();
                if (!Fraction.isEqual(check, eq2)) {
                    addEqs();
                    eq2.simplifyFraction();
                    check = eq2.copy();
                    if (!Fraction.isEqual(check, eq2)) {
                        addEqs();
                    }  
                }                    
            }

            if (sign == '÷') {
                sign = '×';
                let {numer, denom} = eq2;
                eq2.numer = denom;
                eq2.denom = numer;
                addEqs();
            }

            let wholeFr = new Fraction(0,
                eq1.numer + ' ' + sign + ' ' + eq2.numer,
                eq1.denom + ' ' + sign + ' ' + eq2.denom);

            add1Eq(wholeFr);

            let gcd1 = findGCD(eq1.numer, eq2.denom);
            let gcd2 = findGCD(eq2.numer, eq1.denom);

            if (gcd1 != 1) {
                wholeFr.numer = '<s>' + eq1.numer + '</s>' + '<sup>' + eq1.numer / gcd1 + '</sup> ' + sign + ' ' + eq2.numer;
                wholeFr.denom = eq1.denom + ' ' + sign + ' ' + '<s>' + eq2.denom + '</s>' + '<sub>' + eq2.denom / gcd1 + '</sub>';
                add1Eq(wholeFr);
                eq1.numer = eq1.numer / gcd1;
                eq2.denom = eq2.denom / gcd1;
            }

            if (gcd2 != 1) {
                wholeFr.numer = eq1.numer + ' ' + sign + ' ' + '<s>' + eq2.numer + '</s>' + '<sup>' + eq2.numer / gcd2 + '</sup>';
                wholeFr.denom = '<s>' + eq1.denom + '</s>' + '<sub>' + eq1.denom / gcd2 + '</sub> ' + sign + ' ' + eq2.denom;
                add1Eq(wholeFr);
                eq1.denom = eq1.denom / gcd2;
                eq2.numer = eq2.numer / gcd2;
            }

            if (gcd1 != 1 || gcd2 != 1) {
                wholeFr.numer = eq1.numer + ' ' + sign + ' ' + eq2.numer;
                wholeFr.denom = eq1.denom + ' ' + sign + ' ' + eq2.denom;
                add1Eq(wholeFr);
            }

            break;

    }
    addAnswer();
    return step;
    
    function addEqs (key = -1) {
        let copy_eq1 = eq.eqs[0].copy();
        let copy_eq2 = eq.eqs[1].copy();
        if (key == 1) {
            step.push('DEM');
        }
        step.push(copy_eq1, sign);
        if (key == 1 || key == 0) {
            step.push('DEM');
        }
        step.push(copy_eq2, '=');
    }
    function add1Eq (eq) {
        let copy_eq = eq.copy();
        step.push(copy_eq, '=');
    }
    function addAnswer () {
        if (onlyDecimal) {
            step.push('DEM');
            step.push(answer.copy());
        } else if (final) {
            step.push(answer.copy());
            answer.toMixed();
            step.push('=', 'DEM');
            step.push(answer.copy());
        } else {
            if (answer.isDecimal()) {
                answer.simplifyFraction();
                step.push(answer.copy());
                step.push('=', 'DEM');
                step.push(answer.copy());
            } else {
                step.push(answer.copy());
                let check = answer.copy();
                answer.simplifyFraction();
                if (!Fraction.isEqual(check, answer) && (sign == '+' || sign == '-')) {
                    step.push('=', answer.copy());
                }
            }
        }
    }

    function decimalTo_IntTens (fract) {
        let num = fract.toDecimal();
        let tens = 1;
        while (num % 1 != 0) {
            num *= 10;
            tens *= 10;
        }
        return [num, tens];
    }
    
    function findLCM (num1, num2) {
        let [a, b] = [num1, num2];
        while (a && b && a !== b) {
            if(a > b){
                [a, b] = [a - b, b];
            }else{
                [a, b] = [a, b - a];
            };
        };
        let gcd = a || b;
        return (num1 * num2) / gcd;
    }

    function findGCD (num1, num2) {
        let [a, b] = [num1, num2];
        while (a && b && a !== b) {
            if(a > b){
                [a, b] = [a - b, b];
            }else{
                [a, b] = [a, b - a];
            };
        };
        let gcd = a || b;
        return gcd;
    }
}

function isDecimal (...elems) {
    return elems.every((elem) => {
        return elem % 1 != 0 && elem % 1;
    });
}

function getRandomMax (max) {
    return Math.floor(Math.random() * max) + 1;
}

function getDivisor () {
    let prime = [3, 6, 7, 9];
    let decimal = [4, 5, 8, 10];
    if (chance(70)) {
        return randomFromArray(prime);
    } else {
        return randomFromArray(decimal);
    }
}

function chance (percent) {
    return getRandomMax(1, 100) <= percent;
}

function randomFromArray (array) {
    return array[Math.floor(Math.random() * array.length)];
}

function isOne (fract) {
    let flag = fract.numer == fract.denom;
    return flag;
}