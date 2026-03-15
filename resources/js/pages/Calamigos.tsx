import React, { useState, useEffect, useRef } from 'react';

// Explore Mode Component
const ExploreMode = ({ 
  brand, 
  exploreSections, 
  mapPins, 
  activeSection, 
  scrollProgress, 
  scrollContainerRef, 
  scrollToSection, 
  setCurrentMode 
}: any) => (
  <div className="min-h-screen" style={{ background: brand.sand }}>
    {/* Progress Bar */}
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full transition-all duration-300"
        style={{ width: `${scrollProgress}%`, background: brand.green }}
      />
    </div>

    {/* Header */}
    <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ background: 'rgba(234, 228, 216, 0.88)', borderColor: brand.divider }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <div>
          <div className="text-xs uppercase tracking-[0.24em]" style={{ color: brand.sage }}>
            Explore Mode
          </div>
          <div className="text-lg md:text-xl" style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '0.02em' }}>
            Calamigos Ranch
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setCurrentMode('navigate')}
            className="rounded-full border px-5 py-2.5 text-sm transition-all hover:shadow-md"
            style={{ borderColor: brand.green, color: brand.green }}
          >
            Find Your Way
          </button>
          <button
            onClick={() => setCurrentMode('home')}
            className="rounded-full border px-5 py-2.5 text-sm transition-all hover:shadow-md"
            style={{ borderColor: brand.divider, color: brand.text }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <div className="flex h-screen">
      {/* Story Content */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {exploreSections.map((section: any, index: number) => (
          <div key={section.id} className="min-h-screen flex items-center justify-center px-5 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <span className="inline-block px-4 py-2 text-xs uppercase tracking-[0.24em] rounded-full" style={{ background: '#ECE6DA', color: brand.sage }}>
                  Chapter {index + 1}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: brand.text }}>
                {section.title}
              </h1>
              <h2 className="text-2xl md:text-3xl mb-8" style={{ color: brand.wood, fontFamily: 'Playfair Display, Georgia, serif' }}>
                {section.subtitle}
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed mb-12 max-w-3xl mx-auto" style={{ color: brand.text }}>
                {section.content}
              </p>
              <div className="relative h-96 md:h-[32rem] rounded-2xl overflow-hidden mb-12">
                <img 
                  src={section.image} 
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="flex justify-center gap-4">
                {index > 0 && (
                  <button
                    onClick={() => scrollToSection(index - 1)}
                    className="px-6 py-3 rounded-full border transition-all hover:shadow-md"
                    style={{ borderColor: brand.green, color: brand.green }}
                  >
                    Previous
                  </button>
                )}
                {index < exploreSections.length - 1 && (
                  <button
                    onClick={() => scrollToSection(index + 1)}
                    className="px-6 py-3 rounded-full text-white transition-all hover:shadow-lg"
                    style={{ background: brand.green }}
                  >
                    Next Chapter
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map Sidebar */}
      <div className="hidden lg:block w-96 border-l" style={{ borderColor: brand.divider, background: brand.cream }}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Property Map
          </h3>
          <div className="relative h-64 rounded-lg overflow-hidden mb-4" style={{ background: brand.sand }}>
            <svg viewBox="0 0 600 420" className="absolute inset-0 h-full w-full">
              <path d="M40 300 C 150 250, 210 250, 330 190 S 520 120, 560 100" fill="none" stroke={brand.sage} strokeWidth="12" strokeLinecap="round" opacity="0.65" />
              <path d="M80 80 C 140 110, 180 150, 210 210 S 310 330, 430 350" fill="none" stroke={brand.sage} strokeWidth="8" strokeLinecap="round" opacity="0.28" />
              <path d="M420 290 C 460 250, 500 240, 560 250" fill="none" stroke={brand.water} strokeWidth="24" strokeLinecap="round" opacity="0.55" />
            </svg>
            {mapPins.map((pin: any) => (
              <div
                key={pin.name}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                  exploreSections[activeSection]?.mapHighlight === pin.name ? 'scale-125 z-10' : ''
                }`}
                style={{ left: pin.x, top: pin.y }}
              >
                <div 
                  className={`rounded-full border-2 border-white px-2 py-1 text-[10px] shadow-sm transition-all duration-500 ${
                    exploreSections[activeSection]?.mapHighlight === pin.name ? 'bg-yellow-500' : ''
                  }`}
                  style={{ 
                    background: exploreSections[activeSection]?.mapHighlight === pin.name ? '#EAB308' : brand.green, 
                    color: 'white' 
                  }}
                >
                  {pin.name}
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm" style={{ color: brand.sage }}>
            Currently viewing: <span className="font-medium" style={{ color: brand.text }}>{exploreSections[activeSection]?.title}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Navigate Mode Component
const NavigateMode = ({ 
  brand, 
  quickFind, 
  mapPins, 
  selectedLocation, 
  handleLocationSelect, 
  setCurrentMode 
}: any) => (
  <div className="min-h-screen" style={{ background: brand.sand }}>
    {/* Header */}
    <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ background: 'rgba(234, 228, 216, 0.88)', borderColor: brand.divider }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <div>
          <div className="text-xs uppercase tracking-[0.24em]" style={{ color: brand.sage }}>
            Navigate Mode
          </div>
          <div className="text-lg md:text-xl" style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '0.02em' }}>
            Find Your Way
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setCurrentMode('explore')}
            className="rounded-full border px-5 py-2.5 text-sm transition-all hover:shadow-md"
            style={{ borderColor: brand.green, color: brand.green }}
          >
            Explore the Ranch
          </button>
          <button
            onClick={() => setCurrentMode('home')}
            className="rounded-full border px-5 py-2.5 text-sm transition-all hover:shadow-md"
            style={{ borderColor: brand.divider, color: brand.text }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <div className="max-w-7xl mx-auto px-5 py-8 md:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Quick Find */}
        <div className="rounded-[20px] border p-5 md:p-6" style={{ borderColor: brand.divider, background: brand.cream }}>
          <div className="text-sm font-medium mb-4">Quick Find</div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {quickFind.map((item: any) => (
              <button
                key={item.label}
                onClick={() => handleLocationSelect(item.label)}
                className={`rounded-[18px] border p-4 text-left transition duration-300 ease-in-out hover:-translate-y-0.5 ${
                  selectedLocation === item.label ? 'ring-2' : ''
                }`}
                style={{ 
                  borderColor: selectedLocation === item.label ? brand.green : brand.divider, 
                  background: '#FBF8F2'
                }}
              >
                <div className="text-xs uppercase tracking-[0.16em]" style={{ color: brand.sage }}>
                  {item.kind}
                </div>
                <div className="mt-2 text-sm font-medium md:text-[15px]">{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Map and Location Details */}
        <div className="overflow-hidden rounded-[20px] border" style={{ borderColor: brand.divider, background: brand.cream }}>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* Map */}
            <div className="relative min-h-[420px] border-b lg:border-b-0 lg:border-r" style={{ borderColor: brand.divider }}>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #F5F2EA 0%, #EAE4D8 100%)' }} />
              <svg viewBox="0 0 600 420" className="absolute inset-0 h-full w-full">
                <path d="M40 300 C 150 250, 210 250, 330 190 S 520 120, 560 100" fill="none" stroke={brand.sage} strokeWidth="12" strokeLinecap="round" opacity="0.65" />
                <path d="M80 80 C 140 110, 180 150, 210 210 S 310 330, 430 350" fill="none" stroke={brand.sage} strokeWidth="8" strokeLinecap="round" opacity="0.28" />
                <path d="M420 290 C 460 250, 500 240, 560 250" fill="none" stroke={brand.water} strokeWidth="24" strokeLinecap="round" opacity="0.55" />
                <rect x="100" y="250" width="52" height="34" rx="8" fill={brand.green} opacity="0.95" />
                <rect x="240" y="165" width="58" height="38" rx="8" fill={brand.green} opacity="0.95" />
                <rect x="330" y="230" width="70" height="42" rx="8" fill={brand.green} opacity="0.95" />
                <rect x="455" y="115" width="66" height="40" rx="8" fill={brand.green} opacity="0.95" />
              </svg>
              {mapPins.map((pin: any) => (
                <div
                  key={pin.name}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                    selectedLocation === pin.name ? 'scale-125 z-10' : 'hover:scale-110'
                  }`}
                  style={{ left: pin.x, top: pin.y }}
                  onClick={() => handleLocationSelect(pin.name)}
                >
                  <div 
                    className={`rounded-full border-2 border-white px-2 py-1 text-[10px] shadow-sm transition-all duration-300 ${
                      selectedLocation === pin.name ? 'bg-yellow-500' : ''
                    }`}
                    style={{ 
                      background: selectedLocation === pin.name ? '#EAB308' : brand.green, 
                      color: 'white' 
                    }}
                  >
                    {pin.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Location Details */}
            <div className="p-6 md:p-7">
              <div className="text-xs uppercase tracking-[0.2em]" style={{ color: brand.sage }}>
                Selected location
              </div>
              <div className="mt-3 text-3xl" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                {selectedLocation || 'Select a location'}
              </div>
              {selectedLocation && (
                <>
                  <p className="mt-4 text-[15px] leading-7">
                    {selectedLocation === 'Redwood Grove' && 'Ceremony venue surrounded by mature trees. This space provides an intimate setting with natural acoustics and beautiful filtered light.'}
                    {selectedLocation === 'The Pavilion' && 'Elegant reception space with open-air design. Perfect for dining and dancing with seamless indoor-outdoor flow.'}
                    {selectedLocation === 'The Lake' && 'Scenic photo location with reflective water and natural landscaping. Ideal for golden hour photography.'}
                    {selectedLocation === 'Parking' && 'Main guest parking area with accessible spaces and EV charging stations available.'}
                    {selectedLocation === 'Guest Services' && 'Information desk, check-in services, and assistance for all guest needs.'}
                    {selectedLocation === 'Restrooms' && 'Modern facilities with ADA-compliant restrooms and baby changing stations.'}
                  </p>
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center justify-between rounded-[14px] px-4 py-3" style={{ background: '#EFE9DD' }}>
                      <span>Walking time from entrance</span>
                      <span style={{ color: brand.green }}>
                        {selectedLocation === 'Parking' ? '0 min' : 
                         selectedLocation === 'Guest Services' ? '2 min' :
                         selectedLocation === 'Restrooms' ? '3 min' : '5 min'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-[14px] px-4 py-3" style={{ background: '#EFE9DD' }}>
                      <span>Accessibility</span>
                      <span style={{ color: brand.green }}>Available</span>
                    </div>
                    <div className="flex items-center justify-between rounded-[14px] px-4 py-3" style={{ background: '#EFE9DD' }}>
                      <span>Shuttle access</span>
                      <span style={{ color: brand.green }}>
                        {selectedLocation === 'Parking' || selectedLocation === 'Guest Services' ? 'Stop 1' : 'Nearby'}
                      </span>
                    </div>
                  </div>
                  <button
                    className="mt-6 rounded-full px-6 py-3 text-sm font-medium text-white transition-all hover:shadow-lg"
                    style={{ background: brand.green }}
                  >
                    View directions
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function CalamigosHybridPrototype() {
  const [currentMode, setCurrentMode] = useState<'home' | 'explore' | 'navigate'>('home');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const brand = {
    green: '#2F4A3F',
    greenDark: '#243A32',
    sand: '#EAE4D8',
    cream: '#F5F2EA',
    sage: '#7A8F82',
    wood: '#8A6B4F',
    text: '#2C2C2C',
    divider: '#DCD6CA',
    water: '#A8C0C8',
  };

  const featuredSpaces = [
    {
      name: 'Redwood Grove',
      type: 'Ceremony Space',
      blurb: 'A secluded ceremony setting beneath towering trees, designed to feel intimate and transportive.',
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
    },
    {
      name: 'The Pavilion',
      type: 'Reception Space',
      blurb: 'Open, airy, and elegant — ideal for a seamless transition from celebration to dinner and dancing.',
      image:
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80',
    },
    {
      name: 'The Lake',
      type: 'Photo Location',
      blurb: 'A calm visual anchor on the property with reflective light, layered landscape, and cinematic atmosphere.',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    },
  ];

  const quickFind = [
    { label: 'Restrooms', kind: 'Essentials' },
    { label: 'Parking', kind: 'Arrival' },
    { label: 'Shuttle Stop', kind: 'Transit' },
    { label: 'Redwood Grove', kind: 'Venue' },
    { label: 'Oak Room', kind: 'Venue' },
    { label: 'Guest Services', kind: 'Help' },
  ];

  const mapPins = [
    { name: 'Parking', x: '18%', y: '72%', type: 'Arrival' },
    { name: 'Guest Services', x: '28%', y: '52%', type: 'Help' },
    { name: 'Redwood Grove', x: '47%', y: '34%', type: 'Venue' },
    { name: 'Oak Room', x: '62%', y: '47%', type: 'Venue' },
    { name: 'The Pavilion', x: '72%', y: '32%', type: 'Venue' },
    { name: 'Restrooms', x: '56%', y: '58%', type: 'Essentials' },
    { name: 'The Lake', x: '79%', y: '63%', type: 'Photo Location' },
  ];

  const exploreSections = [
    {
      id: 'welcome',
      title: 'Welcome to Calamigos',
      subtitle: 'Where Natural Beauty Meets Timeless Elegance',
      content: 'Nestled in the heart of Malibu, Calamigos Ranch has been a sanctuary for unforgettable moments for over seven decades. Our story begins with a simple vision: to create a place where nature\'s beauty meets exceptional hospitality.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80',
      mapHighlight: null,
    },
    {
      id: 'redwood',
      title: 'Redwood Grove',
      subtitle: 'Ceremony Space',
      content: 'A secluded ceremony setting beneath towering trees, designed to feel intimate and transportive. The natural canopy creates a cathedral-like atmosphere, perfect for exchanging vows surrounded by mature redwoods.',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
      mapHighlight: 'Redwood Grove',
    },
    {
      id: 'pavilion',
      title: 'The Pavilion',
      subtitle: 'Reception Space',
      content: 'Open, airy, and elegant — ideal for a seamless transition from celebration to dinner and dancing. The pavilion\'s design allows natural light to flood the space while maintaining an intimate atmosphere.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=80',
      mapHighlight: 'The Pavilion',
    },
    {
      id: 'lake',
      title: 'The Lake',
      subtitle: 'Photo Location',
      content: 'A calm visual anchor on the property with reflective light, layered landscape, and cinematic atmosphere. The lake provides stunning backdrops for photography and moments of quiet reflection.',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80',
      mapHighlight: 'The Lake',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        const scrollHeight = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        setScrollProgress(progress);

        // Update active section based on scroll
        const sectionHeight = scrollHeight / exploreSections.length;
        const currentSection = Math.min(Math.floor(scrollTop / sectionHeight), exploreSections.length - 1);
        setActiveSection(currentSection);
      }
    };

    const container = scrollContainerRef.current;

    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [exploreSections.length]);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionHeight = scrollContainerRef.current.scrollHeight / exploreSections.length;
      scrollContainerRef.current.scrollTo({
        top: index * sectionHeight,
        behavior: 'smooth'
      });
    }
  };

  // Render different modes
  if (currentMode === 'explore') {
    return (
      <ExploreMode 
        brand={brand}
        exploreSections={exploreSections}
        mapPins={mapPins}
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        scrollContainerRef={scrollContainerRef}
        scrollToSection={scrollToSection}
        setCurrentMode={setCurrentMode}
      />
    );
  }

  if (currentMode === 'navigate') {
    return (
      <NavigateMode 
        brand={brand}
        quickFind={quickFind}
        mapPins={mapPins}
        selectedLocation={selectedLocation}
        handleLocationSelect={handleLocationSelect}
        setCurrentMode={setCurrentMode}
      />
    );
  }

  // Home/Landing mode
  return (
    <div
      className="min-h-screen"
      style={{
        background: brand.sand,
        color: brand.text,
        fontFamily: 'Inter, Helvetica Neue, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Progress Bar for Explore Mode */}
      {scrollProgress > 0 && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div
            className="h-full transition-all duration-300"
            style={{ 
              width: `${scrollProgress}%`,
              background: brand.green 
            }}
          />
        </div>
      )}

      <header
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{
          background: 'rgba(234, 228, 216, 0.88)',
          borderColor: brand.divider,
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <div>
            <div
              className="text-xs uppercase tracking-[0.24em]"
              style={{ color: brand.sage }}
            >
              Proposal Prototype
            </div>
            <div
              className="text-lg md:text-xl"
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                letterSpacing: '0.02em',
              }}
            >
              Calamigos Ranch — Explore & Navigate
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setCurrentMode('navigate')}
              className="rounded-full border px-5 py-2.5 text-sm transition-all hover:shadow-md"
              style={{ borderColor: brand.green, color: brand.green }}
            >
              Find Your Way
            </button>
            <button
              onClick={() => setCurrentMode('explore')}
              className="rounded-full px-5 py-2.5 text-sm text-white shadow-sm transition-all hover:shadow-lg"
              style={{ background: brand.green }}
            >
              Explore the Ranch
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-8 md:px-8 md:pb-24 md:pt-10">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div
            className="overflow-hidden rounded-[20px] border"
            style={{ borderColor: brand.divider, background: brand.cream }}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80"
                alt="Cinematic aerial landscape placeholder"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="mb-3 text-xs uppercase tracking-[0.24em] text-white/80">
                  Hybrid concept
                </div>
                <h1
                  className="max-w-3xl text-4xl leading-tight text-white md:text-6xl"
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    letterSpacing: '0.02em',
                  }}
                >
                  A cinematic property guide with real wayfinding utility.
                </h1>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col justify-between rounded-[18px] border p-6 md:p-8"
            style={{ borderColor: brand.divider, background: brand.cream }}
          >
            <div>
              <div className="mb-3 text-xs uppercase tracking-[0.24em]" style={{ color: brand.sage }}>
                Product framing
              </div>
              <h2
                className="text-3xl leading-tight md:text-4xl"
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  letterSpacing: '0.02em',
                }}
              >
                One destination. Two clear guest modes.
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-7 md:text-[17px]">
                Prospective visitors can explore the property through beautiful editorial storytelling.
                Guests already on-site can skip straight to a map-first interface to find venues,
                restrooms, parking, and services without friction.
              </p>
            </div>

            <div className="mt-8 grid gap-4">
              <div
                className="rounded-[18px] border p-5"
                style={{ borderColor: brand.divider, background: '#EFE9DD' }}
              >
                <div className="text-xs uppercase tracking-[0.2em]" style={{ color: brand.sage }}>
                  Mode 01
                </div>
                <div
                  className="mt-2 text-2xl"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Explore the Ranch
                </div>
                <p className="mt-2 text-sm leading-6">
                  Cinematic sections, venue highlights, atmosphere, and orientation tied back to the property map.
                </p>
              </div>
              <div
                className="rounded-[18px] border p-5"
                style={{ borderColor: brand.divider, background: '#EFE9DD' }}
              >
                <div className="text-xs uppercase tracking-[0.2em]" style={{ color: brand.sage }}>
                  Mode 02
                </div>
                <div
                  className="mt-2 text-2xl"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Find Your Way
                </div>
                <p className="mt-2 text-sm leading-6">
                  Quick-access essentials with a mobile-first map, location cards, and fast paths for common needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em]" style={{ color: brand.sage }}>
              Entry screen concept
            </div>
            <h2
              className="mt-2 text-3xl md:text-5xl"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '0.02em' }}
            >
              Let the user choose their intent immediately.
            </h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div
            className="group overflow-hidden rounded-[20px] border"
            style={{ borderColor: brand.divider, background: brand.cream }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=80"
                alt="Editorial venue imagery placeholder"
                className="h-full w-full object-cover transition duration-700 ease-in-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-xs uppercase tracking-[0.22em] text-white/80">Inspiration</div>
                <div className="mt-2 text-3xl" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Explore the Ranch
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-[15px] leading-7">
                Ideal for prospective guests, couples, planners, and anyone wanting to understand the feeling and scale of the property.
              </p>
              <button
                className="mt-5 rounded-full px-6 py-3 text-sm font-medium text-white"
                style={{ background: brand.green }}
              >
                Start Cinematic Tour
              </button>
            </div>
          </div>

          <div
            className="group overflow-hidden rounded-[20px] border"
            style={{ borderColor: brand.divider, background: brand.cream }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 30% 35%, rgba(122,143,130,0.26), transparent 20%), radial-gradient(circle at 70% 62%, rgba(47,74,63,0.22), transparent 18%), linear-gradient(180deg, #F5F2EA 0%, #EAE4D8 100%)',
                }}
              />
              <div className="absolute inset-0 p-6">
                <div className="grid h-full grid-cols-8 grid-rows-6 gap-2 opacity-90">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-md border"
                      style={{ borderColor: 'rgba(122,143,130,0.18)' }}
                    />
                  ))}
                </div>
              </div>
              {mapPins.slice(0, 5).map((pin) => (
                <div
                  key={pin.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: pin.x, top: pin.y }}
                >
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white shadow" style={{ background: brand.green }} />
                </div>
              ))}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-xs uppercase tracking-[0.22em]" style={{ color: brand.green }}>
                  Utility
                </div>
                <div className="mt-2 text-3xl" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: brand.text }}>
                  Find Your Way
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-[15px] leading-7">
                Built for guests on-site who need immediate answers: restrooms, venues, parking, shuttles, services, and orientation.
              </p>
              <button
                className="mt-5 rounded-full border px-6 py-3 text-sm font-medium"
                style={{ borderColor: brand.green, color: brand.green }}
              >
                Open Property Map
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <div className="text-xs uppercase tracking-[0.24em]" style={{ color: brand.sage }}>
              Cinematic mode example
            </div>
            <h2
              className="mt-3 text-3xl leading-tight md:text-5xl"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '0.02em' }}
            >
              Scroll through signature spaces while the map keeps orientation intact.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 md:text-[17px]">
              The storytelling side should feel editorial and premium, but every section should still reinforce where the guest is on the property. The emotional experience and the practical map should never feel disconnected.
            </p>
            <div className="mt-8 rounded-[18px] border p-5" style={{ borderColor: brand.divider, background: brand.cream }}>
              <div className="text-sm font-medium">Prototype behavior</div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
                <li>• Section reveals are subtle and slow.</li>
                <li>• Desktop uses a sticky visual panel.</li>
                <li>• Mobile stacks content vertically with no heavy effects.</li>
                <li>• The map highlights the current venue as the story advances.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            {featuredSpaces.map((space, index) => (
              <div
                key={space.name}
                className="overflow-hidden rounded-[20px] border"
                style={{ borderColor: brand.divider, background: brand.cream }}
              >
                <div className="grid md:grid-cols-[1.15fr_0.85fr]">
                  <div className="aspect-[4/3] md:aspect-auto">
                    <img src={space.image} alt={space.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between p-6 md:p-8">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em]" style={{ color: brand.sage }}>
                        Chapter 0{index + 1}
                      </div>
                      <div
                        className="mt-3 text-3xl md:text-4xl"
                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                      >
                        {space.name}
                      </div>
                      <div className="mt-2 text-sm font-medium" style={{ color: brand.wood }}>
                        {space.type}
                      </div>
                      <p className="mt-4 text-[15px] leading-7 md:text-[17px]">{space.blurb}</p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <span
                        className="rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.16em]"
                        style={{ background: '#ECE6DA', color: brand.green }}
                      >
                        Map highlight active
                      </span>
                      <span
                        className="rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.16em]"
                        style={{ background: '#ECE6DA', color: brand.green }}
                      >
                        Optional short video loop
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.24em]" style={{ color: brand.sage }}>
            Fast-path wayfinding
          </div>
          <h2
            className="mt-3 text-3xl md:text-5xl"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '0.02em' }}
          >
            A practical layer for guests who need answers in seconds.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div
            className="rounded-[20px] border p-5 md:p-6"
            style={{ borderColor: brand.divider, background: brand.cream }}
          >
            <div className="text-sm font-medium">Quick find</div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              {quickFind.map((item) => (
                <button
                  key={item.label}
                  className="rounded-[18px] border p-4 text-left transition duration-300 ease-in-out hover:-translate-y-0.5"
                  style={{ borderColor: brand.divider, background: '#FBF8F2' }}
                >
                  <div className="text-xs uppercase tracking-[0.16em]" style={{ color: brand.sage }}>
                    {item.kind}
                  </div>
                  <div className="mt-2 text-sm font-medium md:text-[15px]">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div
            className="overflow-hidden rounded-[20px] border"
            style={{ borderColor: brand.divider, background: brand.cream }}
          >
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[420px] border-b lg:border-b-0 lg:border-r" style={{ borderColor: brand.divider }}>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, #F5F2EA 0%, #EAE4D8 100%)',
                  }}
                />
                <svg viewBox="0 0 600 420" className="absolute inset-0 h-full w-full">
                  <path d="M40 300 C 150 250, 210 250, 330 190 S 520 120, 560 100" fill="none" stroke={brand.sage} strokeWidth="12" strokeLinecap="round" opacity="0.65" />
                  <path d="M80 80 C 140 110, 180 150, 210 210 S 310 330, 430 350" fill="none" stroke={brand.sage} strokeWidth="8" strokeLinecap="round" opacity="0.28" />
                  <path d="M420 290 C 460 250, 500 240, 560 250" fill="none" stroke={brand.water} strokeWidth="24" strokeLinecap="round" opacity="0.55" />
                  <rect x="100" y="250" width="52" height="34" rx="8" fill={brand.green} opacity="0.95" />
                  <rect x="240" y="165" width="58" height="38" rx="8" fill={brand.green} opacity="0.95" />
                  <rect x="330" y="230" width="70" height="42" rx="8" fill={brand.green} opacity="0.95" />
                  <rect x="455" y="115" width="66" height="40" rx="8" fill={brand.green} opacity="0.95" />
                </svg>
                {mapPins.map((pin) => (
                  <div
                    key={pin.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: pin.x, top: pin.y }}
                  >
                    <div className="rounded-full border-2 border-white px-2 py-1 text-[10px] shadow-sm" style={{ background: brand.green, color: 'white' }}>
                      {pin.name}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 md:p-7">
                <div className="text-xs uppercase tracking-[0.2em]" style={{ color: brand.sage }}>
                  Selected location
                </div>
                <div className="mt-3 text-3xl" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Redwood Grove
                </div>
                <p className="mt-4 text-[15px] leading-7">
                  Ceremony venue surrounded by mature trees. This card can show a photo, a short description, walking hints, accessibility notes, and nearby essentials like restrooms or shuttle access.
                </p>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-[14px] px-4 py-3" style={{ background: '#EFE9DD' }}>
                    <span>Nearest restroom</span>
                    <span style={{ color: brand.green }}>2 min walk</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[14px] px-4 py-3" style={{ background: '#EFE9DD' }}>
                    <span>Nearest parking</span>
                    <span style={{ color: brand.green }}>South lot</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[14px] px-4 py-3" style={{ background: '#EFE9DD' }}>
                    <span>Guest services</span>
                    <span style={{ color: brand.green }}>Available</span>
                  </div>
                </div>
                <button
                  className="mt-6 rounded-full px-6 py-3 text-sm font-medium text-white"
                  style={{ background: brand.green }}
                >
                  View directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-6 md:px-8 md:pb-24">
        <div
          className="rounded-[20px] border p-6 md:p-10"
          style={{ borderColor: brand.divider, background: brand.cream }}
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="text-xs uppercase tracking-[0.24em]" style={{ color: brand.sage }}>
                Proposal takeaway
              </div>
              <h2
                className="mt-3 text-3xl leading-tight md:text-5xl"
                style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '0.02em' }}
              >
                The strongest concept is not a 3D tour or a plain map.
              </h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-7 md:text-[17px]">
                It is a luxury digital property guide that gives prospective guests something beautiful to explore and gives on-site guests something genuinely useful to navigate with.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-full px-6 py-3 text-sm font-medium text-white"
                style={{ background: brand.green }}
              >
                Present Hybrid Concept
              </button>
              <button
                className="rounded-full border px-6 py-3 text-sm font-medium"
                style={{ borderColor: brand.green, color: brand.green }}
              >
                Review Media Plan
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
