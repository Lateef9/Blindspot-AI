import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

router.post('/chat', async (req, res) => {
  try {
    const { report, message } = req.body;

    if (!report || !message) {
      return res.status(400).json({ error: 'Report and message are required' });
    }

    const openai = new OpenAI(); // Automatically uses process.env.OPENAI_API_KEY

    const systemPrompt = `You are a helpful assistant answering questions based strictly on the provided Investment Analysis Report. 
Do not use any outside knowledge or the original PDF. If the answer is not in the report, politely say "I cannot answer this based on the provided report."

Report Context:
${JSON.stringify(report, null, 2)}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Using 4o for accurate reasoning based on context
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.2, // Keep it focused on the context
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during chat' });
  }
});

export default router;
