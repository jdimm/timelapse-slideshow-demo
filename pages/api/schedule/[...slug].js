import executeQuery from '../../../util/db'

const getSchedule = async (device_id, day) => {

    const query = `
    select ds.schedule, d.timezone, d.serial
    from device_schedule as ds
    join device as d on d.id = ds.device_id
    where sensor_type = 1
    and device_id=${device_id}
    `
    const results = await executeQuery({
        query: query,
        values: [],
    });

    return results
    // return extractSchedule(results, day)
}

export default async (req, res) => {
    const {
		query: { slug },
	} = req;

    const device_id = slug[0]
    const date = slug[1]

    const schedule = await getSchedule(device_id, date)
    // const ranges = extractSchedule(schedule, date)
    
    res.setHeader('Content-Type', 'application/json');
    res.json(schedule)
}


