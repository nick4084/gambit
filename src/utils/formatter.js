
export const toFixed = (num, dp = 2) => {
    return (num).toFixed(dp);
}

export const formatMoney = (amount, prefix = "$") => {
    return  prefix + ' ' +amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");;
}

export const formatDate = (strDate) => {
    //accept 'yyy-mm-dd'
    const moment = require('moment');
    return moment(strDate).format('DD MMM YYYY');
}