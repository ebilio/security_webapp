import { io, Socket } from 'socket.io-client';
import type { ScanProgress } from '../types';

class WebSocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io('http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  startScan() {
    this.socket?.emit('scan:start');
  }

  onProgress(callback: (progress: ScanProgress) => void) {
    this.socket?.on('scan:progress', callback);
  }

  onComplete(callback: () => void) {
    this.socket?.on('scan:complete', callback);
  }

  onError(callback: (error: { message: string }) => void) {
    this.socket?.on('scan:error', callback);
  }

  removeListeners() {
    this.socket?.off('scan:progress');
    this.socket?.off('scan:complete');
    this.socket?.off('scan:error');
  }
}

export const wsService = new WebSocketService();
