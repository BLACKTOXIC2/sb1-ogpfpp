interface VideoDetails {
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
}

export async function fetchVideoDetails(videoId: string): Promise<VideoDetails> {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;

    // Convert ISO 8601 duration to readable format
    const duration = contentDetails.duration
      .replace('PT', '')
      .replace('H', ' hours ')
      .replace('M', ' minutes ')
      .replace('S', ' seconds')
      .toLowerCase();

    return {
      title: snippet.title,
      description: snippet.description,
      duration,
      thumbnailUrl: snippet.thumbnails.high.url
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
}