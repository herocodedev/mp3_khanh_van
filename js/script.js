const data = [
  {
    name: "Cô Đơn Không Giành Cho Ai",
    singer: "Khánh Văn",
    path: "../data/audio/KhanhVan.mp3",
    image: "../img/casikhanhvan.jpg",
  },
];
// Global
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
// Element
const audioEl = $("audio");
const playListEl = $(".playlist");
const listMusicEl = $(".list-music.recent-play-list");
const changeBackgroundBtn = $(".change-background-btn .toggle-switch input");
const wrapperEl = $(".wrapper");
// Property
let currentIndex = 0;
let timeStartAudio = 0;
let timeEndAudio = 0;
let isPlaying = false;
let isRepeat = false;
let isRandom = false;

// Method
const clearActiveSong = () => {
  Array.from($$(".playlist-item")).map((item, index) => {
    item.classList.remove("isActive");
  });
};

const addDurationSong = (time) => {
  time = Math.floor(time);
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time - minutes * 60);

  // Format seconds
  if (seconds.toString().length === 1) seconds = "0" + seconds;

  const timeString = minutes.toString() + ":" + seconds.toString();
  $(".bars .song .time-started").innerHTML = "0:00";
  $(".bars .song .time-ended").innerHTML = timeString;
};

const addCurrentTimeSong = (percentCurrentTime, totalTime) => {
  let time = (percentCurrentTime / 100) * totalTime;
  // time = Math.floor(time);

  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time - minutes * 60);

  if (minutes.toString().length === 1) minutes = "0" + minutes;
  if (seconds.toString().length === 1) seconds = "0" + seconds;

  const timeString = minutes.toString() + ":" + seconds.toString();
  $(".bars .song .time-started").innerHTML = timeString;
};
const scrollToInterview = () => {
  $(".bars .song").scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
};
const renderRecentMusic = () => {
  const htmls = data.map((item, index) => {
    return `<li class="playlist-item ${"song-" + index}" data-index=${index}>
        <div class="song">
          <div class="song-left">
            <h3 class="song-number">${index + 1}</h3>
            <img
              class="song-image"
              src="${item.image}"
              alt=""
            />
            <div class="song-info">
              <h3>${
                item.name.length > 30
                  ? item.name.slice(0, 30) + "..."
                  : item.name
              }
              <p>${item.singer}</p>
            </div>
          </div>
          <div class="song-right">
          <p class="time">3:45</p>
            <p class="song-play-btn">
              <img style="width:20px;height:20px;" class="pause-btn" src="https://thumbs.gfycat.com/OblongWanIchneumonfly-max-1mb.gif" alt="">
              <i class="fa-solid fa-play play-btn"></i>
            </p>
            <p class="add-song">
              <i class="fa-solid fa-plus"></i>
            </p>
          </div>
        </div>
      </li>`;
  });
  playListEl.innerHTML = htmls.join("");
};

const renderBarSong = () => {
  const currentSong = data[currentIndex];
  const html = `
            <h3>Now playing</h3>
            <div class="song-image glassmorphism">
              <div style="position: relative" class="song-thumbnail">
                <img
                class="gif-playing"
                src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif"
                alt=""
              />
                <img src=${currentSong.image} alt="" />
              </div>
              <p class="song-name">${
                currentSong.name.length > 10
                  ? currentSong.name.slice(0, 10) + "..."
                  : currentSong.name
              }</p>
              <p class="song-artist">${currentSong.singer}</p>
            </div>
            <div class="progress-bars">
              <span class="time-started">2:40</span>
              <input
                id="progress"
                class="progress"
                type="range"
                value="0"
                step="1"
                min="0"
                max="100"
              />
              <span class="time-ended">3:45</span>
            </div>
            <!-- Control -->
            <div class="control">
              <div class="btn btn-repeat">
                <i class="fas fa-redo"></i>
              </div>
              <div class="btn btn-prev">
                <i class="fas fa-step-backward"></i>
              </div>
              <div class="btn btn-toggle-play">
                <i class="fas fa-pause icon-pause"></i>
                <i class="fas fa-play icon-play"></i>
              </div>
              <div class="btn btn-next">
                <i class="fas fa-step-forward"></i>
              </div>
              <div class="btn btn-random">
                <i class="fas fa-random"></i>
              </div>
        </div>
    `;
  const htmls = [html];
  $(".bars .song").innerHTML = htmls.join("");
};

const renderSetting = () => {
  const repeatSongBtn = $(".btn-repeat");
  const randomSongBtn = $(".btn-random");
  if (isRandom) randomSongBtn.classList.add("isActive");
  if (isRepeat) repeatSongBtn.classList.add("isActive");
};

const toggleBtnSongPlaying = (isTurn) => {
  if (isTurn) {
    $(".main .content").classList.add("isPlaying");
    $(".bars .song").classList.add("playing");
  } else {
    $(".main .content").classList.remove("isPlaying");
    $(".bars .song").classList.remove("playing");
  }
};

const nextSong = () => {
  currentIndex++;
  if (currentIndex >= data.length) currentIndex = 0;
  loadCurrentSong();
  scrollToInterview();
};

const prevSong = () => {
  currentIndex--;
  if (currentIndex < 0) currentIndex = data.length - 1;
  loadCurrentSong();
  scrollToInterview();
};

const randomSong = () => {
  let newIndex = currentIndex;
  while (newIndex === currentIndex) {
    newIndex = Math.floor(Math.random() * data.length);
  }
  currentIndex = newIndex;
};

