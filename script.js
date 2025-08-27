    const emojiSounds = {
        "🌧️": "sounds/rain.mp3",
        "☀️": "sounds/sunny.mp3",
        "⛈️": "sounds/thunder_cloud_rain.mp3",
        "❄️": "sounds/snowflake.mp3",
        "🌈": "sounds/rainbow.mp3",
        "🌊": "sounds/water_wave.mp3",
        "🔥": "sounds/fire.mp3",
        "🌳": "sounds/tree.mp3",
        "🌸": "sounds/cherry_blossom.mp3",
        "🌅": "sounds/sunrise.mp3"
    };

    // 音声オブジェクトを保存するマップ
    const activeSounds = {};

    // すべての絵文字ボタンを取得
    const emojiButtons = document.querySelectorAll(".emoji-button");

    emojiButtons.forEach(button => {
        button.addEventListener("click", () => {
            const emoji = button.textContent;

            // クラス切り替え
            button.classList.toggle("selected");

            if (button.classList.contains("selected")) {
                // 音を作って再生（ループON）
                const audio = new Audio(emojiSounds[emoji]);
                audio.loop = true;
                audio.play();
                activeSounds[emoji] = audio;
            } else {
                // 音を止める
                if (activeSounds[emoji]) {
                    activeSounds[emoji].pause();
                    activeSounds[emoji].currentTime = 0; // 巻き戻し
                    delete activeSounds[emoji];
                }
            }
        });
    });
