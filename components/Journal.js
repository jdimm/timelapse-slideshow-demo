import { useEffect, useState } from 'react'
import Slideshow from '../components/Slideshow'
import styles from './Journal.module.css'

const Journal = ( {journal, updateMemory, deleteMemory} ) => {
    if (!journal)
        return null

    useEffect(() => {
        journal.forEach ( (entry, index) => {
            entry.index = index
        })
    }, [journal])

    const onBlur = (e, entry) => {
        e.preventDefault()
        entry.caption = e.target.textContent
        updateMemory(journal)
    }

    const onClick = (e, entry) => {
        e.preventDefault()
        deleteMemory(entry.index)
    }

    const sorted = [...journal]

    sorted.sort ( function (a, b) { 
      return parseInt(a.t0) - parseInt(b.t0)
    } )

    const html = journal.map((entry, index) => {
        const camera = 1
        const segment = 'first'
        return (<div key={entry.index}>
  
                    <div className={styles.journal_slideshow_holder}>
                        <Slideshow serial={entry.serial} camera={camera} segment={segment} method={'azure-small'} layout='journal' t0={entry.t0} t1={entry.t1}/> 
                    </div>
                    <div contentEditable={true} className={styles.journal_entry} placeholder="notes"
                      onBlur={ (e) => onBlur(e, entry)}>
                      {entry.caption}
                    </div>
                    <button className={styles.close_button} onClick={(e) => onClick(e, entry)} title="delete memory and caption">x</button>
                </div>
        )
    })

    return <div style={{clear:"both"}}>
        <h1>Journal</h1>
        <div className={styles.journal}>
            {html}
        </div>
    </div>
}

export default Journal