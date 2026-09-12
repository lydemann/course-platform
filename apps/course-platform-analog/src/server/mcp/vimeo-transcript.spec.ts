import { describe, expect, it } from 'vitest';

import { extractVimeoVideoId, webVttToText } from './vimeo-transcript';

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
