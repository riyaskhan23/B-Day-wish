
import { useEffect, useRef, useState } from 'react';
import './App.css';

// COMMON FLOATING HEARTS AND SPARKLING PARTICLES

function AnimatedBackground() {
  const hearts = ['💗', '💕', '❤️', '💖', '💘', '💗'];

  return (
    <div className="ambient-background">

      {/* Floating Hearts */}
      <div className="hearts-container">
        {hearts.map((heart, index) => (
          <span
            className="floating-heart"
            key={index}
            style={{
              left: `${10 + index * 15}%`,
              animationDelay: `${index * 1.5}s`,
              fontSize: `${20 + index * 5}px`
            }}
          >
            {heart}
          </span>
        ))}
      </div>

      {/* Sparkling Particles */}
      <div className="particles">
        {Array.from({ length: 35 }).map((_, index) => (
          <span
            key={index}
            className="particle"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 53) % 100}%`,
              animationDelay: `${index * 0.3}s`
            }}
          />
        ))}
      </div>

    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('welcome');
  const [candlesOn, setCandlesOn] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const [micStatus, setMicStatus] = useState('not-started');

  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  const hearts = ['💗', '💕', '❤️', '💖', '💘', '💗'];

  // MICROPHONE CLEANUP
  const stopMicrophone = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  // BLOW CANDLES
  const blowCandles = () => {
    if (!candlesOn) return;

    stopMicrophone();
    setCandlesOn(false);
    setMicStatus('stopped');
    setCelebrating(true);
  };

  // MICROPHONE BLOW DETECTION
  const startMicrophone = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setMicStatus('unsupported');
        return;
      }

      stopMicrophone();
      setMicStatus('listening');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      await audioContext.resume();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      const data = new Float32Array(analyser.fftSize);
      let loudFrames = 0;

      const detectBlow = () => {
        if (!streamRef.current) return;

        analyser.getFloatTimeDomainData(data);

        let sum = 0;

        for (let i = 0; i < data.length; i++) {
          sum += data[i] * data[i];
        }

        const volume = Math.sqrt(sum / data.length);

        if (volume > 0.12) {
          loudFrames++;
        } else {
          loudFrames = 0;
        }

        if (loudFrames >= 8) {
          blowCandles();
          return;
        }

        animationRef.current = requestAnimationFrame(detectBlow);
      };

      animationRef.current = requestAnimationFrame(detectBlow);

    } catch (error) {
      console.error('Microphone error:', error);
      stopMicrophone();
      setMicStatus('denied');
    }
  };

  // RESET CAKE
  const resetCake = () => {
    stopMicrophone();
    setCandlesOn(true);
    setCelebrating(false);
    setMicStatus('not-started');
  };

  // START CAKE SCREEN
  const openCake = () => {
    resetCake();
    setScreen('cake');
  };

  useEffect(() => {
    return () => stopMicrophone();
  }, []);

  return (
    <div className="birthday-app">

      {/* =================================
          1. WELCOME SCREEN
      ================================= */}

      {screen === 'welcome' && (
        <div className="welcome-screen">

          <AnimatedBackground />

          <div className="particles">
            {Array.from({ length: 20 }).map((_, index) => (
              <span
                key={index}
                className="particle"
                style={{
                  left: `${(index * 37) % 100}%`,
                  top: `${(index * 53) % 100}%`,
                  animationDelay: `${index * 0.3}s`
                }}
              />
            ))}
          </div>

          <div className="welcome-content">

            <div className="top-heart">💗</div>

            <p className="welcome-subtitle">
              A LITTLE SURPRISE FOR SOMEONE SPECIAL
            </p>

            <h1>
              Something Special
              <br />
              <span>For You Papa</span>
            </h1>

            <p className="welcome-description">
              Today is not just another day...
              <br />
              It's a day to celebrate truly special.
            </p>

            <div className="heart-divider">
              ────── ♥ ──────
            </div>

            <button
              className="surprise-button"
              onClick={() => setScreen('emotion')}
            >
              Open My Surprise ❤️
              <span className="button-arrow">→</span>
            </button>

            <p className="bottom-message">
              Made with endless love ♡
            </p>

          </div>
        </div>
      )}

      {/* =================================
          2. EMOTIONAL INTRODUCTION
      ================================= */}

      {screen === 'emotion' && (
        <div className="emotion-screen">

          <AnimatedBackground />

          <div className="emotion-decoration">
            💗　💕　❤️　💖　💕
          </div>

          <div className="journey-card">

            <p className="journey-subtitle">
              A JOURNEY OF LOVE
            </p>

            <h1>
              4+ Years...
              <br />
              <span>And Still, My Favourite Person ❤️</span>
            </h1>

            <div className="journey-divider">
              ────── ♥ ──────
            </div>

            <p className="journey-text">
              Papa...
              <br /><br />

              Amma ivlo naal varsham aachu namma love panni moreover namma kalyanam aagi. Namakulla neraya sanda neraya illa evlovo vanthuruku maa aana namma oru thadava kooda engayume vittu koduthathu illa. Enakku unna romba pudikum amma. May be sila sandaigal la varumpothu neraya vaartha pesiruppen naa oru lusu than pesiruppen amma sorry papa🥺.....
              <br /><br />

              Kutty maa namakku kalyanam nadakkum papa naa namburen than aana enakku ella situation um yosikiren amma ellathaiyume athanla romba bayama irruku papa. Kundu oru stable venum papa financial aah namma senthu kasta padanum nee solrathu ok aana enakku nee en kannuku theriyama kasta padurathe thaanga mudiyala appo kalayanam aagi kannuku ethir la kasta padurathu enakku romba valikkum papa🥺...
              <br /><br />

              Ammu naa eppovume ithoda love oda than irrupen papa unmaile kovathula kathurathu naala illa focused aah vela paakura naala unta pesala na unna maranthuten illa pasam koranchuruchu apdi nu artham illa ammu......
              <br /><br />

              I love you dii🥺❤️ I love you forever Kutty maa💋💋
              <br /><br />
              
              

              <strong>
                I want you in every chapter of my life. ❤️
              </strong>
            </p>

            <button
              className="journey-button"
              onClick={() => setScreen('loveMessage')}
            >
              Vaa aduthathu pannalam😘
            </button>

            <p className="journey-footer">
              Forever yours, Papa ❤️
            </p>

          </div>
        </div>
      )}

      {/* =================================
          3. PERSONAL LOVE MESSAGE
      ================================= */}

      {screen === 'loveMessage' && (
        <div className="love-message-screen">

          <AnimatedBackground />

          <div className="love-message-card">

            <div className="love-message-heart">
              💗
            </div>

            <p className="journey-subtitle">
              FROM MY HEART TO YOURS
            </p>

            <h1>
              My Dearest Papa
              <span> ❤️</span>
            </h1>

            <div className="journey-divider">
              ────── ♥ ──────
            </div>

            <p className="love-message-text">
              

              Thangam enakku nee ellar maariyum illa maa. Nee ennoda special unmaile. Nee naa ethaathu pesumpothu illa pannum pothu mathavangloda vachu unna compare pannatha maa nee enakku vera. Kundu nee first unna blame pannatha amma athe maari ennoda activites aah unnaya pudikala enakku apdi artham illa maa pls atha purunchuko amma. Amma chella pulla enta pesama irrukatha kovathula naa thappu pannuven panren than  illa sollala atha naa niyamam um paduthala ethaiyum aana naa atha ethume therinchu panna maaten daa papa.. Chellam Love you dii kundamma enna mannichuru ammu... Nee unnoda value aah first purunchuko amma pls... Papa unna naa yaarthu ethaathu solranga enta sollum pothu naa ethaathu kova paduren illa ethaathu solren naa unmaile manasula irrunthu than solren, not from mouth... Unna enakku romba pudikum dii kunthaniii...
              <br /><br />

              <strong>
                I love you today, tomorrow,
                and in every tomorrow after that. ❤️
              </strong>
            </p>

            <button
              className="journey-button"
              onClick={() => setScreen('reveal')}
            >
              One More Surprise Awaits You 🎁 →
            </button>

          </div>
        </div>
      )}

      {/* =================================
          4. GRAND BIRTHDAY REVEAL
      ================================= */}

      {screen === 'reveal' && (
        <div className="grand-reveal-screen">

          <AnimatedBackground />

          <div className="grand-reveal-content">

            <div className="reveal-decoration">
              ✨ 🎊 ✨ 🎉 ✨
            </div>

            <p className="journey-subtitle">
              THE MOMENT WE'VE BEEN WAITING FOR
            </p>

            <h1>
              HAPPY
              <br />
              <span>BIRTHDAY</span>
              <br />
              MY PAPA! ❤️
            </h1>

            <div className="grand-birthday-emoji">
              🎂
            </div>

            <p className="grand-reveal-text">
              Today, the world celebrates your birthday...
              <br />
              But I celebrate the beautiful person
              <br />
              who makes my world brighter.
            </p>

            <p className="grand-reveal-love">
              You deserve all the love and happiness! 💖
            </p>

            <button
              className="journey-button"
              onClick={openCake}
            >
              Let's Celebrate Your Birthday! 🎂 →
            </button>

          </div>
        </div>
      )}

      {/* =================================
          5. BIRTHDAY CAKE SCREEN
      ================================= */}

      {screen === 'cake' && (
        <div className="cake-screen">

          <AnimatedBackground />

          <div className="cake-glow"></div>

          <div className="cake-heading">

            <p className="cake-subtitle">
              TODAY IS ALL ABOUT YOU
            </p>

            <h1>
              Happy Birthday
              <span> My Love! ❤️</span>
            </h1>

            <p className="cake-description">
              Close your eyes, make a wish and blow your candles!
            </p>

          </div>

          {/* CAKE */}

          <div className={`cake-scene ${!candlesOn ? 'cake-extinguished' : ''}`}>

            <div className="cake-sparkles">
              ✦　 ✧　 ✦　 ✧　 ✦
            </div>

            <div className="candles">

              {[1, 2, 3, 4, 5].map((candle) => (
                <div className="candle" key={candle}>
                  {candlesOn && <div className="flame"></div>}
                  <div className="candle-stick"></div>
                </div>
              ))}

            </div>

            <div className="cake-top">
              <div className="cake-icing"></div>
              <span>♥</span>
              <span>✦</span>
              <span>♥</span>
            </div>

            <div className="cake-middle">
              <div className="cake-decoration">
                ♡　✦　♡　✦　♡
              </div>
            </div>

            <div className="cake-bottom">
              <div className="cake-decoration">
                ✦　♡　✦　♡　✦
              </div>
            </div>

            <div className="cake-plate"></div>

          </div>

          {/* BIRTHDAY CONTROLS */}

          {!celebrating ? (
            <div className="cake-controls">

              <button
                className="manual-blow-button"
                onClick={blowCandles}
              >
                💨 Blow Candles
              </button>

            </div>
          ) : (
            <div className="birthday-reveal">

              <h2>✨ Wish Made! ✨</h2>

              <p>
                May all your dreams come true,
                my beautiful girl! 💖
              </p>

              <p className="reveal-love">
                You deserve all the happiness in this world.
              </p>

              <button
                className="journey-button"
                onClick={() => setScreen('letter')}
              >
                Read Your Special Letter 💌 →
              </button>

            </div>
          )}

          {/* CONFETTI */}

          {celebrating && (
            <div className="confetti-container">

              {Array.from({ length: 70 }).map((_, index) => (
                <span
                  className="confetti"
                  key={index}
                  style={{
                    left: `${(index * 37) % 100}%`,
                    animationDelay: `${(index % 15) * 0.1}s`,
                    '--rotation': `${index * 47}deg`
                  }}
                >
                  {index % 3 === 0
                    ? '❤️'
                    : index % 3 === 1
                      ? '✨'
                      : '🎊'}
                </span>
              ))}

            </div>
          )}

        </div>
      )}

      {/* =================================
          6. SPECIAL BIRTHDAY LETTER
      ================================= */}

      {screen === 'letter' && (
        <div className="birthday-letter-screen">

          <AnimatedBackground />

          <div className="letter-container">

            <div className="letter-icon">
              💌
            </div>

            <p className="journey-subtitle">
              A LITTLE LETTER FOR YOU
            </p>

            <h1>
              To My
              <span> Papa ❤️</span>
            </h1>

            <div className="journey-divider">
              ────── ♥ ──────
            </div>

            <div className="letter-paper">

              <p>My sweetest Papa,</p>

              <p>
                Happy Birthday, Chellama ❤️
              </p>

              <p>
                Papa Happy Bithday daa ammu. Nee oru alagana soul maa pure papa. unakku yarukum kastam kodukka theriyathu papa ennaya thavara. Aana mathavanga athellam purunchuka maatranga maa. Thangama pls mathavanga solratha nee kekatha amma un paasam enna nu avangaluku thrla.
              </p>

              <p>
                Chellama Mama athai ku thanks sollu intha day la enakaga avanglta. Ipdi oru pullaya intha ulagathuku koduthathuku.
                Ammu onnu mattum solren thangam unakku kovam vantha tension aana pls naa seiratha follow pannu yaartayum pesatha amahiya irru maa pls thangama...
              </p>

              <p>
                Whenever life gets difficult, remember
                that you have someone who believes in you,
                supports you and loves you endlessly.
              </p>

              <p>
                Happy Birthday ponnsss❤️..... Eppovum nee happy aah irrukanum athu than ennoda aasa amma🥺🥺.... Naa irrunthalum illanalum....
                You are my Everything papa as always❤️.....
              </p>

              <p>
                Once again, happiest birthday, Papa.
                Un manasuku elleme nallatha than amma nadakkum.
              </p>

              <p className="letter-signature">
                Forever and always yours,
                <br />
                Un Purushan ❤️
              </p>

            </div>

            <div className="letter-ending">
              <span>💗</span>
              <p>
                4+ Years Down...
                <br />
                Forever To Go!
              </p>
              <span>💗</span>
            </div>

            <button
              className="journey-button"
              onClick={() => {
                resetCake();
                setScreen('welcome');
              }}
            >
              Relive Our Special Moment ❤️
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
