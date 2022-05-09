import executeQuery from '../../../util/db'

const getSchedule = async (serial, day) => {

    const query = `
    select ds.schedule, d.timezone, d.serial
    from device_schedule as ds
    join device as d on d.id = ds.device_id
    where sensor_type = 1
    and d.serial = '${serial}'
    `
    const results = await executeQuery({
        query: query,
        values: [],
    });

    // console.log("schedule results", results)
    return results
}

export default async (req, res) => {
    const {
		query: { slug },
	} = req;

    const serial = slug[0]
    const date = slug[1]

    const schedule = await getSchedule(serial, date)
    
    res.setHeader('Content-Type', 'application/json');
    res.json(schedule)
}


