import React, { useState, useEffect } from 'react';

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);

  const images = ["/image.webp", "/image1.webp", "/image2.webp"];

  const collections = [
    {
      title: "FARSHI SHALWAR",
      video: "/video1.mp4",
      image: "/men14.webp"
    },
    {
      title: "SUMMER COLLECTION",
      video: "/video2.mp4",
      image: "/cloth74.webp"
    },
    {
      title: "FORMALS",
      video: "/video3.mp4",
      image: "/child33.webp"
    },
  ];

    const Inspired = [
      {
      title: "Dainty Delights",
      image: "/image4.webp"
    },
    {
      title: "Style Spotted",
      image: "/image3.webp"
    },
    {
      title: "Client Spotlight",
      image: "/spotlight.webp"
    },
     {
      title: "Glam Moment",
      image: "/Glam_Moment.webp"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % collections.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#f6f5f3]">
      {/* Hero Slideshow */}
      <section className="w-full overflow-hidden">
        <div className="relative w-full max-w-none h-[550px] overflow-hidden">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out 
                ${index === currentImage ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}
            />
          ))}

          <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-sm px-6 py-5 rounded-lg shadow-sm hover:shadow-md transition">
            <p className="text-sm font-semibold tracking-wide text-gray-800 mb-1">SWIPE</p>
            <p className="text-xs text-gray-500 tracking-wider">DISCOVER NOW →</p>
          </div>
        </div>
      </section>

      {/* OUR COLLECTIONS with videos */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-thin text-center mb-10">OUR COLLECTIONS</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <div
              key={index}
              className={`relative overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl
                ${index === currentVideo ? 'ring-2 ring-pink-500 transform scale-[1.02]' : ''}`}
            >
              <div className="aspect-w-16 aspect-h-9 w-full h-[600px]">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={collection.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white">{collection.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            style={{ backgroundColor: "#FFC0CB" }}
            className="text-black px-8 py-3 rounded-full font-bold hover:bg-pink-600 transition-all shadow-md"
          >
            Next Help? Chat with us
          </button>
        </div>
      </section>

     {/* BE INSPIRED with images only */}
<section className="py-12 px-4 max-w-7xl mx-auto">
  <h2 className="text-3xl font-thin text-center mb-10">BE INSPIRED</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {Inspired.map((item, index) => (
      <div
        key={index}
        className="relative overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
      >
        <div className="aspect-w-16 aspect-h-9 w-full h-[550px]">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h3 className="text-2xl font-bold text-white">{item.title}</h3>
        </div>
      </div>
    ))}
  </div>
</section>


    </div>
  );
}
