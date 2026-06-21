'use server';
/**
 * @fileOverview An AI assistant that provides advice on auspicious times for events
 * based on Vietnamese astrological data.
 *
 * - aiAuspiciousEventAdvisor - A function that handles the auspicious event advising process.
 * - AIAuspiciousEventAdvisorInput - The input type for the aiAuspiciousEventAdvisor function.
 * - AIAuspiciousEventAdvisorOutput - The return type for the aiAuspiciousEventAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIAuspiciousEventAdvisorInputSchema = z.object({
  question: z.string().describe('The user\'s question about auspicious times for an event.'),
  currentDate: z.string().describe('The current Gregorian date in YYYY-MM-DD format.'),
  lunarDate: z.string().describe('The current Vietnamese Lunar date.'),
  canChiDay: z.string().describe('Can Chi for the current day.'),
  canChiMonth: z.string().describe('Can Chi for the current month.'),
  canChiYear: z.string().describe('Can Chi for the current year.'),
  fiveElements: z.string().describe('Five Elements (Ngũ Hành) for the current day.'),
  tietKhi: z.string().describe('Current seasonal term (Tiết Khí).'),
  trucNgay: z.string().describe('Trực Ngày for the current day.'),
  goodDayStatus: z.string().describe('General status if the day is good or bad.'),
  auspiciousHours: z.array(z.string()).describe('List of auspicious hours for the current day.'),
  inauspiciousHours: z.array(z.string()).describe('List of inauspicious hours for the current day.'),
});
export type AIAuspiciousEventAdvisorInput = z.infer<typeof AIAuspiciousEventAdvisorInputSchema>;

const AIAuspiciousEventAdvisorOutputSchema = z.object({
  answer: z.string().describe('A detailed answer to the user\'s question, explaining auspiciousness based on Vietnamese astrological data.'),
  isAuspicious: z
    .boolean()
    .describe('True if the general context is auspicious for the type of event asked, false otherwise.'),
  reasons: z.array(z.string()).describe('List of astrological reasons supporting the answer.'),
  suggestions: z
    .array(z.string())
    .optional()
    .describe('Optional suggestions for alternative dates or times if the current context is not auspicious.'),
});
export type AIAuspiciousEventAdvisorOutput = z.infer<typeof AIAuspiciousEventAdvisorOutputSchema>;

export async function aiAuspiciousEventAdvisor(
  input: AIAuspiciousEventAdvisorInput
): Promise<AIAuspiciousEventAdvisorOutput> {
  return aiAuspiciousEventAdvisorFlow(input);
}

const aiAuspiciousEventAdvisorPrompt = ai.definePrompt({
  name: 'aiAuspiciousEventAdvisorPrompt',
  input: {schema: AIAuspiciousEventAdvisorInputSchema},
  output: {schema: AIAuspiciousEventAdvisorOutputSchema},
  prompt: `You are an expert in Vietnamese traditional astrology and calendar (Lịch Âm Việt Nam), specifically an AI assistant for An Lạc Calendar. Your goal is to provide insightful and personalized advice on the auspiciousness of dates and times for various events based on comprehensive Vietnamese astrological data.

Carefully analyze the provided information for the current context (or a specific date if the user's question implies one).

Here is the current astrological data:
- Gregorian Date: {{{currentDate}}}
- Lunar Date: {{{lunarDate}}}
- Can Chi (Day): {{{canChiDay}}}
- Can Chi (Month): {{{canChiMonth}}}
- Can Chi (Year): {{{canChiYear}}}
- Five Elements (Ngũ Hành): {{{fiveElements}}}
- Seasonal Term (Tiết Khí): {{{tietKhi}}}
- Trực Ngày: {{{trucNgay}}}
- General Day Status: {{{goodDayStatus}}}
- Auspicious Hours: {{#each auspiciousHours}}
- {{this}}
{{/each}}
- Inauspicious Hours: {{#each inauspiciousHours}}
- {{this}}
{{/each}}

User's Question: "{{{question}}}"

Based on the astrological data and the user's question, determine if the current context (or any implicitly asked date/time) is auspicious for the type of event mentioned. Provide a detailed explanation, citing specific astrological elements that support your conclusion. If the context is not auspicious, suggest alternative approaches or what to look for in an auspicious time/day.

Format your response strictly as a JSON object matching the following schema, including the 'isAuspicious', 'reasons', and 'suggestions' fields.`,
});

const aiAuspiciousEventAdvisorFlow = ai.defineFlow(
  {
    name: 'aiAuspiciousEventAdvisorFlow',
    inputSchema: AIAuspiciousEventAdvisorInputSchema,
    outputSchema: AIAuspiciousEventAdvisorOutputSchema,
  },
  async input => {
    const {output} = await aiAuspiciousEventAdvisorPrompt(input);
    return output!;
  }
);
