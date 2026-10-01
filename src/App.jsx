import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, Heart, Music2, Pause, Play, Volume2, X } from 'lucide-react';
import { birthdayConfig as config } from './data/birthdayConfig.js';
import { Reveal, SectionTitle, Stars } from './components/Primitives.jsx';

const letter = `Dear You,\n\nSome people enter our lives quietly,\nand somehow they become the loudest part of our hearts.\n\nYou became one of the most beautiful chapters of my life.\n\nI know your future will be bright,\nand every moment with you is something I want to remember.\n\nOn your birthday,\nI hope you receive all the happiness you deserve,\nand that all your wishes come true very soon.\n\nYou are loved.\nYou are appreciated.\nAnd you are incredibly special to me.\n\nHappy Birthday, my love. ♥`;
const qualities = [
  ['Your smile', 'It has a way of making everything feel a little lighter.'],
  ['Your kindness', 'The softness you give the world says everything about you.'],
  ['The way you understand me', 'Even the parts I have trouble putting into words.'],
  ['Your little habits', 'The tiny details that make you unmistakably you.'],
  ['The way you make ordinary days special', 'You turn the everyday into something I look forward to.'],
  ['Simply… you', 'There is no one else I would rather celebrate today.']
];

export default function App() {
  const reduceMotion = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [surprise, setSurprise] = useState(false);
  const [photo, setPhoto] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [musicMissing, setMusicMissing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audio = useRef(null);
  const letterRef = useRef(null);
  const [letterVisible, setLetterVisible] = useState(false);

  useEffect(() => {
    const node = letterRef.current;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setLetterVisible(true); observer.disconnect(); } }, { threshold: .15 });
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (photo < 0) return;
    const onKey = (e) => { if (e.key === 'Escape') setPhoto(-1); if (e.key === 'ArrowRight') setPhoto((x) => (x + 1) % config.memories.length); if (e.key === 'ArrowLeft') setPhoto((x) => (x - 1 + config.memories.length) % config.memories.length); };
    window.addEventListener('keydown', onKey); document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [photo]);
  const toggleMusic = async () => {
    if (!audio.current) return;
    if (playing) { audio.current.pause(); setPlaying(false); return; }
    try { await audio.current.play(); setPlaying(true); setMusicMissing(false); } catch { setPlaying(false); setMusicMissing(true); }
  };
  const updateTime = () => { const el = audio.current; if (el?.duration) { setProgress(el.currentTime / el.duration * 100); setDuration(el.duration); } };
  const seek = (e) => { if (audio.current?.duration) audio.current.currentTime = Number(e.target.value) / 100 * audio.current.duration; };
  const fmt = (n) => `${Math.floor((n || 0) / 60)}:${String(Math.floor((n || 0) % 60)).padStart(2, '0')}`;

  return <main>
    <div className="ambient" aria-hidden="true" /><Stars />
    <AnimatePresence>
      {!opened && <motion.div className="intro" key="intro" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04, filter: 'blur(14px)' }} transition={{ duration: 1.15 }}>
        <div className="intro-orbit" /><motion.div className="intro-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .8 }}>
          <span className="eyebrow">A LITTLE NOTE FOR YOU</span><h1>Hey, Birthday Girl<span className="soft-heart"> ♥</span></h1><p>I made something just for you.</p>
          <button className="button button-primary" onClick={() => { setOpened(true); toggleMusic(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); }}>Open Your Surprise <span>✧</span></button>
          <span className="intro-foot">MADE WITH ALL MY HEART</span>
        </motion.div>
      </motion.div>}
    </AnimatePresence>

    <header className="topbar"><a className="monogram" href="#home" aria-label="Back to top">A<span>♥</span></a><a className="top-link" href="#story">OUR STORY <span>✧</span></a></header>
    <section className="hero" id="home">
      <motion.div className="hero-content" initial={false} animate={opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: .9, delay: .15 }}>
        <span className="eyebrow">{config.relationshipDate}</span><h1>Happy Birthday,<br /><em>{config.nickname}</em><span className="soft-heart"> ♥</span></h1>
        <p className="hero-note">{config.birthdayMessage}</p><a href="#story" className="scroll-cue"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
      </motion.div>
      <motion.div className="hero-image-wrap" initial={false} animate={opened ? { opacity: 1, scale: 1 } : { opacity: 0, scale: .94 }} transition={{ duration: 1.15, delay: .28 }}>
        <div className="hero-image-frame"><img src={config.heroImage} alt="A favorite moment" /><div className="image-caption"><span>MY FAVORITE VIEW</span><Heart size={14} /></div></div><span className="halo halo-one"/><span className="halo halo-two"/><span className="image-index">01 / ∞</span>
      </motion.div><span className="hero-vertical">A STORY WRITTEN IN LITTLE MOMENTS</span>
    </section>

    <section className="story section" id="story"><SectionTitle eyebrow="CHAPTER ONE · US">Our Little Story</SectionTitle><div className="timeline">{config.milestones.map(([title, copy], i) => <Reveal className={`timeline-row ${i % 2 ? 'reverse' : ''}`} key={title}><div className="timeline-marker"><span>0{i + 1}</span><i /></div><article className="glass timeline-card"><span className="card-date">A LITTLE PIECE OF FOREVER</span><h3>{title}</h3><p>{copy}</p></article></Reveal>)}</div><p className="story-note">And somehow, every chapter keeps getting better.</p></section>

    <section className="gallery-section section" id="memories"><SectionTitle eyebrow="CHAPTER TWO · THE LITTLE THINGS">Little Moments,<br className="mobile-break" /> Big Memories</SectionTitle><p className="section-deck">A few frames from a story I never want to stop telling.</p><div className="gallery-grid">{config.memories.map((item, i) => <motion.button className={`gallery-item g${i % 4}`} key={`${item.image}-${i}`} onClick={() => setPhoto(i)} whileHover={reduceMotion ? {} : { y: -6, scale: 1.012 }} aria-label={`Open memory ${i + 1}`}><img src={item.image} alt={item.caption} loading="lazy" /><span className="gallery-overlay"><span>0{i + 1}</span><span>{item.caption}</span></span></motion.button>)}</div><p className="gallery-foot">TAP A MEMORY TO TAKE A CLOSER LOOK <span>↗</span></p></section>

    <section className="letter-section section" id="letter"><SectionTitle eyebrow="CHAPTER THREE · FROM MY HEART">A Letter For You</SectionTitle><article className="letter-card" ref={letterRef}><div className="letter-top"><span>FOR YOUR EYES ONLY</span><span>♥</span></div><div className="letter-copy"><pre className={letterVisible ? 'revealed' : ''}>{letter}</pre></div><div className="letter-sign">With love, always</div><span className="letter-seal">A</span></article></section>

    <section className="special-section section"><SectionTitle eyebrow="CHAPTER FOUR · ALL THE REASONS">Why You're Special</SectionTitle><p className="section-deck">If I tried to name them all, we'd be here forever.</p><div className="qualities-grid">{qualities.map(([title, copy], i) => <Reveal key={title}><motion.article className="glass quality-card" whileHover={reduceMotion ? {} : { rotateX: 3, rotateY: i % 2 ? -3 : 3, y: -6 }}><span className="quality-number">0{i + 1}</span><span className="quality-spark">✧</span><h3>{title}</h3><p>{copy}</p></motion.article></Reveal>)}</div></section>

    <section className="song-section section" id="song"><SectionTitle eyebrow="CHAPTER FIVE · THE SOUNDTRACK">Our Song</SectionTitle><p className="section-deck">Some songs just sound like us.</p><div className="music-card glass"><div className={`vinyl ${playing ? 'is-playing' : ''}`}><div className="vinyl-label"><Music2 size={22}/></div></div><div className="track-info"><span className="eyebrow">A SONG THAT FEELS LIKE HOME</span><h3>{config.songTitle}</h3><p>{config.songArtist}</p><div className="player-controls"><button className="play-button" onClick={toggleMusic} aria-label={playing ? 'Pause song' : 'Play song'}>{playing ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}</button><div className="progress-wrap"><div className="track-times"><span>{fmt(audio.current?.currentTime)}</span><span>{duration ? fmt(duration) : '—:—'}</span></div><input type="range" min="0" max="100" value={progress} onChange={seek} aria-label="Song progress" style={{ '--progress': `${progress}%` }}/></div><Volume2 size={17} className="volume-icon"/></div><span className="music-hint">{musicMissing ? 'Add gulbahar.mp3 to public/music to hear this track.' : 'Tap play when you’re ready to listen.'}</span></div></div><audio ref={audio} src="/music/gulbahar.mp3" onTimeUpdate={updateTime} onLoadedMetadata={updateTime} onError={() => { setPlaying(false); setMusicMissing(true); }} onEnded={() => setPlaying(false)} preload="none" /></section>

    <section className="eyes-section"><div className="eyes-image"><img src={config.finalImage} alt="A beautiful moment together" loading="lazy"/><div className="eyes-shade"/></div><Reveal className="eyes-copy"><span className="eyebrow">JUST IN CASE YOU FORGET</span><p className="eyes-first">If I could give you one thing today…</p><h2>I’d give you the ability<br/>to see yourself <em>through my eyes.</em></h2><p className="eyes-last">Then you’d finally understand<br/>how special you really are.</p></Reveal><span className="eyes-index">A NOTE TO KEEP</span></section>

    <section className="surprise-section section"><span className="eyebrow">THE LAST LITTLE CHAPTER</span><h2>One More Thing<span className="soft-heart"> ♥</span></h2><p>I saved my favorite words for last.</p><button className="button button-primary surprise-button" onClick={() => setSurprise(true)}>Open It <Heart size={15}/></button><div className="surprise-decoration">✧</div></section>
    <footer className="footer"><span className="eyebrow">THE END, AND ALSO A BEGINNING</span><h2>Happy Birthday,<br/><em>{config.girlfriendName}</em><span className="soft-heart"> ♥</span></h2><p>With all my love,<br/><strong>Akash</strong></p><span className="footer-heart">♥</span><span className="footer-always">♥ ALWAYS YOURS</span><span className="footer-made">MADE ESPECIALLY FOR YOU · 2026</span></footer>

    <AnimatePresence>{photo >= 0 && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPhoto(-1)}><button className="lightbox-close" onClick={() => setPhoto(-1)} aria-label="Close"><X/></button><button className="lightbox-arrow left" onClick={(e) => { e.stopPropagation(); setPhoto((photo - 1 + config.memories.length) % config.memories.length); }} aria-label="Previous"><ArrowLeft/></button><motion.figure key={photo} initial={{ scale: .94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .96 }} transition={{ duration: .35 }} onClick={(e) => e.stopPropagation()}><img src={config.memories[photo].image} alt={config.memories[photo].caption}/><figcaption><span>0{photo + 1} / 0{config.memories.length}</span>{config.memories[photo].caption}</figcaption></motion.figure><button className="lightbox-arrow right" onClick={(e) => { e.stopPropagation(); setPhoto((photo + 1) % config.memories.length); }} aria-label="Next"><ArrowRight/></button></motion.div>}</AnimatePresence>
    <AnimatePresence>{surprise && <motion.div className="surprise-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="lightbox-close" onClick={() => setSurprise(false)} aria-label="Close"><X/></button><motion.div className="surprise-content" initial={{ opacity: 0, scale: .92, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .3, duration: 1 }}><span className="surprise-star">✧</span><span className="eyebrow">TODAY, AND EVERY DAY AFTER</span><h2>Happy Birthday,<br/><em>{config.girlfriendName}</em><span className="soft-heart"> ♥</span></h2><p>Here’s to more memories,<br/>more laughter, more adventures,<br/>and more moments together.</p><img src={config.finalImage} alt="A birthday memory"/><span className="surprise-from">With all my love · Akash</span></motion.div></motion.div>}</AnimatePresence>
  </main>;
}
