import React, { useEffect, useState } from 'react'
import { dummyPublishedImages } from '../assets/assets'
import Loading from './Loading'

const Community = () => {

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const fetchImages = async () => {
    setImages(dummyPublishedImages)
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const styles = `
    .community-container {
      background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
      transition: background 0.3s ease;
    }

    .dark .community-container {
      background: linear-gradient(135deg, #1a1625 0%, #0f0a15 100%);
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
    }

    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #555;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #999;
    }

    .image-card {
      position: relative;
      overflow: hidden;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
    }

    .dark .image-card {
      border-color: #80609f40;
      background: rgba(255, 255, 255, 0.02);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }

    .image-card:hover {
      box-shadow: 0 12px 24px rgba(164, 86, 247, 0.2);
      transform: translateY(-4px);
      border-color: #a456f7;
    }

    .dark .image-card:hover {
      box-shadow: 0 12px 24px rgba(164, 86, 247, 0.3);
      border-color: #a456f780;
    }

    .image-wrapper {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 200px;
      background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
    }

    .dark .image-wrapper {
      background: linear-gradient(135deg, #1e1e2e, #2a2a3e);
    }

    .image-element {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .image-card:hover .image-element {
      transform: scale(1.08);
    }

    .image-overlay {
      position: absolute;
      bottom: 0;
      right: 0;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 100%);
      backdrop-filter: blur(8px);
      color: white;
      padding: 12px 16px;
      border-radius: 12px 0 0 0;
      font-size: 12px;
      font-weight: 500;
      opacity: 0;
      transform: translateY(8px);
      transition: all 0.3s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }

    .image-card:hover .image-overlay {
      opacity: 1;
      transform: translateY(0);
    }

    .creator-badge {
      display: inline-block;
      background: linear-gradient(135deg, #a456f7, #3d81f6);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 600;
      margin-top: 4px;
    }

    .no-images-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .no-images-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #a456f7, #3d81f6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      opacity: 0.2;
    }

    .fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }

    .stagger-delay-1 { animation-delay: 0.1s; }
    .stagger-delay-2 { animation-delay: 0.2s; }
    .stagger-delay-3 { animation-delay: 0.3s; }
    .stagger-delay-4 { animation-delay: 0.4s; }
    .stagger-delay-5 { animation-delay: 0.5s; }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header-gradient {
      background: linear-gradient(135deg, #1a1625 0%, #2a1a3a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .light .header-gradient {
      background: linear-gradient(135deg, #1a1625 0%, #2a1a3a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
      animation: fadeIn 0.6s ease-in-out;
    }

    @media (max-width: 768px) {
      .grid-container {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 12px;
      }
    }

    @media (max-width: 640px) {
      .grid-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      .image-wrapper {
        height: 150px;
      }
    }
  `;

  if (loading) return <Loading />;

  return (
    <>
      <style>{styles}</style>
      <div className='community-container custom-scrollbar p-6 pt-12 xl:px-12 2xl:px-20 w-full mx-auto h-full overflow-y-scroll'>
        {/* Header Section */}
        <div className='mb-12'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-1 h-8 bg-gradient-to-b from-[#a456f7] to-[#3d81f6] rounded-full'></div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Community Gallery
            </h2>
          </div>
          <p className='text-sm text-gray-600 dark:text-gray-400 ml-4'>
            Discover amazing AI-generated images from our creative community
          </p>
        </div>

        {images.length > 0 ? (
          <>
            {/* Stats Section */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-10'>
              <div className='p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>Total Images</p>
                <p className='text-2xl font-bold text-gray-900 dark:text-white mt-2'>{images.length}</p>
              </div>
              <div className='p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>Creators</p>
                <p className='text-2xl font-bold text-gray-900 dark:text-white mt-2'>{new Set(images.map(img => img.userName)).size}</p>
              </div>
              <div className='p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>Status</p>
                <p className='text-2xl font-bold text-green-500 mt-2'>Live</p>
              </div>
            </div>

            {/* Images Grid */}
            <div className='grid-container'>
              {images.map((item, index) => (
                <a
                  key={index}
                  href={item.imageUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='image-card fade-in'
                  style={{
                    animationDelay: `${(index % 5) * 0.1}s`
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Image Container */}
                  <div className='image-wrapper'>
                    <img
                      src={item.imageUrl}
                      alt={`Community creation by ${item.userName}`}
                      className='image-element'
                      loading='lazy'
                    />
                  </div>

                  {/* Overlay with Creator Info */}
                  <div className='image-overlay'>
                    <div>
                      <p className='font-semibold'>Created by</p>
                      <p className='text-xs opacity-90'>{item.userName}</p>
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </a>
              ))}
            </div>

            {/* Footer Info */}
            <div className='mt-16 text-center pb-8'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                🎨 Showing {images.length} amazing creations from our community
              </p>
            </div>
          </>
        ) : (
          <div className='no-images-container'>
            <div className='no-images-icon'>
              <svg className='w-10 h-10 text-purple-600' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
              No Images Available Yet
            </h3>
            <p className='text-gray-600 dark:text-gray-400 max-w-md'>
              Be the first to share your amazing AI-generated creations with the community! 
              Start creating and publishing your images today.
            </p>
            <button className='mt-8 px-6 py-2 bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 active:scale-95'>
              Start Creating
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Community
