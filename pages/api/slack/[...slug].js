import fetch from 'node-fetch'
const { IncomingWebhook } = require('@slack/webhook');

const postToSlack = async (serial) => {
    const url = 'https://hooks.slack.com/services/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'

    // Read a url from the environment variables
    // const url = process.env.SLACK_WEBHOOK_URL;

    // Initialize
    const webhook = new IncomingWebhook(url);
    const text = `<http://13.90.210.214:3000/slideshow/${serial}>`

    await webhook.send({
        text: text,
      });
}


export default async (req, res) => {
    const {
		query: { slug },
	} = req;

    console.log('post to slack')
    const serial = slug[0] 
    postToSlack(serial)

    const response = {'status': 'ok'}
    res.setHeader('Content-Type', 'application/json');
    res.json(response)
}  

