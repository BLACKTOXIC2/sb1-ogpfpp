import axios from 'axios';
import { VideoDetails } from '../types/video';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function fetchVideoDetails(videoId: string): Promise<VideoDetails> {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        id: videoId,
        part: 'snippet,contentDetails',
        key: API_KEY
      }
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = response.data.items[0];
    const { snippet, contentDetails } = video;

    // Convert ISO 8601 duration to readable format
    const duration = contentDetails.duration
      .replace('PT', '')
      .replace(/(\d+)H/, '$1 hours ')
      .replace(/(\d+)M/, '$1 minutes ')
      .replace(/(\d+)S/, '$1 seconds')
      .trim();

    return {
      title: snippet.title,
      description: snippet.description,
      duration,
      thumbnailUrl: snippet.thumbnails.high.url,
      channelTitle: snippet.channelTitle,
      publishedAt: new Date(snippet.publishedAt).toLocaleDateString()
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('YouTube API quota exceeded or invalid API key');
      }
      if (error.response?.status === 404) {
        throw new Error('Video not found');
      }
    }
    throw new Error('Failed to fetch video details');
  }
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#&?]{11})/,
    /^[^#&?]{11}$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}