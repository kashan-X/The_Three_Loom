import React, { useState, useEffect, useRef } from 'react';

const testimonials = [
  {
    text: "I was hesitant to buy a formal dress online, but the detailed sizing guide gave me confidence. The dress arrived flawlessly packed, and the stitching and detailing were exquisite. It truly felt like a designer piece. I received compliments all night long!",
    author: "Fariha N.",
  },
  {
    text: "I purchased a heavily embellished piece for my brother's wedding. The team was fantastic in providing video consultation for sizing. The piece fit almost perfectly, and the chiffon was high grade. It was heavy, as expected, but the fit allowed me to move comfortably.",
    author: "Amna S.",
  },
  {
    text: "As someone who values comfort and style, Farasha's lawn collection is a dream come true! Perfect for any day, any event.",
    author: "Ayesha S.",
  },
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "/Cover_Image/image5.png",
    "/Cover_Image/image6.webp",
    "/Cover_Image/image4.webp",
    "/Cover_Image/image7.webp",
    "/Cover_Image/image3.webp",
    "/Cover_Image/image1.webp",
    "/Cover_Image/image2.webp",
  ];

  const collections = [
    { title: "THE FARSHI FASHION", video: "/video1.mp4", image: "/men14.webp" },
    { title: "SUMMER COLLECTION", video: "/video4.mp4", image: "/cloth74.webp" },
    { title: "THE SUMMER STRING", video: "/video6.mp4", image: "/child33.webp" },
    { title: "WINTER EDIT", video: "/video5.mp4", image: "/men19.jpg" },
    { title: "WINTER TRADITION", video: "/video8.mp4", image: "/cloth42.webp" },
    { title: "FESTIVE WEAR", video: "/video7.mp4", image: "/cloth42.webp" },
  ];

  const Inspired = [
    { title: "Dainty Delights", image: "/image4.webp" },
    { title: "Style Spotted", image: "/image3.webp" },
    { title: "Client Spotlight", image: "/spotlight.webp" },
    { title: "Glam Moment", image: "/Glam_Moment.webp" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#f6f5f3]">
      {/* Hero Slideshow */}
      <section className="w-full overflow-hidden">
        <div className="relative w-full h-[260px] sm:h-[380px] md:h-[480px] lg:h-[550px] overflow-hidden">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out
                ${index === currentImage ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}
            />
          ))}
          <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 sm:px-6 sm:py-5 rounded-lg shadow-sm hover:shadow-md transition">
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-gray-800 mb-0.5 sm:mb-1">SWIPE</p>
            <p className="text-[10px] sm:text-xs text-gray-500 tracking-wider">DISCOVER NOW →</p>
          </div>
        </div>
      </section>

      {/* OUR COLLECTIONS */}
      <CollectionsCarousel collections={collections} />

      {/* BE INSPIRED */}
      <section className="py-8 sm:py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-thin text-center mb-6 sm:mb-10">
          BE INSPIRED
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {Inspired.map((item, index) => (
            <div
              key={index}
              className="relative overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl rounded-md"
            >
              <div className="w-full h-[160px] sm:h-[300px] md:h-[420px] lg:h-[480px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4 md:p-6">
                <h3 className="text-xs sm:text-base md:text-xl lg:text-2xl font-bold text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT OUR CUSTOMERS SAY */}
      <TestimonialsSection />
    </div>
  );
}

function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const startAuto = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
  };

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, []);

  const goTo = (index) => {
    stopAuto();
    setCurrent(index);
    startAuto();
  };

  return (
    <section className="py-9 sm:py-20 px-4 border-t border-gray-200">
      <h2 className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-gray-500 text-center mb-10 sm:mb-16 uppercase">
        What Our Customers Say
      </h2>

      <div className="max-w-2xl mx-auto text-center min-h-[180px] sm:min-h-[160px] flex flex-col items-center justify-center px-2">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className={`transition-all duration-700 ease-in-out absolute w-full max-w-2xl px-4 ${
              index === current
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            style={{ position: index === current ? 'relative' : 'absolute' }}
          >
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-light italic mb-6 sm:mb-8">
              "{t.text}"
            </p>
            <p className="text-sm sm:text-base font-semibold tracking-widest text-gray-500 uppercase">
              — {t.author}
            </p>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2.5 mt-8 sm:mt-10">
        {testimonials.map((_, index) => (
          <span
            key={index}
            onClick={() => goTo(index)}
            style={{ cursor: 'pointer', display: 'inline-block', borderRadius: '9999px', transition: 'all 0.3s',
              width: index === current ? '24px' : '10px',
              height: '10px',
              backgroundColor: index === current ? '#374151' : '#D1D5DB',
            }}
          />
        ))}
      </div>
    </section>
  );
}

function CollectionsCarousel({ collections }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);
  const autoScrollRef = useRef(null);

  const loopedCollections = [...collections, ...collections];
  const itemWidthPercent = 100 / 3;

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollRef.current = setInterval(() => {
      if (!trackRef.current) return;
      const track = trackRef.current;
      const itemWidth = track.scrollWidth / loopedCollections.length;
      track.scrollLeft += 2.5;
      if (track.scrollLeft >= itemWidth * collections.length) {
        track.scrollLeft = track.scrollLeft - itemWidth * collections.length;
      }
    }, 20);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    stopAutoScroll();
    dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    scrollStartLeft.current = trackRef.current.scrollLeft;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const delta = dragStartX.current - clientX;
    trackRef.current.scrollLeft = scrollStartLeft.current + delta;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    startAutoScroll();
  };

  const scrollByArrow = (direction) => {
    if (!trackRef.current) return;
    stopAutoScroll();
    const track = trackRef.current;
    const itemWidth = track.scrollWidth / loopedCollections.length;
    track.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
    setTimeout(startAutoScroll, 1000);
  };

  return (
    <section className="py-8 sm:py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-thin text-center mb-6 sm:mb-10">
        OUR COLLECTIONS
      </h2>
      <div className="relative">
        <button
          onClick={() => scrollByArrow(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -translate-x-3"
          aria-label="Previous"
        >
          ←
        </button>
        <button
          onClick={() => scrollByArrow(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-md translate-x-3"
          aria-label="Next"
        >
          →
        </button>
        <div
          ref={trackRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="flex overflow-x-hidden select-none cursor-grab active:cursor-grabbing gap-4 sm:gap-6"
          style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
        >
          {loopedCollections.map((collection, index) => (
            <div
              key={index}
              className="relative overflow-hidden shadow-lg rounded-md flex-shrink-0"
              style={{ width: `calc(${itemWidthPercent}% - 1rem)` }}
            >
              <div className="w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[460px]">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover pointer-events-none">
                  <source src={collection.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white">
                  {collection.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-8 sm:mt-12">
        <button
          style={{ backgroundColor: "#FFC0CB" }}
          className="text-black text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold hover:bg-pink-600 transition-all shadow-md"
        >
          Next Help? Chat with us
        </button>
      </div>
    </section>
  );
}