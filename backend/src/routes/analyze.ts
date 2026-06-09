import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const router = Router();

router.post('/analyze', (req, res) => {
  const { fileId } = req.body;

  if (!fileId) {
    return res.status(400).json({ error: 'fileId is required' });
  }

  // Look for the file in the temp directory
  const tempDir = path.join(__dirname, '../../temp');
  const pdfPath = path.join(tempDir, `${fileId}.pdf`);

  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({ error: 'PDF file not found' });
  }

  const pythonScript = path.join(__dirname, '../../python/main.py');
  
  const pythonExecutable = path.join(__dirname, '../../python/venv/bin/python');
  
  // Call Python script
  const pythonProcess = spawn(pythonExecutable, [pythonScript, pdfPath], {
    env: {
      ...process.env,
    }
  });

  let dataString = '';
  let errorString = '';

  pythonProcess.stdout.on('data', (data) => {
    dataString += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorString += data.toString();
    console.error('Python Error:', data.toString());
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error('Python script exited with code', code);
      return res.status(500).json({ 
        error: 'Failed to analyze document',
        details: errorString 
      });
    }

    try {
      // Find the first occurrence of '{' which is where the JSON payload begins 
      // (in case there are any printed warnings before the JSON output)
      const jsonStart = dataString.indexOf('{');
      if (jsonStart === -1) {
         throw new Error('No JSON object found in output');
      }
      
      const cleanJsonStr = dataString.substring(jsonStart);
      const parsedData = JSON.parse(cleanJsonStr);

      if (parsedData.error) {
        return res.status(500).json({ error: parsedData.error });
      }

      res.json(parsedData);
    } catch (e: any) {
      console.error('Failed to parse Python output:', e);
      console.log('Raw output was:', dataString);
      res.status(500).json({ error: 'Invalid response from analysis engine', details: dataString });
    }
  });
});

export default router;
