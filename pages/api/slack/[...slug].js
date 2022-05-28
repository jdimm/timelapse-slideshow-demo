const { IncomingWebhook } = require('@slack/webhook');

const postToSlack = async (serial, imgUrl) => {
    const url = process.env.SLACK_WEBHOOK_URL;
    const webhook = new IncomingWebhook(url);

    const text = `<http://13.90.210.214:3000/slideshow/${serial}>`
    const attachments = [{
        type: 'image',
        title: serial,
        image_url: imgUrl,
        alt_text: ''
    }]

    //console.log('postToSlack: ', text, attachments)

    await webhook.send({
        text: text,
        attachments: attachments
      });
}


export default async (req, res) => {
    const {
		query: { slug },
	} = req;

    console.log('post to slack')
    const serial = slug[0] 
    const imgUrl = slug[1]
    postToSlack(serial, imgUrl)

    const response = {'status': 'ok'}
    res.setHeader('Content-Type', 'application/json');
    res.json(response)
}  

