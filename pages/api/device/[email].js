import executeQuery from '../../../util/db'

const getDeviceFromEmail = async (email) => {

    const query = `
    select u.email, u.name, u.id as user_id, d.id as device_id, d.serial
    from user as u
    join device as d on d.user_id = u.id
    where u.email like '${email}%'
    limit 10
    `
    const results = await executeQuery({
        query: query,
        values: [],
    });

    // console.log("schedule results", results)
    return results
}

const DeviceFromEmail = async (req, res) => {
    const {
        query: { email },
    } = req;

    const device = await getDeviceFromEmail(email)

    res.setHeader('Content-Type', 'application/json');
    res.json(device)
}

export default DeviceFromEmail