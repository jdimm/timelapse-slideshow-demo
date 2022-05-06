
import timezones from '../data/timezones'
import timestampRange from './timestamp'

const getLightRange = (day, idx, sigOn) => {
    const lighton = []
    let state = 'off'
    let start = ''
    let sig = ''
    day.forEach ( (event, idx2) => {
      if (event.sig === sigOn) {
        state = 'on'
        start = event.schedule_hour
        sig = event.sig
      } else if (state === 'on') {
          lighton.push ({
             day: idx,
             sig: sig,
             start: start,
             end: event.schedule_hour
          })
          state = 'off'
          }
      })
      return lighton
  }
  
  const parseSchedule = (schedule) => {
    const lighton = []
    schedule.forEach ( (day, idx) => {
        const incLighton = getLightRange(day, idx, 'on')
        lighton.push(...incLighton)
        const incBooston = getLightRange(day, idx, 'boost')
        lighton.push(...incBooston)
    })
    return lighton
  }

 const daySchedule = (day, lighton, timezoneCode, serial) => {

  const timezone = timezones[timezoneCode]
  console.log(timezone)

  const date = new Date(day)
  console.log('date: ', date)

  //let dateLocal = new Date(date.toLocaleString("en-US", {
  //  timeZone: timezone
  //}))
  //const diff = (dateLocal - date) / 1000 / 60 / 60

  let dayOfWeek= date.getDay()

  const lightonToday = lighton.filter( (light) => {
    if ( light.day  === dayOfWeek )
      return light
  })

  lightonToday.forEach( (range, idx) => {
    const rangeTS = timestampRange(day, range.start, range.end, timezone)

    range.startTS = rangeTS.startTS
    range.endTS = rangeTS.endTS
    range.serial = serial
    range.timezone = timezone
  })
  // console.log('dayOfWeek', dayOfWeek)
  // console.log('serail', serial)
  //console.log(lightonToday)
  return lightonToday
 }

 const extractSchedule = (results, day) => {
    const schedule = JSON.parse(results[0].schedule)
    const lighton = parseSchedule(schedule)
    const timezoneCode = results[0].timezone
    const serial = results[0].serial

    return daySchedule(day, lighton, timezoneCode, serial) 
 }

export default extractSchedule
