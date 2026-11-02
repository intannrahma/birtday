export type VideoTemplate = 'a' | 'b' | 'c'

export interface VideoMemoryItem {
  id: string
  template: VideoTemplate
  label: string
  title: string
  description: string
  src: string
  poster: string
  caption: string
}

export interface MediaConfig {
  song: {
    title: string
    artist: string
    src: string
  }
  voice: {
    src: string
  }
  videos: VideoMemoryItem[]
}

export const mediaConfig: MediaConfig = {
  song: {
    title: 'Selamat Ulang Tahun',
    artist: 'Gellen — Acoustic Piano',
    src: '/audio/birthday-song.mp3',
  },
  voice: {
    src: '/audio/birthday-voice.mp3',
  },
  videos: [
    {
      id: 'video-memory-01',
      template: 'a',
      label: 'VIDEO MEMORY 01',
      title: 'The people around you',
      description: 'A few small fragments of your world. The people who grew up alongside you, the family who has always been there, the friends who have accompanied you on your journey, and the stories that will likely always remain a part of your life.',
      src: '/videos/video-memory-01.mp4',
      poster: '',
      caption: '',
    },
    {
      id: 'video-memory-02',
      template: 'b',
      label: 'VIDEO MEMORY 02',
      title: 'A day made for you.',
      description: 'Three years have passed, and I still remember those little moments, as well as your beautiful smile.',
      src: '/videos/video-memory-02.mp4',
      poster: '',
      caption: '',
    },
  ],
}
