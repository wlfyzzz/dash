import fs from 'fs';
import path from 'path';

interface ErrorLog {
  timestamp: string;
  message: string;
  stack: string;
}

export async function POST(request: Request) {
  const { message, stack } = await request.json();
  
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    message,
    stack
  };
  
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, 'errors.json');

  // Ensure the log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Read existing logs or create an empty array
  let logs: ErrorLog[] = [];
  if (fs.existsSync(logFile)) {
    const fileContent = fs.readFileSync(logFile, 'utf-8');
    logs = JSON.parse(fileContent);
  }

  // Add new log entry
  logs.push(errorLog);

  // Write updated logs back to file
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
