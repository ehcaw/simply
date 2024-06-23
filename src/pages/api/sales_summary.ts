// /pages/api/sales_summary.ts

import type { NextApiRequest, NextApiResponse } from 'next';

type SalesSummary = {
  drink_name: string;
  total_quantity_sold: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Please provide a month parameter' });
  }

  try {
    const monthInt = parseInt(month as string);
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).json({ error: 'Month must be an integer between 1 and 12' });
    }

    const response = await fetch(`http://localhost:5000/sales_summary?month=${month}`);
    const data: SalesSummary[] = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching data from Flask API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
