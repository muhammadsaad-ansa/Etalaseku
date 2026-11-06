import { DigitalLink, ProfileData } from './types';

export const initialProfile: ProfileData = {
  name: 'Raka Pratama, M.Ds.',
  tagline: 'Senior Product Designer & Digital Creator',
  bio: 'Membantu bisnis, kreator, dan profesional membangun aset digital, portofolio kelas dunia, dan produk digital siap jual. Cek tautan di bawah untuk kolaborasi & produk!',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  theme: 'slate',
  whatsapp: '+6281234567890',
  instagram: 'rakapratama.design',
  email: 'halo@rakapratama.studio',
  website: 'https://rakapratama.studio',
  tiktok: 'rakapratama_ui',
  viewCount: 1420,
  categories: ['Produk Digital', 'Portofolio', 'E-Book & Panduan', 'Konsultasi', 'Sosial Media & Lainnya']
};

export const initialLinks: DigitalLink[] = [
  {
    id: 'link-1',
    title: 'Masterclass UI/UX Design Dari Nol ke Pro (Batch 12)',
    url: 'https://example.com/masterclass-uiux',
    description: 'Kursus lengkap 8 minggu belajar riset pengguna, figma lanjutan, dan portofolio siap kerja.',
    category: 'Produk Digital',
    tags: ['uiux', 'kursus', 'desain', 'figma', 'karir'],
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
    price: 'Rp 299.000',
    badge: '🔥 Terlaris',
    clicks: 342,
    isActive: true,
    isPinned: true,
    order: 1
  },
  {
    id: 'link-2',
    title: 'E-Book: Panduan Psikologi Desain & Konversi Web',
    url: 'https://example.com/ebook-psikologi-desain',
    description: '150+ halaman strategi layout, tipografi, dan warna yang terbukti mendongkrak penjualan klien.',
    category: 'E-Book & Panduan',
    tags: ['ebook', 'psikologi', 'marketing', 'konversi', 'bisnis'],
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    price: 'Rp 95.000',
    badge: '⭐ Rekomendasi',
    clicks: 215,
    isActive: true,
    isPinned: true,
    order: 2
  },
  {
    id: 'link-3',
    title: 'Jadwal Konsultasi 1-on-1 (Mentorship 45 Menit)',
    url: 'https://example.com/konsultasi-private',
    description: 'Bedah portofolio langsung bersama Raka Pratama, diskusi karier, atau review produk Anda via Zoom.',
    category: 'Konsultasi',
    tags: ['mentoring', 'konsultasi', 'karir', 'zoom'],
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    price: 'Rp 150.000',
    badge: 'Limited',
    clicks: 189,
    isActive: true,
    isPinned: false,
    order: 3
  },
  {
    id: 'link-4',
    title: 'Template Notion Freelancer & Client Tracker Pro',
    url: 'https://example.com/notion-freelance-kit',
    description: 'Sistem manajemen invoice, brief klien, tracking waktu, dan daftar tugas dalam satu dashboard rapi.',
    category: 'Produk Digital',
    tags: ['notion', 'freelance', 'produktivitas', 'gratis', 'template'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    price: 'Gratis',
    badge: '✨ Free Download',
    clicks: 520,
    isActive: true,
    isPinned: false,
    order: 4
  },
  {
    id: 'link-5',
    title: 'Portofolio Utama Behance & Case Studies',
    url: 'https://behance.net',
    description: 'Lihat koleksi studi kasus desain produk dan re-branding enterprise yang pernah saya kerjakan.',
    category: 'Portofolio',
    tags: ['portofolio', 'behance', 'uiux', 'branding'],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    clicks: 142,
    isActive: true,
    isPinned: false,
    order: 5
  }
];

export const presetImages = [
  { name: 'Workspace Minimalis', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600' },
  { name: 'Buku & E-Book', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600' },
  { name: 'Desain & Kreatif', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600' },
  { name: 'Konsultasi / Meeting', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600' },
  { name: 'Teknologi / Gadget', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600' },
  { name: 'Portofolio Arsitektur', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600' },
];