const handleEvents = () => {
  const playBarBtn = $(".bars .song .control .btn-toggle-play");
  const progressInput = $(".bars .song .progress-bars .progress");
  const thumnailSong = $(".bars .song .song-thumbnail");
  const nextSongBtn = $(".bars .song .control .btn-next");
  const prevSongBtn = $(".bars .song .control .btn-prev");
  const repeatSongBtn = $(".btn-repeat");
  const randomSongBtn = $(".btn-random");
  // CD Rotate
  const cdThumbAnimate = thumnailSong.animate(
    [{ transform: "rotate(360deg)" }],
    {
      duration: 10000,
      iterations: Infinity,
    }
  );
  cdThumbAnimate.pause();

  // Change background
  changeBackgroundBtn.onchange = (e) => {
    let textDarkColor = "#fff";
    let textWhiteColor = "#283353";

    if (e.target.checked) {
      wrapperEl.style.background = "#1e1f35";
      $(".category").style.color = textDarkColor;
      $(".logo-name").style.color = textDarkColor;
      $(".logo").style.color = textDarkColor;
      $(".main .header").style.color = textDarkColor;
      Array.from($$(".main .content h3")).forEach((item, index) => {
        item.style.color = textDarkColor;
      });

      Array.from($$(".main .content h4")).forEach((item, index) => {
        item.style.color = textDarkColor;
      });
      Array.from($$(".bars h3")).forEach((item, index) => {
        item.style.color = textDarkColor;
      });
      Array.from($$(".bars p")).forEach((item, index) => {
        item.style.color = textDarkColor;
      });
    } else {
      wrapperEl.style.background = "#fff";
      $(".category").style.color = textWhiteColor;
      $(".logo-name").style.color = textWhiteColor;
      $(".logo").style.color = textWhiteColor;
      $(".main .header").style.color = textWhiteColor;

      Array.from($$(".main .content h3")).forEach((item, index) => {
        item.style.color = textWhiteColor;
      });

      Array.from($$(".main .content h4")).forEach((item, index) => {
        item.style.color = textWhiteColor;
      });
      Array.from($$(".bars h3")).forEach((item, index) => {
        item.style.color = textWhiteColor;
      });
      Array.from($$(".bars p")).forEach((item, index) => {
        item.style.color = textWhiteColor;
      });
    }
  };

  // Play song when click
  listMusicEl.onclick = (e) => {
    const songNode = e.target.closest(".playlist-item:not(.isActive)");

    if (songNode) {
      // Clear Active Song
      clearActiveSong();

      // Add Active Song
      songNode.classList.add("isActive");

      // Toggle btn play/pause
      toggleBtnSongPlaying(true);

      // Scroll bar into view
      scrollToInterview();

      // Load Current Song
      currentIndex = Number(songNode.dataset.index);
      loadCurrentSong();
      audioEl.play();
    }
  };

  // Play song when click play
  playBarBtn.onclick = (e) => {
    if (!isPlaying) audioEl.play();
    else audioEl.pause();
  };

  // When song playing
  audioEl.onplay = () => {
    // Play
    isPlaying = true;
    toggleBtnSongPlaying(true);

    // Add animation
    cdThumbAnimate.play();
    thumnailSong.style.borderRadius = "50%";
  };

  // When song pause
  audioEl.onpause = () => {
    // Pause
    isPlaying = false;
    toggleBtnSongPlaying(false);

    // Pause animation
    cdThumbAnimate.pause();
  };

  // When progress time change
  audioEl.ontimeupdate = () => {
    const progressPercent = (audioEl.currentTime * 100) / audioEl.duration;
    if (!Object.is(progressPercent, NaN)) {
      progressInput.value = progressPercent.toFixed(2);
      addCurrentTimeSong(progressPercent, audioEl.duration);
    }
  };

  // When seek time changes
  progressInput.onchange = (e) => {
    const seekTime = (e.target.value / 100) * audioEl.duration;
    const progressPercent = (seekTime * 100) / audioEl.duration;
    audioEl.currentTime = seekTime;
    addCurrentTimeSong(progressPercent, audioEl.duration);
  };

  // When click next song
  nextSongBtn.onclick = (e) => {
    if (isRandom) {
      randomSong();
      loadCurrentSong();
      audioEl.play();
    } else {
      nextSong();
      audioEl.play();
    }
  };

  // When click prev song
  prevSongBtn.onclick = (e) => {
    prevSong();

    audioEl.play();
  };

  // When click random song btn
  randomSongBtn.onclick = (e) => {
    isRandom = !isRandom;
    randomSongBtn.classList.toggle("isActive", isRandom);
  };

  // When click repeat song btn
  repeatSongBtn.onclick = (e) => {
    isRepeat = !isRepeat;
    repeatSongBtn.classList.toggle("isActive", isRepeat);
  };

  // When audio ended
  audioEl.onended = (e) => {
    if (isRepeat) audioEl.play();
    else if (isRandom) {
      randomSong();
      loadCurrentSong();
      audioEl.play();
    } else {
      nextSong();
      audioEl.play();
    }
  };
};

const loadCurrentSong = () => {
  const currentSong = data[currentIndex];
  const classCurrentSongEl = "song-" + currentIndex;
  const currentSongEl = $(`.${classCurrentSongEl}`);

  // Load src
  audioEl.src = currentSong.path;
  audioEl.onloadedmetadata = function () {
    addDurationSong(audioEl.duration);
  };

  // Clear Active song
  clearActiveSong();

  // Add Active
  currentSongEl.classList.add("isActive");

  // Render bar song
  renderBarSong();

  // Handle Event when load new song
  handleEvents();

  // Render option playlist
  renderSetting();
};

const main = () => {
  // Render RencentMusic
  renderRecentMusic();

  // Load Current Song
  loadCurrentSong();

  // Handle Envent
  handleEvents();
};

main();
