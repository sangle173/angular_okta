import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface ConversionProgress {
  filename: string;
  progress: number;
  status: 'pending' | 'converting' | 'completed' | 'error';
  originalSize: number;
  compressedSize?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoConverter {
  private conversionProgress = new Subject<ConversionProgress>();
  public conversionProgress$ = this.conversionProgress.asObservable();
  private baseUrl = this.getBaseUrl();

  constructor(private http: HttpClient) {}

  private getBaseUrl(): string {
    // Get the current hostname from the browser
    const hostname = window.location.hostname;
    
    // If accessing via network IP, use network IP for backend
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:3000/api`;
    }
    
    // Default to localhost for local access
    return 'http://localhost:3000/api';
  }

  convertVideo(filename: string, originalSize: number): Observable<ConversionProgress> {
    const progress: ConversionProgress = {
      filename,
      progress: 0,
      status: 'pending',
      originalSize
    };

    // Start conversion
    this.conversionProgress.next({ ...progress, status: 'converting' });

    // Call backend API to start HandBrake conversion
    this.http.post(`${this.baseUrl}/convert-video`, { filename }).subscribe({
      next: (response: any) => {
        this.conversionProgress.next({
          ...progress,
          status: 'completed',
          progress: 100,
          compressedSize: response.compressedSize
        });
      },
      error: (error) => {
        console.error('Video conversion error:', error);
        this.conversionProgress.next({
          ...progress,
          status: 'error',
          error: error.message || 'Video conversion failed'
        });
      }
    });

    return this.conversionProgress$;
  }

  getCompressionRatio(original: number, compressed: number): number {
    return Math.round((1 - compressed / original) * 100);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
