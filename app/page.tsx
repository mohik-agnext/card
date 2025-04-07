'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          AGNEXT Card Generator
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Birthday Card */}
          <Link 
            href="/birthday"
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:scale-105">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                Birthday Card
              </h2>
              <p className="text-gray-600 text-center text-sm">
                Create personalized birthday cards for team members
              </p>
            </div>
          </Link>

          {/* Work Anniversary Card */}
          <Link 
            href="/work-anniversary"
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                Work Anniversary
              </h2>
              <p className="text-gray-600 text-center text-sm">
                Celebrate work milestones with custom anniversary cards
              </p>
            </div>
          </Link>

          {/* Onboarding Card */}
          <Link 
            href="/onboarding"
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:scale-105">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
                Welcome Aboard
              </h2>
              <p className="text-gray-600 text-center text-sm">
                Create welcoming cards for new team members
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
