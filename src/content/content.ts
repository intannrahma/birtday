import { mediaConfig, type VideoMemoryItem } from '../data/media'

export interface ExperienceContent {
  opening: {
    eyebrow: string
    date: string
    title: string
    description: string
    button: string
    hint: string
  }
  greeting: {
    label: string
    headline: string
    body: string[]
  }
  memories: {
    label: string
    heading: string
    intro: string
    videos: VideoMemoryItem[]
  }
  closing: {
    label: string
    heading: string
    paragraphs: string[]
  }
  finale: {
    label: string
    heading: string
    message: string[]
    final: string
  }
  meta: {
    songTitle: string
    songArtist: string
    songSrc: string
  }
}

export const defaultContent: ExperienceContent = {
  opening: {
    eyebrow: 'A LITTLE SOMETHING FOR YOU',
    date: '03.11.2026',
    title: 'Happy Birthday',
    description: 'Ruang kecil yang aku bikin khusus buat hari kamu.',
    button: 'Open your gift',
    hint: 'TAKE YOUR TIME',
  },
  greeting: {
    label: 'CHAPTER 01 — YOUR DAY',
    headline: 'Happy birthday.',
    body: [
      'Hari ini, hari spesial buat kamu, hari di mana usia kamu bertambah.',
      'Semoga di umur baru kamu ini, kamu selalu diberikan kebahagiaan dan kesehatan.',
      'Semoga segala urusan kamu dipermudah, apa yang kamu impikan tercapai, dan selalu dikelilingi orang-orang yang sayang sama kamu.',
      'Selamat ulang tahun yaa. Semoga di babak baru kehidupan ini, kamu memiliki banyak alasan untuk selalu tersenyum.🤍'
],
  },
  memories: {
    label: 'CHAPTER 02 — VIDEO MEMORIES',
    heading: 'Moments, in motion.',
    intro: 'Beberapa video kenangan yang aku simpan buat kamu.',
    videos: mediaConfig.videos,
  },
  closing: {
    label: 'CHAPTER 03 — THANK YOU & SORRY',
    heading: 'Makasih ya, udah pernah ada di hidup aku.',
    paragraphs: [
      'Makasih yaa, sudah pernah ada dalam hidupku.',
      'Makasih sudah pernah hadir dan menjadi bagian dari hidupku sejak 2023. Makasih buat waktu, cerita, kebahagiaan, kasih sayang, dan hal-hal sederhana yang pernah kita lewati bersama.',
      'Makasih juga sudah mengajari aku banyak hal. Kamu laki-laki terbaik yang pernah aku temui.',
      'Aku tahu perjalanan kamu nggak mudah. Banyak luka, trauma, dan tangis yang pernah kamu lewati. Aku bangga sama semua usaha kamu, aku bangga sama semua pencapaian kamu.',
      'Aku minta maaf pernah jadi luka yang sangat besar dalam hidup kamu. Maaf telah menghancurkan segalanya. Aku tahu kata maaf nggak akan pernah cukup untuk kesalahan yang aku lakukan.',
      'Apa pun yang terjadi nanti, aku selalu bersyukur pernah mengenal kamu.'
],
  },
  finale: {
    label: 'CHAPTER 04 — A PRAYER FOR YOU',
    heading: 'Semoga semua hal baik selalu datang ke kamu.',
    message: [
      'Di umur kamu yang sekarang, aku ingin kamu sehat, bahagia, sukses, dan dipermudah semua urusan kamu.',
      'Semoga kamu selalu dikelilingi orang-orang yang benar-benar tulus sayang sama kamu, dan selalu bahagia bersama siapa pun kamu nantinya.',
      'Selamat ulang tahun yaa. Semoga kamu selalu baik-baik aja.',

      'I love you, and I never stop loving youu.'
],
    final: 'I love you, and I never stop loving you.',
  },
  meta: {
    songTitle: mediaConfig.song.title,
    songArtist: mediaConfig.song.artist,
    songSrc: mediaConfig.song.src,
  },
}

export const chapterOrder = [
  'greeting',
  'memories',
  'closing',
  'finale',
] as const

export type ChapterKey = (typeof chapterOrder)[number]

export const chapterLabels: Record<ChapterKey, string> = {
  greeting: 'Your Day',
  memories: 'Video Memories',
  closing: 'Thank You & Sorry',
  finale: 'A Prayer',
}
