import { useEffect, useState } from 'react'
import styles from './Schedule.module.css'
import timestampRange from '../util/timestamp';
import extractSchedule from '../util/schedule'
import may1 from '../data/may1.tsv'

const Schedule = ( {device_id, date} ) => {
    const [schedule, setSchedule] = useState([]);
    const [scheduleRaw, setScheduleRaw] = useState([]);
    const [serial, setSerial] = useState('');
    const [azureFiles, setAzureFiles] = useState([]);
    const [image, setImage] = useState('');
    const [waitCursorEl, setWaitCursorEl] = useState(null);
    const [timelapseLink, setTimelapseLink] = useState('');
 
    const getSchedule = async (device_id, date) => {
        const response = await fetch (`/api/schedule/${device_id}/${date}`)
        let serial = ''
        let timezone = ''
        if (typeof response !== 'undefined') {
            const scheduleRaw = await response.json()
            const schedule = extractSchedule(scheduleRaw, date)
            // console.log(schedule)
            setSchedule(schedule)
            if (schedule.length > 0) {
                serial = schedule[0].serial
                timezone = schedule[0].timezone
                setSerial(serial)
            }

            let scheduleOG = 'timezone: ' + timezone + '\n'
            const timelapseLink = 'http://13.90.210.214:3000/timelapse/' + serial
            setTimelapseLink(timelapseLink)

            scheduleOG += `serial:${serial} \n\n`
            scheduleRaw.forEach(schedule => {
                const scheduleJson = JSON.parse(schedule.schedule)
                scheduleOG += JSON.stringify(scheduleJson,0,2)
            })        
            setScheduleRaw(scheduleOG)
        }

    }

    const getAzureFiles = async (date) => {
        const tsRange = timestampRange(date, '00:00:00', '23:59:59', '')
        // console.log('serial: ' + serial)

        const response = await fetch(`/api/azure_list/${serial}/${tsRange.startTS}/${tsRange.endTS}`)
        const azureFiles = await response.json()
        // console.log('azureFiles', azureFiles)
        setAzureFiles(azureFiles)
    }

    useEffect(() => {
       // const tsRange = timestampRange('2022-04-01', '00:00:00', '23:59:59', 'UTC')
       // console.log('tsRange: ', tsRange)

       getSchedule(device_id, date)
    },[device_id, date])

    useEffect(() => {
         getAzureFiles(date)
    },[serial])

    const imageClick = (e,item) => {
        e.currentTarget.style.cursor='wait';
        setWaitCursorEl(e.currentTarget);
        setImage(item)
    }

    const imageLoaded = (e) => {
        if (waitCursorEl) 
          waitCursorEl.style.cursor='default';
    }

    const scheduleHTML = schedule.map ( (item, idx) => {
        const startDate = new Date(item.startTS * 1000)
        const endDate = new Date(item.endTS * 1000)
        const s = startDate.toLocaleTimeString()
        const e = endDate.toLocaleTimeString()
        //console.log(startDate, endDate)
        return <div key={idx}>{item.sig} {item.start} {item.end} {item.startTS} {item.endTS} {s} {e}</div>
    })

    const azureFilesHTML = azureFiles.map ( (item, idx) => {
        const re = /_(\d*)\.jpg/ 
        const match = item.match(re)
        const ts = match[1]

        const sig = '     '
        schedule.forEach ( (item, idx) => {
            if (item.startTS <= ts && item.endTS >= ts) {
                sig = item.sig.padEnd(5)
            }
        })

        console.log(ts)
        const d = new Date(ts * 1000)
        const localeTime = d.toLocaleTimeString()
        const date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
        return <div key={idx}>
             <span className={styles.imageLink} onClick={(e) => imageClick(e,item) }>{item}</span> {sig} {localeTime} {date}
            </div>
    })

    const may1HTML = may1.map ( (item, idx) => {
        const link = `/schedule/${item}/2022-05-01`
        return <div key={idx}><a href={link}>{item}</a></div>
    })

    const imageUrl = image == '' ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzjvTwY220WDaZMZ5BmegbXmN_dFNElObmP91YIjhVQWupZe7d2Au0NBqagSqgwB_41YQ&usqp=CAU' :
    'https://gardyniotblob.blob.core.windows.net/iot-camera-image/' + image

    return (
    <div className={styles.page}>
        <div className={styles.leftMargin}>
            <h3>Devices</h3>
            {may1HTML}
        </div>
        <div className={styles.leftSide}>
            <div className={styles.schedule}>
                <h3>Light Time Periods</h3>
                {scheduleHTML}
            </div>
            <div className={styles.azure_files}>
                <h3>Azure Images</h3>
                {azureFilesHTML}
            </div>
            <div className={styles.scheduleRaw}>
                <h3>Schedule</h3>
                <div>
                  <a href={timelapseLink} target="_blank">Timelapse</a>
                </div>
                {scheduleRaw}

            </div>
        </div>
        <div className={styles.rightSide}>
            <img className={styles.image} src={imageUrl} onLoad={imageLoaded}/>
            <br />
            {image}
        </div>
    </div>
    )
}

export default Schedule