import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openaikey = process.env.OPEN_AI_KEY;

const openai = new OpenAI({ apiKey: openaikey });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const file = JSON.stringify(req.body.data);
  const mode = req.body.mode;
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "you are a product analyzer assistant meant to predict based on the mode, use the data in the file to predict what the user will need",
      },
      {
        role: "assistant",
        content: mode,
      },
      {
        role: "user",
        content: file,
      },
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });
  if (response) {
    return res.status(200).json(response.choices[0].message.content);
  } else {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
