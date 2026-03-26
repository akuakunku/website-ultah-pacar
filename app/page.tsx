"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import "./birthday.css";

export default function Home() {
  // State management dengan grouping
  const [uiState, setUiState] = useState({
    showConfetti: false,
    showSurprise: false,
    showLoveLetter: false,
    showVolumeControl: false,
    selectedMemory: null,
    isPlaying: false,
  });
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const [volume, setVolume] = useState(50);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const animationFrameRef = useRef(null);
  const confettiTimeoutRef = useRef(null);
  
  const namaPacar = process.env.NEXT_PUBLIC_PARTNER_NAME || "NABILA";

  // Data yang dimemoize
  const loveLetterText = useMemo(() => `Untuk ${namaPacar} tersayang,

Di hari spesial ini, aku ingin mengucapkan selamat ulang tahun! 
Kamu adalah hadiah terindah dalam hidupku. Setiap detik bersamamu adalah anugerah yang tak ternilai.

Aku berjanji akan selalu ada untukmu, dalam suka maupun duka. Bersamamu, hidup terasa lengkap dan bermakna.

Semoga di usiamu yang baru ini, semua impian dan harapanmu menjadi kenyataan. Tetap menjadi dirimu yang cantik, baik hati, dan menawan.

I Love You More Than Anything in This World! ❤️

With love,
Your Partner`, [namaPacar]);

 // Memories dengan foto dan kutipan terkenal
const memories = useMemo(() => [
  { 
    id: 1, 
    icon: "🏖️", 
    title: "Cinta Sejati", 
    date: "William Shakespeare", 
    desc: "Cinta tidak pernah berakhir dengan kebahagiaan, cinta sejati tidak pernah berakhir.", 
    color: "#FF6B6B", 
    image: "/images/photo1.jpg" 
  },
  { 
    id: 2, 
    icon: "🎂", 
    title: "Hadiah Terindah", 
    date: "Rumi", 
    desc: "Kamu bukan hanya kekasihku, tapi juga rumah bagiku. Tempat aku pulang setelah lelah berkelana.", 
    color: "#4ECDC4", 
    image: "/images/photo2.jpg" 
  },
  { 
    id: 3, 
    icon: "💑", 
    title: "Takdir", 
    date: "Paulo Coelho", 
    desc: "Ketika seseorang benar-benar menginginkan sesuatu, seluruh alam semesta bersatu membantunya mewujudkannya.", 
    color: "#45B7D1", 
    image: "/images/photo3.jpg" 
  },
  { 
    id: 4, 
    icon: "🌹", 
    title: "Cinta Abadi", 
    date: "Antoine de Saint-Exupéry", 
    desc: "Cinta bukan saling memandang satu sama lain, tetapi melihat ke arah yang sama bersama-sama.", 
    color: "#96CEB4", 
    image: "/images/photo4.jpg" 
  },
  { 
    id: 5, 
    icon: "🎉", 
    title: "Kebahagiaan", 
    date: "Confucius", 
    desc: "Temukan kebahagiaan dalam pekerjaanmu, atau kau tak akan pernah bahagia.", 
    color: "#FFEAA7", 
    image: "/images/photo5.jpg" 
  },
  { 
    id: 6, 
    icon: "✈️", 
    title: "Perjalanan", 
    date: "J.R.R. Tolkien", 
    desc: "Bukan semua yang berjalan tersesat. Tetaplah berjalan, dan kau akan menemukan jalan pulang ke hatiku.", 
    color: "#D4A5A5", 
    image: "/images/photo6.jpg" 
  },
  { 
    id: 7, 
    icon: "💕", 
    title: "Selamanya", 
    date: "Nicholas Sparks", 
    desc: "Kau adalah bagian dari setiap keputusan yang kubuat, setiap langkah yang kuambil. Kau ada dalam setiap detak jantungku.", 
    color: "#FFB6C1", 
    image: "/images/photo7.jpg" 
  },
], []);
  // Slideshow dengan 7 foto
  const slides = useMemo(() => [
    {
      image: "/images/photo1.jpg",
      caption: "Selamat Ulang Tahun! 🎂",
      message: "Untuk bintang dalam hidupku",
      emoji: "🎂"
    },
    {
      image: "/images/photo2.jpg",
      caption: "Terima kasih telah hadir",
      message: "Dan mewarnai duniaku",
      emoji: "❤️"
    },
    {
      image: "/images/photo3.jpg",
      caption: "Kamu adalah anugerah",
      message: "Yang selalu kunantikan",
      emoji: "✨"
    },
    {
      image: "/images/photo4.jpg",
      caption: "Cinta yang abadi",
      message: "Takkan pernah pudar",
      emoji: "💕"
    },
    {
      image: "/images/photo5.jpg",
      caption: "Kebahagiaan bersamamu",
      message: "Setiap detik berharga",
      emoji: "😊"
    },
    {
      image: "/images/photo6.jpg",
      caption: "Petualangan bersama",
      message: "Menjelajahi dunia",
      emoji: "🌍"
    },
    {
      image: "/images/photo7.jpg",
      caption: "Sampai kapan pun",
      message: "Aku akan selalu bersamamu",
      emoji: "💖"
    }
  ], []);

  const playlist = useMemo(() => [
    { title: "Happy Birthday Song", url: "/music/happy-birthday.mp3" },
    { title: "Perfect - Ed Sheeran", url: "/music/perfect.mp3" },
    { title: "Thinking Out Loud", url: "/music/thinking-out-loud.mp3" }
  ], []);

  // Animation data dengan useRef untuk performance
  const animationsRef = useRef({
    bubbles: [],
    floatingHearts: [],
    stars: []
  });

  // Helper functions untuk update UI state
  const updateUiState = useCallback((updates: Partial<typeof uiState>) => {
    setUiState(prev => ({ ...prev, ...updates }));
  }, []);

  // Confetti trigger dengan debouncing
  const triggerConfetti = useCallback(() => {
    if (uiState.showConfetti) return;
    
    updateUiState({ showConfetti: true });
    
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
    }
    
    confettiTimeoutRef.current = setTimeout(() => {
      updateUiState({ showConfetti: false });
    }, 5000);
  }, [uiState.showConfetti, updateUiState]);

  // Typing effect optimization
  useEffect(() => {
    if (uiState.showLoveLetter) {
      let i = 0;
      setTypedText("");
      
      typingIntervalRef.current = setInterval(() => {
        if (i < loveLetterText.length) {
          setTypedText((prev) => prev + loveLetterText.charAt(i));
          i++;
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
          }
        }
      }, 30);

      return () => {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      };
    }
  }, [uiState.showLoveLetter, loveLetterText]);

  // Mouse position dengan RAF optimization dan touch support
  useEffect(() => {
    let ticking = false;
    
    const updatePosition = (clientX, clientY) => {
      setMousePosition({
        x: (clientX / window.innerWidth - 0.5) * 20,
        y: (clientY / window.innerHeight - 0.5) * 20,
      });
    };
    
    const handleMouseMove = (e) => {
      if (!ticking) {
        animationFrameRef.current = requestAnimationFrame(() => {
          updatePosition(e.clientX, e.clientY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!ticking && e.touches[0]) {
        animationFrameRef.current = requestAnimationFrame(() => {
          updatePosition(e.touches[0].clientX, e.touches[0].clientY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Initialize animations
  useEffect(() => {
    setIsClient(true);
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
    
    // Generate animations data hanya sekali
    animationsRef.current = {
      bubbles: [...Array(30)].map(() => ({
        width: Math.random() * 150 + 50,
        height: Math.random() * 150 + 50,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
        color: `rgba(255, ${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 0.15)`,
      })),
      floatingHearts: [...Array(20)].map(() => ({
        left: Math.random() * 100,
        duration: Math.random() * 15 + 15,
        delay: Math.random() * 10,
        size: Math.random() * 20 + 20,
      })),
      stars: [...Array(50)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      }))
    };

    triggerConfetti();
    
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, [triggerConfetti]);

  // Audio control dengan cleanup yang lebih baik
  useEffect(() => {
    let audio = audioRef.current;
    
    if (uiState.isPlaying) {
      if (!audio) {
        audio = new Audio(playlist[currentTrack].url);
        audio.loop = true;
        audio.volume = volume / 100;
        audioRef.current = audio;
      }
      
      audio.play().catch(e => {
        console.log("Audio play failed:", e);
        // Auto-retry setelah user interaction
        const retryHandler = () => {
          if (audioRef.current) {
            audioRef.current.play();
          }
          document.removeEventListener('click', retryHandler);
        };
        document.addEventListener('click', retryHandler);
      });
    } else {
      if (audio) {
        audio.pause();
      }
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
        audioRef.current = null;
      }
    };
  }, [uiState.isPlaying, currentTrack, volume, playlist]);

  // Auto slideshow dengan cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [slides.length]);

  // Audio controls dengan useCallback
  const nextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    if (uiState.isPlaying && audioRef.current) {
      audioRef.current.src = playlist[(currentTrack + 1) % playlist.length].url;
      audioRef.current.play();
    }
  }, [uiState.isPlaying, currentTrack, playlist]);

  const prevTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    if (uiState.isPlaying && audioRef.current) {
      audioRef.current.src = playlist[(currentTrack - 1 + playlist.length) % playlist.length].url;
      audioRef.current.play();
    }
  }, [uiState.isPlaying, currentTrack, playlist]);

  // Cleanup semua interval dan timeout
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Handle image error
  const handleImageError = useCallback((slideIndex) => {
    setImageErrors(prev => ({ ...prev, [slideIndex]: true }));
  }, []);

  // Loading screen
  if (!isClient || isLoading) {
    return (
      <main className="birthday-container loading-screen">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="loading-emoji"
        >
          🎂
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="loading-text"
        >
          Loading special memories...
        </motion.p>
      </main>
    );
  }

  return (
    <main className="birthday-container">
      {uiState.showConfetti && (
        <Confetti 
          width={typeof window !== 'undefined' ? window.innerWidth : 0} 
          height={typeof window !== 'undefined' ? window.innerHeight : 0}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      
      {/* Animated Background */}
      <div className="animated-bg">
        {/* Stars */}
        {animationsRef.current.stars.map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="star"
            style={{
              left: star.left + "%",
              top: star.top + "%",
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Bubbles */}
        {animationsRef.current.bubbles.map((bubble, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="bubble"
            style={{
              width: bubble.width,
              height: bubble.height,
              left: bubble.left + "%",
              top: bubble.top + "%",
              background: bubble.color,
            }}
            animate={{
              y: [0, -200],
              x: [0, Math.sin(i) * 100],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating Hearts */}
        {animationsRef.current.floatingHearts.map((heart, i) => (
          <motion.div
            key={`heart-${i}`}
            className="floating-heart"
            style={{
              left: heart.left + "%",
              fontSize: heart.size,
              top: "100%",
            }}
            animate={{
              y: [-1000, 0],
              rotate: [0, 360],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: "linear",
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* Hero Section with Parallax */}
      <section className="hero-section">
        <motion.div
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          className="parallax-bg"
        />
        
        <div className="hero-content">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="hero-emoji"
          >
            🎉
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hero-title"
          >
            HAPPY
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hero-title highlight"
          >
            BIRTHDAY!
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="hero-subtitle"
          >
            {namaPacar} ❤️
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="hero-buttons"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateUiState({ showSurprise: true })}
              className="btn btn-primary"
              aria-label="Open surprise"
            >
              🎁 Buka Kejutan
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateUiState({ showLoveLetter: true })}
              className="btn btn-secondary"
              aria-label="Read love letter"
            >
              💌 Baca Surat Cinta
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="scroll-indicator"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          aria-label="Scroll down"
        >
          ↓
        </motion.div>
      </section>

      {/* Gallery Section dengan foto yang sudah disiapkan */}
      <section className="gallery-section">
        <h3 className="section-title">
          ✨ Gallery Kenangan ✨
        </h3>

        <div className="gallery-grid">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, rotateY: 10 }}
              className="memory-card"
              style={{ background: `linear-gradient(135deg, ${memory.color}20, ${memory.color}40)` }}
              onClick={() => updateUiState({ selectedMemory: memory })}
              role="button"
              tabIndex={0}
              aria-label={`View memory: ${memory.title}`}
            >
              <div className="memory-image-wrapper">
                <img 
                  src={memory.image}
                  alt={memory.title}
                  className="memory-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const iconDiv = e.target.parentElement?.querySelector('.memory-icon-fallback');
                    if (iconDiv) iconDiv.style.display = 'flex';
                  }}
                />
                <div className="memory-icon-fallback" style={{ display: 'none' }}>
                  {memory.icon}
                </div>
              </div>
              <h4 className="memory-title">{memory.title}</h4>
              <p className="memory-date">{memory.date}</p>
              <p className="memory-desc">{memory.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3D Slideshow dengan 7 foto */}
      <section className="slideshow-section">
        <h3 className="section-title">
          📸 Momen Spesial
        </h3>

        <div className="slideshow-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, rotateY: 90, x: 500 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: -90, x: -500 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="slide-card"
            >
              <div className="slide-image">
                {!imageErrors[currentSlide] ? (
                  <img 
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].caption}
                    className="slide-img"
                    onError={() => handleImageError(currentSlide)}
                    loading="lazy"
                  />
                ) : (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="slide-placeholder"
                  >
                    <span className="slide-emoji">
                      {slides[currentSlide].emoji}
                    </span>
                    <p className="placeholder-text">Foto tidak tersedia</p>
                  </motion.div>
                )}
              </div>
              <div className="slide-content">
                <motion.h4
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="slide-caption"
                >
                  {slides[currentSlide].caption}
                </motion.h4>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="slide-message"
                >
                  {slides[currentSlide].message}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators - now with 7 indicators */}
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              onClick={() => setCurrentSlide(index)}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Birthday Card */}
      <section className="card-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ rotateY: 180 }}
          className="birthday-card"
        >
          <div className="card-front">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="card-emoji"
            >
              🎂
            </motion.div>
            <h3 className="card-title">Selamat Ulang Tahun!</h3>
            <p className="card-message">Semoga semua keinginanmu terkabul</p>
            <div className="card-hearts">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ delay: i * 0.1, duration: 1, repeat: Infinity }}
                >
                  ❤️
                </motion.span>
              ))}
            </div>
          </div>
          <div className="card-back">
            <p>I Love You! ❤️</p>
          </div>
        </motion.div>
      </section>

      {/* Surprise Modal */}
      <AnimatePresence>
        {uiState.showSurprise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => updateUiState({ showSurprise: false })}
          >
            <motion.div
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0, rotateY: -180 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="modal-content surprise-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Surprise message"
            >
              <div className="modal-border" />
              
              <h3 className="modal-title">
                🎉 SURPRISE! 🎉
              </h3>
              
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="modal-emoji"
              >
                🎁
              </motion.div>

              <p className="modal-text">
                Happy Birthday my love! 🎂❤️<br/>
                You mean the world to me!
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  updateUiState({ showSurprise: false });
                  triggerConfetti();
                }}
                className="modal-button"
                aria-label="Close surprise"
              >
                I Love You! ❤️
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Love Letter Modal */}
      <AnimatePresence>
        {uiState.showLoveLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => updateUiState({ showLoveLetter: false })}
          >
            <motion.div
              initial={{ scale: 0, y: 500 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 500 }}
              transition={{ type: "spring" }}
              className="modal-content letter-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Love letter"
            >
              <div className="letter-header">
                <h3 className="letter-title">💌 Surat Cinta</h3>
              </div>
              
              <div className="letter-body">
                <p className="letter-text">
                  {typedText}
                  <span className="cursor" />
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateUiState({ showLoveLetter: false })}
                className="letter-button"
                aria-label="Close love letter"
              >
                Tutup ❤️
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {uiState.selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => updateUiState({ selectedMemory: null })}
          >
            <motion.div
              initial={{ scale: 0, rotateX: -90 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0, rotateX: 90 }}
              className="modal-content memory-detail-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Memory details"
            >
              <img 
                src={uiState.selectedMemory.image}
                alt={uiState.selectedMemory.title}
                className="detail-image"
              />
              <div className="detail-emoji">{uiState.selectedMemory.icon}</div>
              <h3 className="detail-title">{uiState.selectedMemory.title}</h3>
              <p className="detail-date">{uiState.selectedMemory.date}</p>
              <p className="detail-desc">{uiState.selectedMemory.desc}</p>
              <p className="detail-footer">Forever in my heart ❤️</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Player */}
      <motion.div
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        className="music-player"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => updateUiState({ isPlaying: !uiState.isPlaying })}
          className="music-button"
          aria-label={uiState.isPlaying ? "Pause music" : "Play music"}
        >
          {uiState.isPlaying ? "🔊" : "🔈"}
        </motion.button>
        
        {uiState.isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="music-controls"
          >
            <button 
              onClick={prevTrack} 
              className="control-btn"
              aria-label="Previous track"
            >
              ⏮️
            </button>
            <span className="track-title">{playlist[currentTrack].title}</span>
            <button 
              onClick={nextTrack} 
              className="control-btn"
              aria-label="Next track"
            >
              ⏭️
            </button>
            
            <div className="volume-control">
              <span aria-label="Volume">🔊</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="volume-slider"
                aria-label="Volume control"
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="back-to-top"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        ↑
      </motion.button>

      {/* Footer */}
      <footer className="footer">
        <p className="footer">
          Made with ❤️ for the most special person in my world
        </p>
        <p className="footer-year">
          {new Date().getFullYear()} © Forever Yours
        </p>
      </footer>
    </main>
  );
}