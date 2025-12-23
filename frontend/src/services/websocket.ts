import { io, Socket } from 'socket.io-client';
import type { ScanProgress } from '../types';

class WebSocketService {
  private socket: Socket | null = null;

  private getWebSocketUrl(): string {
    // In production, usa la stessa origine della pagina
    if (import.meta.env.PROD) {
      return window.location.origin;
    }

    // In development, usa l'URL del backend configurato o localhost:3000
    return import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  }

  connect() {
    if (this.socket?.connected) return;

    const wsUrl = this.getWebSocketUrl();
    console.log('Connecting to WebSocket:', wsUrl);

    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
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
