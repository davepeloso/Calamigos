import React, { useState } from 'react';
import { calamigosSections } from '../data/calamigosSections';

const CalamigosHybridPrototype = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentSection = calamigosSections[activeSection];

  const handleSectionChange = (index) => {
    setActiveSection(index);
    setIsMenuOpen(false);
  };

  const nextSection = () => {
    setActiveSection((prev) => (prev + 1) % calamigosSections.length);
  };

  const prevSection = () => {
    setActiveSection((prev) => (prev - 1 + calamigosSections.length) % calamigosSections.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Calamigos</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {calamigosSections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(index)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === index
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {calamigosSections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(index)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeSection === index
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Section Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {currentSection.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentSection.content}
            </p>
          </div>

          {/* Section Image */}
          <div className="mb-12">
            <div className="relative h-96 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={currentSection.image}
                alt={currentSection.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage placeholder%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevSection}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Section Indicators */}
            <div className="flex space-x-2">
              {calamigosSections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSectionChange(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    activeSection === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSection}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Next
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm">© 2024 Calamigos Ranch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CalamigosHybridPrototype;
