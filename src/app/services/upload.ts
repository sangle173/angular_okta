import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  url?: string;
  error?: string;
  serverFilename?: string; // Add this to store the server-generated filename
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private uploadProgress = new BehaviorSubject<UploadProgress[]>([]);
  public uploadProgress$ = this.uploadProgress.asObservable();
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

  uploadFiles(files: FileList): Observable<UploadProgress[]> {
    const uploads: UploadProgress[] = Array.from(files).map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));

    this.uploadProgress.next(uploads);

    // Process each file
    uploads.forEach((upload, index) => {
      this.uploadSingleFile(upload, index);
    });

    return this.uploadProgress$;
  }

  private uploadSingleFile(upload: UploadProgress, index: number): void {
    const formData = new FormData();
    formData.append('file', upload.file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    upload.status = 'uploading';
    this.updateProgress(index, upload);

    this.http.request(req).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / (event.total || 1));
          upload.progress = progress;
          this.updateProgress(index, upload);
        } else if (event instanceof HttpResponse) {
          upload.status = 'completed';
          upload.progress = 100;
          upload.url = (event.body as any)?.url;
          upload.serverFilename = (event.body as any)?.filename; // Store server filename
          this.updateProgress(index, upload);
        }
      },
      error: (error) => {
        upload.status = 'error';
        upload.error = error.message;
        this.updateProgress(index, upload);
      }
    });
  }

  private updateProgress(index: number, upload: UploadProgress): void {
    const current = this.uploadProgress.value;
    current[index] = { ...upload };
    this.uploadProgress.next([...current]);
  }

  getNetworkInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/network-info`);
  }

  getFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/files`);
  }

  isVideoFile(file: File): boolean {
    const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    return videoTypes.includes(file.type) || 
           /\.(mp4|mov|avi)$/i.test(file.name);
  }

  getFileIcon(file: File): string {
    if (this.isVideoFile(file)) return '🎥';
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.includes('pdf')) return '📄';
    if (file.type.includes('text')) return '📝';
    return '📁';
  }
}
