function timestampRange(date, startHour, endHour, timezone) {
    const start = new Date(date + ' ' + startHour)
    const end = new Date(date + ' ' + endHour)

    //console.log('timestampRange: start date', start)
    //console.log('timestampRange: end date', end)

    const result = {}
    result.startTS = start.getTime() / 1000
    result.endTS = end.getTime() / 1000
    return result
}

export default timestampRange