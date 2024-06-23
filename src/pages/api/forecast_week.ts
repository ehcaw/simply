// /pages/api/forecast_week.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type ForecastResult = {
  ingredient_id: number;
  ingredient_name: string;
  total_predicted_quantity: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Please provide a date parameter' });
  }

  try {
    const response = await fetch(`http://localhost:5000/forecast_week?date=${date}`);
    const data: ForecastResult[] = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching data from Flask API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
