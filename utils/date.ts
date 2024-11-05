// https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datestring

interface Dictionary<T> {
  [key: string]: T
}

const NUMERICAL_DATES: Dictionary<string> = {
    'Jan' : '01',
    'Feb' : '02',
    "Mar" : '03',
    "Apr" : '04',
    "May" : '05',
    "Jun" : '06',
    "Jul" : '07',
    "Aug" : '08',
    "Sep" : '09',
    "Oct" : '10',
    "Nov" : '11',
    "Dec" : '12'
}


export function convertLocaleDateToSqlDate(localeDateString: string) {
    let dateArr = localeDateString.split(' ');

    let year = dateArr[3];

    let localeStringMonth = dateArr[1];
    let month = NUMERICAL_DATES[localeStringMonth];

    let date = dateArr[2];

    return `${year}-${month}-${date}`;
}


export function incrementDate(localeDateString: string) {
    let dateArr = localeDateString.split(' ');
}

