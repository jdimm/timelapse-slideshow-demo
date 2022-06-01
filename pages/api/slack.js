const { IncomingWebhook } = require('@slack/webhook');

const postToSlack = async (serial, imgUrl, message) => {
    const url = process.env.SLACK_WEBHOOK_URL;
    const webhook = new IncomingWebhook(url);
    const link = `http://13.90.210.214:3000/slideshow/${serial}|${serial}`

    const text= `${message} \n <${link}>`
    const attachments = [{
        type: 'image',
        title: serial,
        image_url: imgUrl,
        image_link: link,
        alt_text: ''
    }]

  //console.log(`postToSlack: text`, text)
  //console.log(`postToSlack: attachements`, attachments)
  //return

    await webhook.send({
        attachments: attachments,
        text: text
    });
}

const SlackPost = async (req, res) => {
    // console.log("req:", req.body)

    const serial = req.body.serial
    const imgUrl = req.body.imgUrl
    const message = req.body.message
    postToSlack(serial, imgUrl, message)

    const response = {'status': 'ok'}
    res.setHeader('Content-Type', 'application/json');
    res.json(response)
} 

export default SlackPost