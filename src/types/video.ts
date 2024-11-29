export interface VideoDetails {
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
}

export interface VideoSummary {
  videoDetails: VideoDetails;
  summary: string;
}