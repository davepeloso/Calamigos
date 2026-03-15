import React, { useState, useEffect } from 'react';
import { calamigosSections } from '../data/calamigosSections';

const CalamigosStoryPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Check which sections are visible
      const sectionElements = document.querySelectorAll('.story-section');
      const newVisibleSections = new Set();

      sectionElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
          newVisibleSections.add(index);
        }
      });

      setVisibleSections(newVisibleSections);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-amber-700/60 z-10" />
        <div className="absolute inset-0">
          <img
            src="/images/hero-calamigos.jpg"
            alt="Calamigos Ranch"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"%3E%3Crect fill="%23924" width="1920" height="1080"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="48"%3ECalamigos Ranch%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            The Calamigos Story
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-2xl mx-auto">
            A legacy of hospitality, beauty, and unforgettable moments in the heart of Malibu
          </p>
          <button
            onClick={() => scrollToSection(0)}
            className="inline-flex items-center px-8 py-4 bg-white text-amber-900 font-semibold rounded-full hover:bg-amber-50 transition-colors shadow-lg"
          >
            Begin Your Journey
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>

        {/* Floating indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Story Sections */}
      <div className="relative">
        {calamigosSections.map((section, index) => (
          <section
            key={section.id}
            id={`section-${index}`}
            className={`story-section min-h-screen flex items-center py-20 px-4 transition-all duration-1000 ${
              visibleSections.has(index)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="max-w-6xl mx-auto">
              <div className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'md:grid-flow-col-dense' : ''
              }`}>
                {/* Content */}
                <div className={`${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-4">
                      Chapter {index + 1}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                      {section.title}
                    </h2>
                  </div>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    {section.content}
                  </p>

                  {/* Additional story content */}
                  <div className="space-y-4 text-gray-600">
                    {index === 0 && (
                      <>
                        <p>
                          For decades, Calamigos Ranch has been a sanctuary where nature's beauty 
                          meets exceptional hospitality. Our story begins with a simple vision: 
                          to create a place where memories are made and dreams come alive.
                        </p>
                        <p>
                          Nestled in the stunning Malibu landscape, our ranch offers a unique 
                          blend rustic elegance and modern comfort, making it the perfect destination 
                          for those seeking an extraordinary experience.
                        </p>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <p>
                          Each accommodation at Calamigos is thoughtfully designed to provide 
                          the utmost comfort while maintaining the natural beauty that surrounds us. 
                          From cozy rooms to luxurious suites, every space tells a story.
                        </p>
                        <p>
                          Wake up to breathtaking views, enjoy modern amenities, and experience 
                          the tranquility that only Calamigos Ranch can offer.
                        </p>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <p>
                          Our culinary team crafts exceptional dining experiences using the 
                          finest local ingredients. From intimate dinners to grand celebrations, 
                          every meal is a celebration of flavor and artistry.
                        </p>
                        <p>
                          Whether you're enjoying a casual lunch or a formal dinner, our restaurants 
                          offer the perfect setting for any occasion.
                        </p>
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <p>
                          Calamigos Ranch is renowned for hosting spectacular events. From dream 
                          weddings to corporate gatherings, our venues provide the perfect backdrop 
                          for your most important moments.
                        </p>
                        <p>
                          Our experienced event team ensures every detail is perfect, creating 
                          experiences that exceed expectations and leave lasting impressions.
                        </p>
                      </>
                    )}
                    {index === 4 && (
                      <>
                        <p>
                          Adventure awaits at Calamigos Ranch. From hiking and horseback riding 
                          to relaxing by the pool, there's something for everyone to enjoy.
                        </p>
                        <p>
                          Our activities are designed to help you connect with nature, create 
                          lasting memories, and experience the magic of Calamigos.
                        </p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => scrollToSection(index + 1)}
                    className="mt-8 inline-flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-colors"
                    disabled={index === calamigosSections.length - 1}
                  >
                    Continue Story
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Image */}
                <div className={`${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                  <div className="relative h-96 md:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23ddd" width="600" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EStory image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col space-y-3">
          {calamigosSections.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                visibleSections.has(index)
                  ? 'bg-amber-600 border-amber-600 scale-125'
                  : 'bg-white border-gray-400 hover:border-amber-400'
              }`}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Your Story Awaits</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join us at Calamigos Ranch and become part of our continuing story. 
            Create memories that will last a lifetime.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-amber-600 text-white font-semibold rounded-full hover:bg-amber-700 transition-colors shadow-lg">
            Plan Your Visit
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              © 2024 Calamigos Ranch. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CalamigosStoryPage;
