import { readServerEnv } from './config';

interface VimeoTextTrack {
  active?: boolean;
  display_language?: string;
  download_links?: {
    vtt?: string;
  };
  language?: string;
  link?: string;
}

interface VimeoTextTrackResponse {
  data?: VimeoTextTrack[];
}

export interface VimeoTranscriptResult {
  status: 'available' | 'not_found' | 'unavailable';
  language?: string;
  text?: string;
  truncated?: boolean;
  reason?: string;
}

export async function getVimeoTranscript(
  videoUrl: string,
  options: { language?: string; maxCharacters?: number } = {},
): Promise<VimeoTranscriptResult> {
  const accessToken = readServerEnv('VIMEO_ACCESS_TOKEN');
  if (!accessToken) {
    return {
      status: 'unavailable',
      reason: 'VIMEO_ACCESS_TOKEN is not configured on the server.',
    };
  }

  const videoId = extractVimeoVideoId(videoUrl);
  if (!videoId) {
    return {
      status: 'not_found',
      reason: 'The lesson does not contain a recognized Vimeo video URL.',
    };
  }

  const tracksUrl = new URL(
    `/videos/${encodeURIComponent(videoId)}/texttracks`,
    'https://api.vimeo.com',
  );
  tracksUrl.searchParams.set(
    'fields',
    'active,language,display_language,download_links,link',
  );

  const tracksResponse = await fetch(tracksUrl, {
    headers: {
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!tracksResponse.ok) {
    return {
      status: 'unavailable',
      reason: `Vimeo text-track lookup failed with status ${tracksResponse.status}.`,
    };
  }

  const payload = (await tracksResponse.json()) as VimeoTextTrackResponse;
  const track = selectTrack(payload.data ?? [], options.language);
  const downloadUrl = track?.download_links?.vtt ?? track?.link;

  if (!track || !downloadUrl) {
    return {
      status: 'not_found',
      reason: 'No downloadable text track is available for this video.',
    };
  }

  const transcriptResponse = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!transcriptResponse.ok) {
    return {
      status: 'unavailable',
      reason: `Vimeo transcript download failed with status ${transcriptResponse.status}.`,
    };
  }

  const transcript = webVttToText(await transcriptResponse.text());
  const maxCharacters = Math.min(
    Math.max(options.maxCharacters ?? 50_000, 1_000),
    100_000,
  );
  const truncated = transcript.length > maxCharacters;

  return {
    status: 'available',
    language: track.language ?? track.display_language,
    text: truncated ? transcript.slice(0, maxCharacters) : transcript,
    truncated,
  };
}

export function extractVimeoVideoId(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl);
    if (!url.hostname.endsWith('vimeo.com')) {
      return null;
    }

    const segments = url.pathname.split('/').filter(Boolean);
    const videoSegmentIndex = segments.indexOf('video');
    const candidate =
      videoSegmentIndex >= 0
        ? segments[videoSegmentIndex + 1]
        : segments.find((segment) => /^\d+$/.test(segment));

    return candidate && /^\d+$/.test(candidate) ? candidate : null;
  } catch {
    return null;
  }
}

export function webVttToText(webVtt: string): string {
  const textLines = webVtt
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(
      (line) =>
        line &&
        line !== 'WEBVTT' &&
        !line.startsWith('NOTE') &&
        !line.includes('-->') &&
        !/^\d+$/.test(line),
    )
    .map((line) => line.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' '));

  return textLines
    .filter((line, index) => line !== textLines[index - 1])
    .join('\n');
}

function selectTrack(
  tracks: VimeoTextTrack[],
  requestedLanguage?: string,
): VimeoTextTrack | undefined {
  const normalizedLanguage = requestedLanguage?.toLocaleLowerCase();
  if (normalizedLanguage) {
    const languageMatch = tracks.find(
      (track) =>
        track.language?.toLocaleLowerCase() === normalizedLanguage ||
        track.display_language?.toLocaleLowerCase() === normalizedLanguage,
    );
    if (languageMatch) {
      return languageMatch;
    }
  }

  return tracks.find((track) => track.active) ?? tracks[0];
}
