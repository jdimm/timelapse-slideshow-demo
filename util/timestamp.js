let offsetTS = 0 //  3600 * 3

function getTimeZoneOffset(date, timeZone) {

    // Abuse the Intl API to get a local ISO 8601 string for a given time zone.
    let iso = date.toLocaleString('en-CA', { timeZone, hour12: false }).replace(', ', 'T');
    
    // Include the milliseconds from the original timestamp
    iso += '.' + date.getMilliseconds().toString().padStart(3, '0');
    
    // Lie to the Date object constructor that it's a UTC time.
    const lie = new Date(iso + 'Z');
  
    // Return the difference in timestamps, as minutes
    // Positive values are West of GMT, opposite of ISO 8601
    // this matches the output of `Date.getTimeZoneOffset`
    return -(lie - date) / 60 / 1000;
}

//console.log (getTimeZoneOffset(new Date(2020, 3, 13), 'America/New_York'))//=> 240
//console.log (getTimeZoneOffset(new Date(2020, 3, 13), 'Asia/Shanghai')) //=> -480

export function epochToTimestamp(epoch) {
    const e = parseInt(epoch) + offsetTS
    //console.log('epochToTimestamp: epoch', epoch)
    //console.log('epochToTimestamp: epoch2', epoch2)
    const date = new Date(e * 1000)
    return date
}

export function timestampToEpoch(timestamp) {
    //const timestamp = new Date(ts)
    const ts = timestamp - (offsetTS * 1000)
    // console.log('timestampToEpoch: timestamp', timestamp, 'offsetTS', offsetTS)
    //console.log('timestampToEpoch: timestamp2', timestamp2)
    const date = new Date(ts)
    return parseInt(date.getTime() / 1000)
}

function test () {
    const timestamp = 1653398492
    const epoch = timestampToEpoch(timestamp)
    const timestamp2 = epochToTimestamp(epoch)
    const epoch2 = timestampToEpoch(timestamp2)

    console.log('test:  epoch', epoch)
    console.log('test:  epoch2', epoch2)
    console.log('test: timestamp2', timestamp2)
}

function timestampRange(date, startHour, endHour, timezone) {
    const start = new Date(date + ' ' + startHour)
    const end = new Date(date + ' ' + endHour)

    if (timezone) {
        //console.log("timezone:", timezone)
        const tzo_client = getTimeZoneOffset(start, timezone)
        const tzo_server = getTimeZoneOffset(start, 'America/Los_Angeles')

        //console.log("tzo_client", tzo_client)
        //console.log("tzo_server", tzo_server)

        const hoursOff = ((tzo_server - tzo_client + 60) / 60)
        const newOffsetTS = hoursOff * 3600
        //console.log("offsetTS", offsetTS, "newOffsetTS", newOffsetTS, "hoursOff", hoursOff)
        offsetTS = newOffsetTS
    }

    const result = {
        startTS : timestampToEpoch(start),
        endTS : timestampToEpoch(end)
    }

    return result
}

export default timestampRange