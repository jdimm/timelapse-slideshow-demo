import { useEffect, useState } from 'react'
import styles from './Schedule.module.css'
import timestampRange from '../util/timestamp';
import extractSchedule from '../util/schedule'
import may1 from '../data/may1-serials.tsv'

function dateToString(date) {
    const d = new Date(date)
    return d.getFullYear() 
    + '-' 
    + (d.getMonth() + 1).toString().padStart(2,'0') 
    + '-' 
    + d.getDate().toString().padStart(2,'0')
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const imageToAPI = (image) => {
    if (!image || image === '')
      return ''
      
    console.log('imageToAPI, image:', image)
    const re = /camera(\d)_([^_]*)_([^_]*).jpg/
    const match = image.match(re)
    const camera = match[1]
    const serial = match[2]
    const ts = match[3]

    return `/api/azure_downscale/${serial}/${camera}/${ts}/640`
}




const Schedule = ( {serial, date} ) => {
    const [schedule, setSchedule] = useState([]);
    const [scheduleRaw, setScheduleRaw] = useState([]);
    const [azureFiles, setAzureFiles] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [waitCursorEl, setWaitCursorEl] = useState(null);
    const [localFiles, setLocalFiles] = useState({});

 
    const getSchedule = async (serial, date) => {
        const response = await fetch (`/api/schedule/${serial}/${date}`)
        let timezone = ''
        if (typeof response !== 'undefined') {
            const scheduleRaw = await response.json()
            const schedule = extractSchedule(scheduleRaw, date)
            // console.log(schedule)
            setSchedule(schedule)
            if (schedule.length > 0) {
                timezone = schedule[0].timezone
            }

            let scheduleOG = 'timezone: ' + timezone + '\n'

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
        // console.log('tsRange', tsRange)
        // console.log('serial: ' + serial)

        const response = await fetch(`/api/azure_list/${serial}/${tsRange.startTS}/${tsRange.endTS}`)
        const jsonResponse = await response.json()

        // console.log('azureFiles', azureFiles)    
        setAzureFiles(jsonResponse.azureFiles)
        setLocalFiles(jsonResponse.localFiles)
    }

    useEffect(() => {
       // const tsRange = timestampRange('2022-04-01', '00:00:00', '23:59:59', 'UTC')
       // console.log('tsRange: ', tsRange)

       getSchedule(serial, date)
    },[serial, date])

    useEffect(() => {
         getAzureFiles(date)
    },[serial, date])

    const imageToLocalFileUrl = (image) => {
        if (!image || image === '')
          return ''
          
        const re = /camera(\d)_([^_]*)_([^_]*).jpg/
        const match = image.match(re)
        const camera = match[1]
        const serial = match[2]
        const ts = match[3]
    
        const localFile = `serials/${serial}/camera${camera}/${ts}.jpg`
    
        console.log('imageToLocalFile, image:', image, ' localFile:', localFile)
        return localFile
    }

    const imageClick = (e,image) => {
        e.currentTarget.style.cursor='wait';
        setWaitCursorEl(e.currentTarget);
        const APIimage = imageToAPI(image)
        const imageUrl = image == '' 
        ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzjvTwY220WDaZMZ5BmegbXmN_dFNElObmP91YIjhVQWupZe7d2Au0NBqagSqgwB_41YQ&usqp=CAU' 
        : APIimage
      //  : 'https://gardyniotblob.blob.core.windows.net/iot-camera-image/' + image
    
        setImageUrl(imageUrl)

        const localFile = imageToLocalFileUrl(image)
        localFiles[image] = localFile
        setLocalFiles(localFiles)
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
 
    const camera1Files = []
    const camera2Files = []
    azureFiles.forEach ( (item, idx) => {
        const re = /_(\d*)\.jpg/ 
        const match = item.match(re)
        const ts = match[1]

        const sig = '     '
        schedule.forEach ( (item, idx) => {
            if (item.startTS <= ts && item.endTS >= ts) {
                sig = item.sig.padEnd(5)
            }
        })

        // console.log(ts)
        const d = new Date(ts * 1000)
        const localeTime = d.toLocaleTimeString()

        const localFile = localFiles[item]
        const style = {fontWeight:'600',  color: 'red'}
        const html = localFile 
        ?  <div style={style} onMouseEnter={(e) => setImageUrl('/' + localFile)}>
              {ts} {sig} {localeTime}    
           </div>
        :  <div key={idx} className={styles.imageLink} onClick={(e) => imageClick(e,item) }>
              {ts} {sig} {localeTime}
          </div>


        if (item.includes('camera1')) {
            camera1Files.push(html)
        } else {
            camera2Files.push(html)
        }

    })

    // A sample list of serials in timezone 133 that have schedules.
    const may1HTML = may1.map ( (item, idx) => {
        const link = `/schedule/${item}/2022-05-01`
        return <div key={idx}><a href={link}>{item}</a></div>
    })


    const timelapseLink = '/timelapse/' + serial

    return (
    <div className={styles.page}>
        <div className={styles.leftMargin}>
            <h3>Devices</h3>
            {may1HTML}
        </div>
        <div className={styles.leftSide}>
           
            <div className={styles.schedule}>
                <h3>Lighting Schedule Time Periods</h3>
                {scheduleHTML}
            </div>


            <div className={styles.azure_files}>
                <div className = {styles.camera_files}>
                    <h4>Camera 1</h4>
                {camera1Files}
                </div>
                <div className = {styles.camera_files}>
                    <h4>Camera 2</h4>
                {camera2Files}
                </div>
            </div>


            <div className={styles.scheduleRaw}>
                <h3>Lighting Schedule</h3>

                <a href={timelapseLink} target="_blank" rel="noreferrer">Timelapse Link</a>
                <br />
                {scheduleRaw}

            </div>
        </div>
        <div className={styles.rightSide}>
            <img className={styles.image} src={imageUrl} onLoad={imageLoaded}/>
            <br />
            {imageUrl}
        </div>
    </div>
    )
}

export default Schedule