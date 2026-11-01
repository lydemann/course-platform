import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  extractVimeoVideoId,
  getVimeoTranscript,
  webVttToText,
} from './vimeo-transcript';

describe('Vimeo transcript helpers', () => {
  it.each([
    ['https://vimeo.com/123456789', '123456789'],
    ['https://player.vimeo.com/video/987654321?h=private', '987654321'],
    ['https://vimeo.com/channels/angular/24680', '24680'],
  ])('extracts a video ID from %s', (url, expected) => {
    expect(extractVimeoVideoId(url)).toBe(expected);
  });

  it('rejects non-Vimeo and malformed URLs', () => {
    expect(extractVimeoVideoId('https://example.com/video/123')).toBeNull();
    expect(extractVimeoVideoId('not a url')).toBeNull();
    expect(extractVimeoVideoId('https://evilvimeo.com/123')).toBeNull();
    expect(extractVimeoVideoId('http://vimeo.com/123')).toBeNull();
  });

  it('removes WebVTT timing, markup, cue numbers, and duplicate cues', () => {
    expect(
      webVttToText(`WEBVTT

1
00:00:00.000 --> 00:00:02.000
<v Speaker>Signals</v> are reactive.

2
00:00:02.000 --> 00:00:04.000
<v Speaker>Signals</v> are reactive.
Use computed values.
`),
    ).toBe('Signals are reactive.\nUse computed values.');
  });
});

describe('Vimeo transcript credentials', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('sends the API token only to the Vimeo API, not to the signed download URL', async () => {
    vi.stubEnv('VIMEO_ACCESS_TOKEN', 'test-token');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              {
                language: 'en',
                link: 'https://captions.example.com/signed.vtt',
              },
            ],
          }),
        ),
      )
      .mockResolvedValueOnce(new Response('WEBVTT\n\nA lesson transcript.'));
    vi.stubGlobal('fetch', fetchMock);
    await expect(
      getVimeoTranscript('https://vimeo.com/123'),
    ).resolves.toMatchObject({ status: 'available' });
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      'Bearer test-token',
    );
    expect(fetchMock.mock.calls[1]).toEqual([
      'https://captions.example.com/signed.vtt',
    ]);
  });
});
