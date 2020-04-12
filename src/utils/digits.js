import isEqual from 'lodash/isEqual';

export const clean = (num) => {
    while (num.length < 4) {
        num = '0' + num;
    }
    return num;
}

export const isMatchPermutation = (target, source) => {
    const targetNum = clean(target).split('').sort();
    const num = clean(source).split('').sort();


    return isEqual(targetNum, num);

}

export const reduceNumber = (number) => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    return clean(number).split('').sort().reduce(reducer);
}

export const isValidNumber = (number) => {
    const num = clean(number);

    return /[0-9][0-9][0-9][0-9]/.test(num);
}

export const getPrizeTitle = (prizeCode) => {
    const key = prizeCode.charAt(0);
    switch (key) {
        case '1':
            return '1st';
        case '2':
            return '2nd';
        case '3':
            return '3rd';
        case 's':
            return 'Starter';
        case 'c':
            return 'Consolation';
    }
}
