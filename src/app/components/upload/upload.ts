import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UploadService, UploadProgress } from '../../services/upload';
import { VideoConverter, ConversionProgress } from '../../services/video-converter';
import { Subscription } from 'rxjs';

interface RecentUpload {
  name: string;
  url: string;
  timestamp: Date;
  type: string;
  size: number;
}

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload implements OnInit, OnDestroy {
  uploads: UploadProgress[] = [];
  conversions: ConversionProgress[] = [];
  recentUploads: RecentUpload[] = [];
  isDragOver = false;
  localIP = 'localhost'; // Will be updated with actual IP
  conversionInProgress = new Set<string>();
  
  private uploadSubscription?: Subscription;
  private conversionSubscription?: Subscription;

  constructor(
    private uploadService: UploadService,
    private videoConverter: VideoConverter,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getNetworkInfo();
    this.loadRecentUploads();
    
    // Subscribe to upload progress
    this.uploadSubscription = this.uploadService.uploadProgress$.subscribe(
      uploads => this.uploads = uploads
    );
    
    // Subscribe to conversion progress
    this.conversionSubscription = this.videoConverter.conversionProgress$.subscribe(
      conversion => this.updateConversion(conversion)
    );
  }

  ngOnDestroy(): void {
    this.uploadSubscription?.unsubscribe();
    this.conversionSubscription?.unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files);
    }
  }

  private handleFiles(files: FileList): void {
    this.uploadService.uploadFiles(files).subscribe();
  }

  copyToClipboard(): void {
    const url = `http://${this.localIP}:4200/upload`;
    navigator.clipboard.writeText(url).then(() => {
      // Could add a toast notification here
      console.log('URL copied to clipboard');
    });
  }

  convertVideo(upload: UploadProgress): void {
    if (!upload.file || !upload.serverFilename || this.conversionInProgress.has(upload.file.name)) {
      return;
    }

    this.conversionInProgress.add(upload.file.name);
    this.videoConverter.convertVideo(upload.serverFilename, upload.file.size).subscribe();
  }

  private updateConversion(conversion: ConversionProgress): void {
    const index = this.conversions.findIndex(c => c.filename === conversion.filename);
    if (index >= 0) {
      this.conversions[index] = conversion;
    } else {
      this.conversions.push(conversion);
    }
    
    if (conversion.status === 'completed' || conversion.status === 'error') {
      this.conversionInProgress.delete(conversion.filename);
    }
  }

  private getNetworkInfo(): void {
    this.uploadService.getNetworkInfo().subscribe({
      next: (info) => {
        this.localIP = info.ip;
      },
      error: (error) => {
        console.error('Failed to get network info:', error);
        this.localIP = 'localhost';
      }
    });
  }

  private loadRecentUploads(): void {
    this.uploadService.getFiles().subscribe({
      next: (files) => {
        this.recentUploads = files.map(file => ({
          name: file.name,
          url: file.url,
          timestamp: new Date(file.uploadedAt),
          type: file.mimetype || 'unknown',
          size: file.size
        })).slice(0, 10); // Show last 10 files
      },
      error: (error) => {
        console.error('Failed to load recent uploads:', error);
        // Fallback to mock data
        this.loadMockRecentUploads();
      }
    });
  }

  private loadMockRecentUploads(): void {
    // Mock recent uploads - fallback when backend is not available
    this.recentUploads = [
      {
        name: 'sample-video.mp4',
        url: '/uploads/sample-video.mp4',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        type: 'video/mp4',
        size: 52428800 // 50MB
      },
      {
        name: 'document.pdf',
        url: '/uploads/document.pdf',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        type: 'application/pdf',
        size: 1048576 // 1MB
      }
    ];
  }

  // Template helper methods
  trackByFile(index: number, upload: UploadProgress): string {
    return upload.file.name + upload.file.size;
  }

  getFileIcon(file: File): string {
    return this.uploadService.getFileIcon(file);
  }

  getFileIconForRecentUpload(upload: RecentUpload): string {
    const mockFile = { type: upload.type, name: upload.name } as File;
    return this.uploadService.getFileIcon(mockFile);
  }

  isVideoFile(file: File): boolean {
    return this.uploadService.isVideoFile(file);
  }

  formatFileSize(bytes: number): string {
    return this.videoConverter.formatFileSize(bytes);
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'uploading': return 'Uploading';
      case 'processing': return 'Processing';
      case 'completed': return 'Completed';
      case 'error': return 'Error';
      default: return status;
    }
  }

  getCompressionRatio(original: number, compressed: number): number {
    return this.videoConverter.getCompressionRatio(original, compressed);
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  // New methods for enhanced functionality
  formatFileDate(timestamp: number): string {
    const date = new Date(timestamp);
    const today = new Date();
    
    if (this.isToday(timestamp)) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
      });
    }
  }

  isToday(timestamp: number): boolean {
    const date = new Date(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  openUploadsFolder(): void {
    const baseUrl = this.getBaseUrl();
    this.http.post(`${baseUrl}/api/open-uploads-folder`, {}).subscribe({
      next: (response: any) => {
        console.log('Uploads folder opened successfully');
      },
      error: (error: any) => {
        console.error('Error opening uploads folder:', error);
        alert('Could not open uploads folder. Please check if the folder exists.');
      }
    });
  }

  openConvertsFolder(): void {
    const baseUrl = this.getBaseUrl();
    this.http.post(`${baseUrl}/api/open-converts-folder`, {}).subscribe({
      next: (response: any) => {
        console.log('Converts folder opened successfully');
      },
      error: (error: any) => {
        console.error('Error opening converts folder:', error);
        alert('Could not open converts folder. Please check if the folder exists.');
      }
    });
  }

  previewFile(upload: UploadProgress): void {
    if (upload.status !== 'completed' || !upload.url) {
      return;
    }

    const baseUrl = this.getBaseUrl();
    const fullUrl = `${baseUrl}${upload.url}`;
    
    if (this.isVideoFile(upload.file) || this.isImageFile(upload.file)) {
      // Open in a new window for preview
      window.open(fullUrl, '_blank');
    } else {
      // For other files, download them
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = upload.file.name;
      link.click();
    }
  }

  private isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  private getBaseUrl(): string {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:3000`;
    }
    return 'http://localhost:3000';
  }

  // New methods for enhanced recent uploads functionality
  getSortedRecentUploads(): RecentUpload[] {
    return [...this.recentUploads].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  isRecentToday(timestamp: Date): boolean {
    const date = new Date(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  previewRecentFile(upload: RecentUpload): void {
    const baseUrl = this.getBaseUrl();
    const fullUrl = `${baseUrl}${upload.url}`;
    
    if (this.isVideoFileByType(upload.type) || this.isImageFileByType(upload.type)) {
      window.open(fullUrl, '_blank');
    } else {
      this.downloadFile(upload);
    }
  }

  downloadFile(upload: RecentUpload): void {
    const baseUrl = this.getBaseUrl();
    const fullUrl = `${baseUrl}${upload.url}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = upload.name;
    link.click();
  }

  isVideoFileByType(type: string): boolean {
    return type.startsWith('video/');
  }

  isImageFileByType(type: string): boolean {
    return type.startsWith('image/');
  }

  convertRecentVideo(upload: RecentUpload): void {
    if (this.isConvertingFile(upload.name)) {
      return;
    }

    // Extract the server filename from the URL
    const serverFilename = upload.url.split('/').pop();
    if (!serverFilename) {
      console.error('Could not extract server filename from URL:', upload.url);
      return;
    }

    this.conversionInProgress.add(upload.name);
    this.videoConverter.convertVideo(serverFilename, upload.size).subscribe();
  }

  isConvertingFile(filename: string): boolean {
    return this.conversionInProgress.has(filename);
  }

  getConversionProgress(filename: string): number {
    const conversion = this.conversions.find(c => 
      c.filename.includes(filename.split('.')[0]) || 
      filename.includes(c.filename.split('-')[0])
    );
    return conversion ? conversion.progress : 0;
  }
}
