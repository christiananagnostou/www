import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const formatPhotoDate = (date: string) => dayjs.utc(date).format("MMM 'YY")
