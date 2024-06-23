import OpenAI from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const openaikey = process.env.OPEN_AI_KEY;

const openai = new OpenAI({ apiKey: openaikey });

function csvToJson(csvString: string) {
  const rows = csvString.split("\n");

  const headers = rows[0].split(",");

  const jsonData = [];
  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(",");

    const obj: { [key: string]: string } = {};

    for (let j = 0; j < headers.length; j++) {
      const key = headers[j].trim();
      const value = values[j].trim();

      obj[key] = value;
    }

    jsonData.push(obj);
  }
  return JSON.stringify(jsonData);
}

async function formatCsvForPayload(csvString: string) {
  let formattedCsv = csvString.replace(/"/g, '\\"');
  // Then, replace newlines with \n to format the entire CSV as a single line string
  formattedCsv = formattedCsv.replace(/\n/g, "\\n");
  // Return the formatted CSV string
  return formattedCsv;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const formattedCsv = await formatCsvForPayload(req.body.file);
  console.log(formattedCsv);
  const file = csvToJson(formattedCsv);
  const mode = req.body.mode;
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "you are a product analyzer assistant meant to predict based on the mode, use the data in the file to predict what the user will need in a json format",
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
