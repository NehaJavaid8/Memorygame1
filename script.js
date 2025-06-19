// Game variables
    let emojis, cards, board, flippedCards, matchedPairs, level = 1, interval, score = 0, startTime;
    const levelConfigs = {
      1: ['🍎','🍕','🐶','🎈'],
      2: ['🍎','🍕','🐶','🎈','🚗','🌟'],
      3: ['🍎','🍕','🐶','🎈','🚗','🌟','🐱','⚽️']
    };

    // DOM elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startBtn = document.getElementById('start-btn');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const levelCompleteModal = document.getElementById('level-complete-modal');
    const gameCompleteModal = document.getElementById('game-complete-modal');

    // Sounds
    const flipSound = new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/pop.ogg'] });
    const matchSound = new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'] });
    const winSound = new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/sci-fi_win.ogg'] });
    const completeSound = new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'] });

    // Initialize game
    function initGame() {
      board = document.getElementById('game-board');
      board.innerHTML = '';
      flippedCards = [];
      matchedPairs = 0;
      emojis = levelConfigs[level];
      cards = [...emojis, ...emojis];
      cards.sort(() => 0.5 - Math.random());
      
      // Update UI
      document.getElementById('level').textContent = level;
      document.getElementById('score').textContent = score;
      document.getElementById('timer').textContent = '0';
      
      // Clear previous interval and start timer
      clearInterval(interval);
      startTime = Date.now();
      interval = setInterval(updateTimer, 1000);

      // Create cards
      cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        board.appendChild(card);

        card.addEventListener('click', handleCardClick);
      });
    }

    // Handle card clicks
    function handleCardClick() {
      if (flippedCards.length >= 2 || this.classList.contains('flipped')) return;

      const emoji = this.dataset.emoji;
      this.textContent = emoji;
      gsap.to(this, { rotateY: 180, duration: 0.4 });
      this.classList.add('flipped');
      flipSound.play();
      flippedCards.push(this);

      if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;
        if (card1.dataset.emoji === card2.dataset.emoji) {
          // Match found
          matchSound.play();
          matchedPairs++;
          score += 10;
          document.getElementById('score').textContent = score;
          flippedCards = [];

          // Check if level is complete
          if (matchedPairs === emojis.length) {
            levelComplete();
          }
        } else {
          // No match
          setTimeout(() => {
            gsap.to(card1, { rotateY: 0, duration: 0.4, onComplete: () => card1.textContent = '' });
            gsap.to(card2, { rotateY: 0, duration: 0.4, onComplete: () => card2.textContent = '' });
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
          }, 800);
        }
      }
    }

    // Update timer display
    function updateTimer() {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      document.getElementById('timer').textContent = seconds;
    }

    // Handle level completion
    function levelComplete() {
      clearInterval(interval);
      const time = Math.floor((Date.now() - startTime) / 1000);
      winSound.play();
      createConfetti();
      
      // Update modal content
      document.getElementById('completed-level').textContent = level;
      document.getElementById('completed-time').textContent = time;
      document.getElementById('completed-score').textContent = score;
      
      if (level < 3) {
        document.getElementById('next-level').textContent = level + 1;
        setTimeout(() => {
          levelCompleteModal.classList.remove('hidden');
        }, 1000);
      } else {
        document.getElementById('total-score').textContent = score;
        setTimeout(() => {
          gameCompleteModal.classList.remove('hidden');
          completeSound.play();
        }, 1000);
      }
    }

    // Create confetti effect
    function createConfetti() {
      const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
      
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        document.body.appendChild(confetti);
        
        const animationDuration = Math.random() * 3 + 2;
        
        gsap.to(confetti, {
          y: window.innerHeight + 10,
          x: Math.random() * 200 - 100,
          rotation: Math.random() * 360,
          duration: animationDuration,
          ease: 'power1.out',
          onComplete: () => confetti.remove()
        });
      }
    }

    // Event listeners
    startBtn.addEventListener('click', () => {
      startScreen.classList.add('hidden');
      gameScreen.classList.remove('hidden');
      initGame();
    });

    nextLevelBtn.addEventListener('click', () => {
      level++;
      levelCompleteModal.classList.add('hidden');
      initGame();
    });

    playAgainBtn.addEventListener('click', () => {
      level = 1;
      score = 0;
      gameCompleteModal.classList.add('hidden');
      initGame();
    });

    // Initialize game when DOM is loaded
    window.addEventListener('DOMContentLoaded', () => {
      // Show start screen by default
    });