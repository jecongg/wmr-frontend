import React from 'react';
import { motion } from 'framer-motion';
// Menambahkan FaItunesNote untuk variasi ikon not
import { FaMusic, FaChalkboardTeacher, FaQuoteLeft, FaPlayCircle, FaItunesNote } from 'react-icons/fa';

// --- KOMPONEN BARU: FloatingNote (Hiasan Not Bergerak) ---
const FloatingNote = ({ icon, top, left, size, color, delay, duration }) => {
  // Variasi gerakan agar tidak terlihat seragam
  const randomY = [0, -20, 0, 15, 0];
  const randomX = [0, 10, 0, -10, 0];
  const randomRotate = [0, 10, -10, 5, 0];

  return (
    <motion.div
      className={`absolute ${size} ${color} opacity-50 pointer-events-none`} // pointer-events-none agar tidak menghalangi klik mouse
      style={{ top: top, left: left }}
      animate={{
        y: randomY,
        x: randomX,
        rotate: randomRotate,
      }}
      transition={{
        duration: duration, // Durasi animasi (semakin besar, semakin pelan)
        repeat: Infinity,   // Mengulang terus menerus
        ease: "easeInOut",
        delay: delay,       // Penundaan mulai agar tidak mulai bersamaan
      }}
    >
      {icon}
    </motion.div>
  );
};

// --- Komponen Pendukung Lainnya (Sama seperti sebelumnya) ---

// Komponen untuk animasi saat scroll (untuk konten utama)
const AnimatedSection = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

// Komponen Header
const Header = () => (
  <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50"> {/* Menambah backdrop blur agar modern */}
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-gray-800 font-poppins">Wisma Musik <span className="text-indigo-600">Rhapsody</span></div>
      <div className="hidden md:flex space-x-6 font-medium">
        <a href="#hero" className="text-gray-600 hover:text-indigo-600 transition">Beranda</a>
        <a href="#about" className="text-gray-600 hover:text-indigo-600 transition">Tentang Kami</a>
        <a href="#programs" className="text-gray-600 hover:text-indigo-600 transition">Program</a>
        <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition">Testimoni</a>
      </div>
      <button className="hidden md:block bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg font-medium">
        Daftar Sekarang
      </button>
    </nav>
  </header>
);

const HeroSection = () => (
  <section id="hero" className="relative bg-gradient-to-b from-indigo-50 to-white py-28 overflow-hidden">
    
    <div className="absolute inset-0 z-0">
        {/* UPDATE: Warna diubah ke shade yang lebih gelap (misal: -200 menjadi -300) */}
        <FloatingNote icon={<FaMusic />} top="15%" left="10%" size="text-4xl md:text-6xl" color="text-indigo-300" delay={0} duration={8} />
        <FloatingNote icon={<FaItunesNote />} top="25%" left="85%" size="text-3xl md:text-5xl" color="text-purple-300" delay={2} duration={10} />
        <FloatingNote icon={<FaMusic />} top="65%" left="5%" size="text-5xl md:text-7xl" color="text-pink-300" delay={1} duration={12} />
        <FloatingNote icon={<FaItunesNote />} top="75%" left="80%" size="text-4xl md:text-6xl" color="text-blue-300" delay={3} duration={9} />
        
        {/* Not tambahan juga digelapkan warnanya */}
        <FloatingNote icon={<FaMusic />} top="10%" left="60%" size="text-2xl" color="text-indigo-200" delay={0.5} duration={15} />
        <FloatingNote icon={<FaItunesNote />} top="85%" left="30%" size="text-3xl" color="text-purple-200" delay={1.5} duration={14} />
    </div>

    {/* --- Konten Utama Hero (Tidak ada perubahan) --- */}
    <div className="container mx-auto px-6 text-center relative z-10">
      <motion.span
        className="text-indigo-600 font-semibold tracking-wider uppercase mb-4 block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Wisma Musik Rhapsody
      </motion.span>
      <motion.h1 
        className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight font-poppins"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Temukan Harmoni & <br className="hidden md:block" /> Bakat Musikmu Di Sini
      </motion.h1>
      <motion.p 
        className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Pendidikan musik berkualitas dengan kurikulum menyenangkan, fasilitas modern, dan pengajar profesional untuk segala usia.
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row justify-center items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-indigo-500/30 w-full sm:w-auto">
          Lihat Program Pilihan
        </button>
        <button className="group bg-white text-gray-800 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 transition duration-300 flex items-center justify-center w-full sm:w-auto">
          <FaPlayCircle className="mr-3 text-indigo-600 group-hover:scale-110 transition-transform" /> Tonton Profil
        </button>
      </motion.div>
    </div>
    
    <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ffffff" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
    </div>
  </section>
);

