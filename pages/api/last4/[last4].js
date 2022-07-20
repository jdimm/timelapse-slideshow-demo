import executeQuery from '../../../util/db'

const getSerialFromLast4 = async (last4) => {

    const query = `
    select d.serial
    from device as d
    where d.serial like '%${last4}'
    ;
    `
    const results = await executeQuery({
        query: query,
        values: [],
    });

    // console.log("schedule results", results)
    return results
}

const last4 = async (req, res) => {
    const {
        query: { last4 },
    } = req;

    const serial = await getSerialFromLast4(last4)
    console.log("last4 serial", serial)

    res.setHeader('Content-Type', 'application/json');
    res.json(serial[0])
}

export default last4