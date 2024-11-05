// https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-datestring

interface Dictionary<T> {
  [key: string]: T
}

const NUMERICAL_MONTHS: Dictionary<string> = {
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

const NUMERICAL_MONTHS_ARR = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'   
]


export function convertLocaleDateToSqlDate(localeDateString: string) {
    let dateArr = localeDateString.split(' ');

    let year = dateArr[3];

    let localeStringMonth = dateArr[1];
    let month = NUMERICAL_MONTHS[localeStringMonth];

    let date = dateArr[2];

    return `${year}-${month}-${date}`;
}


function convertIntMonthToString(intMonth: number): string {
    if (intMonth == 13) {
        intMonth = 1; 
    }

    return NUMERICAL_MONTHS_ARR[intMonth - 1];
}

export function incrementDate(localeDateString: string) {
    let dateArr = localeDateString.split(' ');

    let intMonth = parseInt(NUMERICAL_MONTHS[dateArr[1]]);
    let intDate = parseInt(dateArr[2]);
    let intYear = parseInt(dateArr[3])

    // End of the year
    if (intMonth == 12 && intDate == 31) {
        dateArr[3] = (++intYear).toString(); 
    }

    // Leap Year
    if (intDate == 28) {
        if (2 == intMonth) {
            if (intYear % 4 != 0) {
                intMonth++;
                dateArr[1] = convertIntMonthToString(intMonth);
                intDate = 0;
            }
        }
    }

    // Handle Leap Year Day
    if (intDate == 29 && intMonth == 2) {
        intMonth++;
        dateArr[1] = convertIntMonthToString(intMonth);
        intDate = 0;        
    }

    // Months with 30 Days
    if (intDate == 30) {
        if ([4, 6, 9, 11].includes(intMonth)) {
            intMonth++;
            dateArr[1] = convertIntMonthToString(intMonth);
            intDate = 0;
        }
    }

    // Months with 31 Days
    if (intDate == 31) {
        if ([1, 3, 5, 7, 8, 10, 12].includes(intMonth)) {
            intMonth++;
            dateArr[1] = convertIntMonthToString(intMonth);
            intDate = 0;
        }
    }

    intDate++;


    if (intDate < 10) {
        dateArr[2] = '0' + intDate.toString()
    } else {
        dateArr[2] = intDate.toString();
    }

    return dateArr.join(' ');
}

