import { Server, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { User, IUser } from './models/user.model';

const wsUserMap = new WeakMap<WebSocket, IUser>();

export function setupWebSocket(server: any) {
  const wss = new Server({ server });

  wss.on('connection', async (ws, req) => {
    const token = req.url?.split('token=')[1];
    if (!token) return ws.close();
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
      const user = await User.findById(decoded.id);
      if (!user) return ws.close();
      wsUserMap.set(ws, user);
      ws.send(JSON.stringify({ type: 'welcome', user: { id: user._id, role: user.role } }));
    } catch {
      ws.close();
    }
  });

  // Optionally, export a function to get the user for a ws connection
  (wss as any).getUser = (ws: WebSocket) => wsUserMap.get(ws);

  return wss;
}
