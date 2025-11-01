const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
}));




const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })


app.post("/prompt", async (req, res) => {
    try {
        const result = await openAi.responses.create({
            model: "gpt-4o-mini",
            input: req?.body?.prompt
        });
        const output = result.output[0].content[0].text;

        res.json({ reply: output });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/image-prompt', async (req, res) => {


    const { imageUrl, prompt } = req?.body
    console.log(imageUrl)
    const response = await openAi.responses.create({
        model: "gpt-4o-mini",
        input: [{
            "role": "user",
            "content": [
                { "type": "input_text", "text": prompt ? prompt : 'image_tar_topics ki' },
                {
                    "type": "input_image",
                    "image_url": imageUrl,
                },
            ],
        }],
    });





    console.log("image descripbe", response)
    res.json({ response })

})

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server is running on ${port}`)
})