const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/download', async (req, res) => {
	const videoLink = req.body.videolink;

	try {
		const info = await ytdl.getInfo(videoLink);
		const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highest' });
		const videoTitle = ytdl.getVideoID(videoLink) + '.' + videoFormat.container;

		res.header('Content-Disposition', `attachment; filename="${videoTitle}"`);
		ytdl(videoLink, { format: videoFormat }).pipe(res);
	} catch (err) {
		res.status(500).send('An error occurred while downloading the video.');
	}
});

const port = 5000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
