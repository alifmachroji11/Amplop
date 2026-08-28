import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { CATEGORIES } from './categories';
import type { ParseResult } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const parseResultSchema = z
  .object({
    merchant: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    amount: z.number().nonnegative(),
    direction: z.enum(['in', 'out']),
    category: z.enum(CATEGORIES),
    confidence: z.number().min(0).max(1),
    blurry: z.boolean(),
  })
  .refine((val) => (val.category === 'Pemasukan') === (val.direction === 'in'), {
    message: 'category and direction disagree on income vs expense',
    path: ['category'],
  });

const PROMPT = `You are reading a screenshot of a bank transfer confirmation, e-wallet notification, or m-banking transaction screen (Indonesian apps like GoPay, OVO, DANA, BCA, QRIS, etc).

Extract the single transaction shown and respond with ONLY a JSON object matching exactly this shape:
{
  "merchant": string,       // who was paid, or who sent money (short name)
  "date": string,           // ISO date "YYYY-MM-DD" of the transaction; if year is missing, assume the current year
  "amount": number,         // absolute transaction amount, no currency symbol, no separators
  "direction": "in" | "out",// "in" if money received, "out" if money paid/sent
  "category": one of ${JSON.stringify(CATEGORIES)},
  "confidence": number,     // 0 to 1, how confident you are in this extraction
  "blurry": boolean         // true if the image is too blurry/unclear to reliably read
}

If the image is too blurry or doesn't contain a readable transaction, set "blurry": true and make a best-effort guess for the other fields with low "confidence".`;

export async function parseScreenshot(
  imageBase64: string,
  mimeType: string
): Promise<ParseResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: PROMPT },
        ],
      },
    ],
    config: {
      responseMimeType: 'application/json',
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gemini did not return text content');
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON object found in Gemini response');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return parseResultSchema.parse(parsed);
}
