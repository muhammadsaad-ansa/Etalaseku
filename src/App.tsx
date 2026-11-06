/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, Plus, Trash2, Edit3, Pin, BarChart2, Settings, 
  Eye, Copy, Check, Search, Sparkles, Globe, Mail, 
  Share2, QrCode, ArrowUp, ArrowDown, Image as ImageIcon, 
  MessageCircle, ShieldCheck, Heart, User, LayoutDashboard,
  Layers, Filter, RefreshCw, Camera, Tag as TagIcon, X
} from 'lucide-react';
import { DigitalLink, ProfileData } from './types';
import { initialLinks, initialProfile, presetImages } from './mockData';

export default function App() {
  // State initialization with localStorage
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('etalaseku_profile_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialProfile,
        ...parsed,
        categories: parsed.categories && Array.isArray(parsed.categories) ? parsed.categories : initialProfile.categories
      };
    }
    return initialProfile;
  });

  const [links, setLinks] = useState<DigitalLink[]>(() => {
    const saved = localStorage.getItem('etalaseku_links_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((l: any) => ({
          ...l,
          tags: Array.isArray(l.tags) ? l.tags : [],
          category: l.category || initialProfile.categories[0]
        }));
      }
    }
    return initialLinks;
  });

  // Active view tab: 'client' | 'dashboard' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState<'client' | 'dashboard' | 'analytics' | 'settings'>('client');
  const [devicePreview, setDevicePreview] = useState<'mobile' | 'desktop'>('mobile');

  // Search & Filter for client view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<DigitalLink | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form state for Link Modal
  const [linkForm, setLinkForm] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    tagsInput: '',
    imageUrl: '',
    price: '',
    badge: ''
  });

  // New category input state for settings
  const [newCategoryName, setNewCategoryName] = useState('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('etalaseku_profile_v1', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('etalaseku_links_v1', JSON.stringify(links));
  }, [links]);

  // Handle file / gallery upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        callback(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle link click & increment counter
  const handleLinkClick = (id: string, url: string) => {
    setLinks(prev => prev.map(link => link.id === id ? { ...link, clicks: link.clicks + 1 } : link));
    setProfile(prev => ({ ...prev, viewCount: prev.viewCount + 1 }));
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Copy shareable link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Open Add Link Modal
  const openAddModal = () => {
    setEditingLink(null);
    const defaultCat = profile.categories[0] || 'Produk Digital';
    setLinkForm({
      title: '',
      url: 'https://',
      description: '',
      category: defaultCat,
      tagsInput: 'digital, rekomendasi',
      imageUrl: presetImages[0].url,
      price: '',
      badge: ''
    });
    setIsLinkModalOpen(true);
  };

  // Open Edit Link Modal
  const openEditModal = (link: DigitalLink) => {
    setEditingLink(link);
    setLinkForm({
      title: link.title,
      url: link.url,
      description: link.description,
      category: link.category || profile.categories[0],
      tagsInput: link.tags ? link.tags.join(', ') : '',
      imageUrl: link.imageUrl,
      price: link.price || '',
      badge: link.badge || ''
    });
    setIsLinkModalOpen(true);
  };

  // Save Link (Add or Edit)
  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.title || !linkForm.url) return;

    const parsedTags = linkForm.tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    if (editingLink) {
      setLinks(prev => prev.map(l => l.id === editingLink.id ? {
        ...l,
        title: linkForm.title,
        url: linkForm.url,
        description: linkForm.description,
        category: linkForm.category,
        tags: parsedTags,
        imageUrl: linkForm.imageUrl || presetImages[0].url,
        price: linkForm.price,
        badge: linkForm.badge
      } : l));
    } else {
      const newLink: DigitalLink = {
        id: `link-${Date.now()}`,
        title: linkForm.title,
        url: linkForm.url,
        description: linkForm.description,
        category: linkForm.category,
        tags: parsedTags,
        imageUrl: linkForm.imageUrl || presetImages[0].url,
        price: linkForm.price,
        badge: linkForm.badge,
        clicks: 0,
        isActive: true,
        isPinned: false,
        order: links.length + 1
      };
      setLinks(prev => [newLink, ...prev]);
    }
    setIsLinkModalOpen(false);
  };

  // Delete Link
  const handleDeleteLink = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tautan ini?')) {
      setLinks(prev => prev.filter(l => l.id !== id));
    }
  };

  // Toggle Pin
  const handleTogglePin = (id: string) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, isPinned: !l.isPinned } : l));
  };

  // Toggle Active
  const handleToggleActive = (id: string) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l));
  };

  // Move Order Up/Down
  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;
    setLinks(newLinks.map((l, i) => ({ ...l, order: i + 1 })));
  };

  // Category management handlers
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const trimmed = newCategoryName.trim();
    if (profile.categories.includes(trimmed)) {
      alert('Kategori sudah ada.');
      return;
    }
    setProfile(prev => ({
      ...prev,
      categories: [...prev.categories, trimmed]
    }));
    setNewCategoryName('');
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (profile.categories.length <= 1) {
      alert('Minimal harus ada 1 kategori.');
      return;
    }
    if (confirm(`Hapus kategori "${catToDelete}"? Tautan dalam kategori ini akan dipindah ke kategori pertama.`)) {
      const fallbackCat = profile.categories.filter(c => c !== catToDelete)[0];
      setProfile(prev => ({
        ...prev,
        categories: prev.categories.filter(c => c !== catToDelete)
      }));
      setLinks(prev => prev.map(l => l.category === catToDelete ? { ...l, category: fallbackCat } : l));
      if (selectedCategory === catToDelete) setSelectedCategory('Semua');
    }
  };

  const handleRenameCategory = (oldName: string) => {
    const newName = prompt(`Ubah nama kategori "${oldName}":`, oldName);
    if (!newName || !newName.trim() || newName.trim() === oldName) return;
    const trimmed = newName.trim();
    if (profile.categories.includes(trimmed)) {
      alert('Nama kategori sudah digunakan.');
      return;
    }
    setProfile(prev => ({
      ...prev,
      categories: prev.categories.map(c => c === oldName ? trimmed : c)
    }));
    setLinks(prev => prev.map(l => l.category === oldName ? { ...l, category: trimmed } : l));
    if (selectedCategory === oldName) setSelectedCategory(trimmed);
  };

  // Theme styling helpers
  const getThemeStyles = (themeName: ProfileData['theme']) => {
    switch (themeName) {
      case 'emerald':
        return {
          bg: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-zinc-950',
          card: 'bg-zinc-900/80 border-emerald-500/20 hover:border-emerald-500/50',
          text: 'text-zinc-100',
          accent: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
          badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        };
      case 'sunset':
        return {
          bg: 'bg-gradient-to-br from-orange-950 via-zinc-900 to-neutral-950',
          card: 'bg-zinc-900/80 border-orange-500/20 hover:border-orange-500/50',
          text: 'text-zinc-100',
          accent: 'bg-orange-500 text-white hover:bg-orange-400',
          badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-950 via-slate-900 to-zinc-950',
          card: 'bg-zinc-900/80 border-purple-500/20 hover:border-purple-500/50',
          text: 'text-zinc-100',
          accent: 'bg-purple-600 text-white hover:bg-purple-500',
          badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
        };
      case 'midnight':
        return {
          bg: 'bg-gradient-to-br from-blue-950 via-slate-900 to-black',
          card: 'bg-slate-900/90 border-blue-500/20 hover:border-blue-500/50',
          text: 'text-slate-100',
          accent: 'bg-blue-600 text-white hover:bg-blue-500',
          badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
        };
      case 'slate':
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-950',
          card: 'bg-zinc-900/80 border-zinc-700/50 hover:border-zinc-500',
          text: 'text-zinc-100',
          accent: 'bg-white text-slate-950 hover:bg-zinc-200',
          badge: 'bg-zinc-800 text-zinc-300 border border-zinc-700'
        };
    }
  };

  const themeStyle = getThemeStyles(profile.theme);

  // Collect all unique tags across all links
  const allUniqueTags = Array.from(
    new Set(links.flatMap(l => l.tags || []))
  ).sort();

  // Filtered links for client view (by search query matching title, description, or tags, category, and selected tag)
  const query = searchQuery.toLowerCase().trim();
  const filteredLinks = links
    .filter(l => l.isActive)
    .filter(l => {
      const matchesSearch = !query || 
        l.title.toLowerCase().includes(query) || 
        l.description.toLowerCase().includes(query) ||
        (l.tags && l.tags.some(t => t.toLowerCase().includes(query)));

      const matchesCategory = selectedCategory === 'Semua' || l.category === selectedCategory;
      const matchesTag = !selectedTag || (l.tags && l.tags.includes(selectedTag));

      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.order - b.order;
    });

  const totalClicks = links.reduce((acc, l) => acc + l.clicks, 0);
  const activeLinksCount = links.filter(l => l.isActive).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* TOP BAR CONTRACT: Brand | Navigation | Primary Action */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Etalase<span className="text-indigo-400">Ku</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 border-l border-slate-700 pl-2">
              Digital Showcase
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('client')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'client' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            <Eye className="w-3.5 h-3.5" />
            Tampilan Klien
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Kelola Link
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Analitik
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            <Settings className="w-3.5 h-3.5" />
            Profil & Kategori
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5" />
            Bagikan Etalase
          </button>
        </div>
      </header>

      {/* Mobile Subheader Navigation */}
      <div className="flex md:hidden overflow-x-auto gap-2 p-3 bg-slate-900 border-b border-slate-800 scrollbar-none">
        <button 
          onClick={() => setActiveTab('client')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'client' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          <Eye className="w-3.5 h-3.5" /> Klien
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> Link
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          <BarChart2 className="w-3.5 h-3.5" /> Analitik
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          <Settings className="w-3.5 h-3.5" /> Kategori & Profil
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col">
        
        {/* TAB 1: CLIENT VIEW (PUBLIC PREVIEW) */}
        {activeTab === 'client' && (
          <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 bg-slate-950">
            
            {/* Device Switcher for Preview */}
            <div className="flex items-center gap-2 mb-6 bg-slate-900 px-4 py-1.5 rounded-full border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Mode Tampilan:</span>
              <button 
                onClick={() => setDevicePreview('mobile')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${devicePreview === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Ponsel
              </button>
              <button 
                onClick={() => setDevicePreview('desktop')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${devicePreview === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Desktop / Tablet
              </button>
            </div>

            {/* Container Box */}
            <div className={`w-full transition-all duration-300 ${devicePreview === 'mobile' ? 'max-w-md bg-black rounded-[40px] border-8 border-slate-800 shadow-2xl overflow-hidden my-2' : 'max-w-3xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-900'}`}>
              
              {/* Internal Client Showcase */}
              <div className={`min-h-[700px] w-full ${themeStyle.bg} flex flex-col relative overflow-hidden`}>
                
                {/* Banner Image */}
                <div className="h-40 w-full relative overflow-hidden">
                  <img src={profile.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                {/* Profile Header */}
                <div className="px-6 relative -mt-16 flex flex-col items-center text-center pb-6 border-b border-white/10">
                  <div className="relative mb-3">
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.name} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-950 shadow-xl"
                    />
                    <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full border-2 border-slate-950" title="Terverifikasi">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  <h1 className="text-xl font-bold text-white flex items-center gap-1.5 justify-center">
                    {profile.name}
                  </h1>
                  <p className="text-xs font-medium text-indigo-400 mt-1">{profile.tagline}</p>
                  <p className="text-xs text-slate-300 mt-3 max-w-sm leading-relaxed">{profile.bio}</p>

                  {/* Social Icons Bar */}
                  <div className="flex items-center gap-3 mt-4">
                    {profile.whatsapp && (
                      <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors" title="WhatsApp">
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    {profile.instagram && (
                      <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center text-white transition-colors" title="Instagram">
                        <Camera className="w-4 h-4" />
                      </a>
                    )}
                    {profile.website && (
                      <a href={profile.website} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-indigo-600 flex items-center justify-center text-white transition-colors" title="Website">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {profile.email && (
                      <a href={`mailto:${profile.email}`} className="w-9 h-9 rounded-full bg-white/10 hover:bg-amber-600 flex items-center justify-center text-white transition-colors" title="Email">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Search Bar & Category & Tag Filters */}
                <div className="px-6 pt-5 space-y-3">
                  
                  {/* Search Bar (finds by title, description, and tags) */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Cari berdasarkan judul, deskripsi, atau #tag..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter Pills (Customizable Categories) */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      onClick={() => setSelectedCategory('Semua')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${selectedCategory === 'Semua' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                    >
                      Semua Kategori
                    </button>
                    {(profile.categories || initialProfile.categories).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Tag Cloud Filter */}
                  {allUniqueTags.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                      <span className="text-slate-400 shrink-0 flex items-center gap-1">
                        <TagIcon className="w-3 h-3" /> Tag:
                      </span>
                      {selectedTag && (
                        <button
                          onClick={() => setSelectedTag(null)}
                          className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md shrink-0 flex items-center gap-1"
                        >
                          Reset Tag <X className="w-3 h-3" />
                        </button>
                      )}
                      {allUniqueTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                          className={`px-2.5 py-1 rounded-md shrink-0 transition-colors ${selectedTag === tag ? 'bg-white text-slate-950 font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'}`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}

                </div>

                {/* Links Showcase List */}
                <div className="px-6 py-4 flex-1 flex flex-col gap-3">
                  {filteredLinks.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      Tidak ada tautan yang sesuai dengan pencarian atau filter Anda.
                    </div>
                  ) : (
                    filteredLinks.map((link) => (
                      <div
                        key={link.id}
                        onClick={() => handleLinkClick(link.id, link.url)}
                        className={`group relative flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/60 hover:bg-white/10 transition-all duration-300 cursor-pointer shadow-lg`}
                      >
                        {/* Thumbnail Photo */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-800 relative">
                          <img 
                            src={link.imageUrl} 
                            alt={link.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Content Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {link.badge && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                {link.badge}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              {link.category}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {link.title}
                          </h3>
                          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                            {link.description}
                          </p>
                          
                          {/* Tags display */}
                          {link.tags && link.tags.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              {link.tags.map(tag => (
                                <span key={tag} className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.2 rounded">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {link.price && (
                            <div className="text-xs font-bold text-emerald-400 mt-1">
                              {link.price}
                            </div>
                          )}
                        </div>

                        {/* Action Icon */}
                        <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-indigo-600 flex items-center justify-center text-slate-300 group-hover:text-white transition-all shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Branding */}
                <div className="p-4 text-center border-t border-white/10 mt-auto">
                  <a href="#" className="text-[11px] text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    Dibuat dengan EtalaseKu · Platform Tautan Digital Klien
                  </a>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DASHBOARD / LINK MANAGEMENT */}
        {activeTab === 'dashboard' && (
          <div className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-white">Kelola Etalase Link</h1>
                <p className="text-xs text-slate-400 mt-1">Tambah, edit, sematkan, atau atur urutan tautan digital Anda untuk klien.</p>
              </div>
              <button 
                onClick={openAddModal}
                className="px-4 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 justify-center"
              >
                <Plus className="w-4 h-4" />
                Tambah Tautan Baru
              </button>
            </div>

            {/* Links Management Table / Card List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Daftar Tautan ({links.length})</span>
                <span className="text-xs text-slate-400">Total Kunjungan Tautan: {totalClicks} klik</span>
              </div>

              <div className="divide-y divide-slate-800">
                {links.map((link, index) => (
                  <div key={link.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors">
                    
                    {/* Left info */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                        <img src={link.imageUrl} alt={link.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {link.isPinned && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Pin className="w-3 h-3" /> Disematkan
                            </span>
                          )}
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            {link.category}
                          </span>
                          {link.price && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {link.price}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{link.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{link.url}</p>
                        
                        {/* Tags */}
                        {link.tags && link.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {link.tags.map(t => (
                              <span key={t} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="text-[11px] text-indigo-400 mt-1">
                          {link.clicks} kali diklik
                        </div>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 justify-end self-end md:self-center">
                      <button 
                        onClick={() => handleTogglePin(link.id)}
                        className={`p-2 rounded-lg text-xs font-medium border transition-colors ${link.isPinned ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
                        title={link.isPinned ? 'Lepas Sematan' : 'Sematkan di Atas'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => handleToggleActive(link.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${link.isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}
                      >
                        {link.isActive ? 'Aktif' : 'Non-aktif'}
                      </button>

                      <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700">
                        <button 
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                          title="Geser ke Atas"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === links.length - 1}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                          title="Geser ke Bawah"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button 
                        onClick={() => openEditModal(link)}
                        className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="max-w-4xl mx-auto px-6 py-8 flex-1 w-full">
            <h1 className="text-2xl font-bold text-white mb-2">Statistik & Analitik Klien</h1>
            <p className="text-xs text-slate-400 mb-8">Pantau performa interaksi klien dengan etalase dan tautan digital Anda.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <span className="text-xs font-medium text-slate-400">Total Kunjungan Etalase</span>
                <div className="text-3xl font-bold text-white mt-2 tabular-nums">{profile.viewCount}</div>
                <div className="text-xs text-emerald-400 mt-2 font-medium">+18% dari minggu lalu</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <span className="text-xs font-medium text-slate-400">Total Klik Tautan</span>
                <div className="text-3xl font-bold text-white mt-2 tabular-nums">{totalClicks}</div>
                <div className="text-xs text-indigo-400 mt-2 font-medium">Rata-rata 4.2 klik per kunjungan</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <span className="text-xs font-medium text-slate-400">Tautan Aktif</span>
                <div className="text-3xl font-bold text-white mt-2 tabular-nums">{activeLinksCount} / {links.length}</div>
                <div className="text-xs text-amber-400 mt-2 font-medium">Semua sistem online</div>
              </div>
            </div>

            {/* Top performing links */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4">Tautan Paling Sering Dikunjungi Klien</h3>
              <div className="space-y-4">
                {[...links].sort((a, b) => b.clicks - a.clicks).slice(0, 5).map((l, i) => (
                  <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{l.title}</h4>
                        <span className="text-[10px] text-slate-400">{l.category}</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-indigo-400 tabular-nums">
                      {l.clicks} klik
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS (PROFILE, CATEGORIES & THEME) */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
            
            {/* Category Management Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-1">Manajemen Kategori Tautan</h2>
              <p className="text-xs text-slate-400 mb-6">Tambah, ubah nama, atau hapus kategori sesuai kebutuhan etalase Anda.</p>

              {/* Add category form */}
              <div className="flex items-center gap-3 mb-6">
                <input 
                  type="text" 
                  placeholder="Nama kategori baru (cth: Portofolio UI)"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button 
                  onClick={handleAddCategory}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium shrink-0 transition-all shadow"
                >
                  Tambah Kategori
                </button>
              </div>

              {/* List of categories */}
              <div className="space-y-2">
                {(profile.categories || initialProfile.categories).map((cat) => (
                  <div key={cat} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs font-bold text-white">{cat}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleRenameCategory(cat)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                      >
                        Ubah Nama
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat)}
                        className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg text-xs transition-colors border border-rose-500/20"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile & Theme Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-white mb-1">Pengaturan Profil & Tema Etalase</h2>
              <p className="text-xs text-slate-400 mb-6">Sesuaikan identitas brand, foto profil, banner, dan palet warna etalase klien Anda.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Nama Brand / Creator</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Tagline / Profesi</label>
                  <input 
                    type="text" 
                    value={profile.tagline}
                    onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Bio Singkat</label>
                <textarea 
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">URL Foto Profil (Avatar)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={profile.avatarUrl}
                      onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <label className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors">
                      <Camera className="w-3.5 h-3.5" /> Galeri
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setProfile({ ...profile, avatarUrl: url }))} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">URL Banner Latar Belakang</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={profile.bannerUrl}
                      onChange={(e) => setProfile({ ...profile, bannerUrl: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <label className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors">
                      <Camera className="w-3.5 h-3.5" /> Galeri
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setProfile({ ...profile, bannerUrl: url }))} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-3">Pilih Tema Estetika Etalase</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { id: 'slate', name: 'Slate Dark', color: 'bg-slate-900 border-slate-700' },
                    { id: 'emerald', name: 'Emerald', color: 'bg-emerald-950 border-emerald-800' },
                    { id: 'sunset', name: 'Sunset', color: 'bg-orange-950 border-orange-800' },
                    { id: 'purple', name: 'Purple', color: 'bg-purple-950 border-purple-800' },
                    { id: 'midnight', name: 'Midnight', color: 'bg-blue-950 border-blue-800' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, theme: t.id as ProfileData['theme'] })}
                      className={`p-3 rounded-xl border text-center transition-all ${t.color} ${profile.theme === t.id ? 'ring-2 ring-indigo-500 border-transparent shadow-lg' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <div className="text-xs font-bold text-white capitalize">{t.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Nomor WhatsApp (misal: 62812...)</label>
                  <input 
                    type="text" 
                    value={profile.whatsapp}
                    onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Username Instagram</label>
                  <input 
                    type="text" 
                    value={profile.instagram}
                    onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Email Bisnis</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Website Utama</label>
                  <input 
                    type="text" 
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* MODAL: ADD / EDIT LINK */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingLink ? 'Edit Tautan Digital' : 'Tambah Tautan Baru'}
              </h3>
              <button 
                onClick={() => setIsLinkModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Judul Tautan *</label>
                <input 
                  type="text" 
                  required
                  placeholder="cth: Masterclass UI/UX Design"
                  value={linkForm.title}
                  onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">URL / Tautan Tujuan *</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://..."
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Deskripsi Singkat</label>
                <textarea 
                  rows={2}
                  placeholder="Jelaskan secara singkat apa yang didapatkan klien..."
                  value={linkForm.description}
                  onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Kategori</label>
                  <select 
                    value={linkForm.category}
                    onChange={(e) => setLinkForm({ ...linkForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {profile.categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Harga (Opsional)</label>
                  <input 
                    type="text" 
                    placeholder="cth: Rp 99.000 atau Gratis"
                    value={linkForm.price}
                    onChange={(e) => setLinkForm({ ...linkForm, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Tag (Pisahkan dengan koma)</label>
                <input 
                  type="text" 
                  placeholder="cth: uiux, desain, figma, gratis"
                  value={linkForm.tagsInput}
                  onChange={(e) => setLinkForm({ ...linkForm, tagsInput: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Klien dapat mencari dan memfilter tautan berdasarkan tag ini.</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Label / Badge (Opsional)</label>
                <input 
                  type="text" 
                  placeholder="cth: 🔥 Terlaris, ✨ Baru, ⭐ Rekomendasi"
                  value={linkForm.badge}
                  onChange={(e) => setLinkForm({ ...linkForm, badge: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">URL Foto Thumbnail / Ilustrasi</label>
                <div className="flex items-center gap-2 mb-2">
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..."
                    value={linkForm.imageUrl}
                    onChange={(e) => setLinkForm({ ...linkForm, imageUrl: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <label className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium cursor-pointer shrink-0 flex items-center gap-1.5 transition-colors">
                    <Camera className="w-3.5 h-3.5" /> Galeri
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setLinkForm({ ...linkForm, imageUrl: url }))} />
                  </label>
                </div>
                
                {/* Preset Image Quick Selector */}
                <div className="text-[11px] text-slate-400 mb-1">Atau pilih dari preset profesional:</div>
                <div className="grid grid-cols-3 gap-2">
                  {presetImages.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLinkForm({ ...linkForm, imageUrl: p.url })}
                      className={`p-1.5 rounded-lg border text-[10px] text-left truncate flex items-center gap-1.5 bg-slate-950 transition-colors ${linkForm.imageUrl === p.url ? 'border-indigo-500 text-indigo-300' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      <img src={p.url} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20"
                >
                  {editingLink ? 'Simpan Perubahan' : 'Tambah Tautan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SHARE & QR CODE */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center mb-4 border border-indigo-500/30">
              <Share2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Bagikan Etalase Anda</h3>
            <p className="text-xs text-slate-400 mb-6">Klien dapat mengakses etalase digital Anda dengan memindai QR code atau menyalin tautan.</p>

            {/* QR Code Graphic Representation */}
            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto mb-6 flex flex-col items-center justify-center shadow-inner relative group">
              <div className="w-full h-full border-4 border-slate-900 grid grid-cols-6 gap-1 p-2 bg-slate-900">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className={`rounded-sm ${(i % 2 === 0 || i % 5 === 0 || i === 0 || i === 5 || i === 30 || i === 35) ? 'bg-white' : 'bg-slate-900'}`} />
                ))}
              </div>
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                <span className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow">EtalaseKu</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 mb-6">
              <input 
                type="text" 
                readOnly 
                value={window.location.href}
                className="w-full bg-transparent text-xs text-slate-300 px-2 focus:outline-none"
              />
              <button 
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Disalin!' : 'Salin'}
              </button>
            </div>

            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
