import { getUserInfo } from "../../../util/db";

const userInfo = async (req, res) => {
    const {
        query: { serial },
    } = req;

    const userInfo = await getUserInfo(serial)

    res.setHeader('Content-Type', 'application/json');
    res.json(userInfo)
}

export default userInfo