// Komponen Tentang Kami (Sedikit styling update biar lebih fresh)
const AboutSection = () => (
  <section id="about" className="py-20 bg-white relative z-20"> {/* z-20 untuk memastikan di atas lengkungan hero */}
    <div className="container mx-auto px-6">
      <AnimatedSection>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 relative">
            {/* Kotak hiasan di belakang gambar */}
            <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-indigo-200 rounded-2xl z-0"></div>
            <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Belajar Musik" className="rounded-2xl shadow-2xl relative z-10"/>
          </div>
          <div className="lg:w-1/2">
            <span className="text-indigo-600 font-semibold uppercase tracking-wider mb-2 block">Tentang Kami</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-poppins leading-tight">Membangun Masa Depan Melalui <span className="text-indigo-600 underline decoration-wavy decoration-indigo-300">Musik</span></h2>
            <div className="text-lg text-gray-600 space-y-4 leading-relaxed">
              <p>
                Wisma Musik Rhapsody didirikan dengan satu visi: membuat pendidikan musik berkualitas dapat diakses dan dinikmati oleh semua orang. Sejak 2010, kami telah mencetak ribuan talenta muda.
              </p>
              <p>
                Kami memadukan kurikulum standar internasional dengan pendekatan yang personal. Di sini, musik bukan sekadar menekan tuts atau memetik senar, tetapi tentang ekspresi diri dan pembentukan karakter.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-bold text-gray-800 text-xl">10+ Tahun</h4>
                    <p className="text-gray-500 text-sm">Pengalaman</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-bold text-gray-800 text-xl">50+ Mentor</h4>
                    <p className="text-gray-500 text-sm">Profesional</p>
                </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

// Komponen Program Les
const ProgramsSection = () => {
    const programs = [
        { icon: <FaMusic/>, title: "Piano Klasik & Pop", desc: "Kuasai dasar hingga teknik mahir piano dengan kurikulum yang disesuaikan minat siswa.", color: "bg-blue-50 text-blue-600" },
        { icon: <FaChalkboardTeacher/>, title: "Gitar Akustik & Elektrik", desc: "Pelajari strumming, picking, dan melodi favoritmu dengan teknik yang benar.", color: "bg-purple-50 text-purple-600" },
        { icon: <FaItunesNote/>, title: "Vokal & Paduan Suara", desc: "Temukan karakter suaramu, latih pernapasan, dan tampil percaya diri di panggung.", color: "bg-pink-50 text-pink-600" },
        { icon: <FaMusic/>, title: "Biola & String", desc: "Gesekan penuh perasaan dimulai dari pondasi yang kuat bersama instruktur ahli.", color: "bg-indigo-50 text-indigo-600" },
    ];

    return(
        <section id="programs" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-semibold uppercase tracking-wider">Layanan Kami</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2 font-poppins">Program Kelas Pilihan</h2>
                        <p className="text-gray-600 mt-4 max-w-xl mx-auto">Kami menyediakan berbagai kelas instrumen untuk tingkat pemula hingga tingkat lanjut.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {programs.map((program, index) => (
                            <motion.div 
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 text-center group cursor-pointer"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-6 ${program.color} group-hover:scale-110 transition-transform duration-300`}>
                                    {program.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{program.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    )
};

// Komponen Testimoni
const TestimonialsSection = () => (
    <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6">
            <AnimatedSection>
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-poppins">Kata Mereka</h2>
                    <p className="text-gray-600 mt-4">Pengalaman nyata dari siswa dan orang tua murid kami.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card Testimoni 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-50 relative">
                        <FaQuoteLeft className="text-indigo-100 text-5xl absolute top-6 left-6 -z-0"/>
                        <div className="relative z-10 pt-6">
                            <p className="text-gray-700 mb-6 italic leading-relaxed">"Progres anak saya di piano luar biasa. Miss Rina sangat sabar dan tahu cara membuat anak betah latihan. Konser tahunannya juga sangat profesional!"</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center font-bold text-indigo-700 mr-3">S</div>
                                <div>
                                    <p className="font-bold text-gray-900">Ibu Sarah</p>
                                    <p className="text-xs text-gray-500">Orang Tua Murid Piano</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     {/* Card Testimoni 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-50 relative">
                        <FaQuoteLeft className="text-purple-100 text-5xl absolute top-6 left-6 -z-0"/>
                         <div className="relative z-10 pt-6">
                            <p className="text-gray-700 mb-6 italic leading-relaxed">"Saya mulai les gitar dari nol di usia 25. Awalnya ragu, tapi atmosfer di Rhapsody sangat mendukung. Sekarang saya sudah pede main di acara kantor."</p>
                            <div className="flex items-center">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Budi" className="w-10 h-10 rounded-full mr-3 grayscale hover:grayscale-0 transition"/>
                                <div>
                                    <p className="font-bold text-gray-900">Budi Setiawan</p>
                                    <p className="text-xs text-gray-500">Siswa Gitar Dewasa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     {/* Card Testimoni 3 */}
                    <div className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-50 relative">
                        <FaQuoteLeft className="text-pink-100 text-5xl absolute top-6 left-6 -z-0"/>
                         <div className="relative z-10 pt-6">
                            <p className="text-gray-700 mb-6 italic leading-relaxed">"Teknik vokal saya membaik pesat. Guru mengajarkan anatomi suara dengan cara yang mudah dimengerti. Sangat recommended!"</p>
                            <div className="flex items-center">
                                 <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Ani" className="w-10 h-10 rounded-full mr-3 grayscale hover:grayscale-0 transition"/>
                                <div>
                                    <p className="font-bold text-gray-900">Ani Wijaya</p>
                                    <p className="text-xs text-gray-500">Siswa Vokal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    </section>
);

// Komponen CTA (Call to Action) sebelum footer
const CTASection = () => (
    <section className="py-20 bg-indigo-600 relative overflow-hidden">
        {/* Hiasan background tipis */}
        <FaMusic className="absolute top-10 left-10 text-indigo-500 text-8xl opacity-20 rotate-12" />
        <FaItunesNote className="absolute bottom-10 right-10 text-indigo-400 text-9xl opacity-20 -rotate-12" />
        
        <div className="container mx-auto px-6 text-center relative z-10">
            <AnimatedSection>
                <h2 className="text-3xl md:text-5xl font-bold text-white font-poppins mb-6">Siap Memulai Perjalanan Musikmu?</h2>
                <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10">Dapatkan sesi Konsultasi & Trial Gratis selama 30 menit untuk menentukan instrumen yang pas untukmu.</p>
                <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition duration-300 shadow-xl">
                    Klaim Trial Gratis Sekarang
                </button>
            </AnimatedSection>
        </div>
    </section>
)

// Komponen Footer
const Footer = () => (
    <footer id="contact" className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                {/* Kolom 1: Info Brand */}
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-white mb-4 font-poppins">Wisma Musik <span className="text-indigo-400">Rhapsody</span></h3>
                    <p className="text-gray-400 leading-relaxed mb-6 pr-4">
                        Tempat di mana bakat dikembangkan dan harmoni diciptakan. Bergabunglah dengan komunitas kami dan rasakan keindahan bermusik.
                    </p>
                    <div className="flex space-x-4 text-xl">
                        <a href="#" className="text-gray-400 hover:text-white transition"><FaPlayCircle/></a> {/* Ganti icon sosmed yg sesuai */}
                        <a href="#" className="text-gray-400 hover:text-white transition"><FaMusic/></a>
                    </div>
                </div>
                
                {/* Kolom 2: Link Cepat */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-4">Navigasi</h4>
                    <ul className="space-y-2">
                        <li><a href="#hero" className="hover:text-indigo-400 transition">Beranda</a></li>
                        <li><a href="#about" className="hover:text-indigo-400 transition">Tentang Kami</a></li>
                        <li><a href="#programs" className="hover:text-indigo-400 transition">Program Les</a></li>
                        <li><a href="#" className="hover:text-indigo-400 transition">Blog Musik</a></li>
                    </ul>
                </div>

                {/* Kolom 3: Kontak */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-4">Hubungi Kami</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start">
                            <span className="font-semibold text-white mr-2">A:</span> 
                            Jl. Melodi Indah No. 123, Jakarta Selatan, Indonesia
                        </li>
                        <li className="flex items-center">
                            <span className="font-semibold text-white mr-2">P:</span> 
                            (021) 123-4567 (WA Available)
                        </li>
                        <li className="flex items-center">
                            <span className="font-semibold text-white mr-2">E:</span> 
                            hello@rhapsody.id
                        </li>
                        <li className="mt-4 text-gray-500">
                            Buka: Senin - Sabtu (09.00 - 20.00)
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Wisma Musik Rhapsody. Dibuat untuk tujuan pembelajaran.</p>
            </div>
        </div>
    </footer>
);


const LandingPage = () => {
  return (
    <div className="bg-white overflow-x-hidden"> {/* overflow-x-hidden mencegah scroll horizontal tak diinginkan */}
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <TestimonialsSection />
        <CTASection /> {/* Menambahkan bagian Call to Action baru */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;