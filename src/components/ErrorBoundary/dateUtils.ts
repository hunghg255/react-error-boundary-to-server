import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat); // need this because we receive non-standard date strings from some apis

export const formatDate = (formatString: any, date = new Date()) =>
  dayjs(date).format(formatString);
export const parseDate = (dateToParse: any, formatString: any) =>
  dayjs(dateToParse, formatString).toDate();
