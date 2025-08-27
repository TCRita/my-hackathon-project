document.addEventListener("DOMContentLoaded", () => {
    const emojiSounds = {
        "🌧️": new Howl({ src: ['sounds/rain.mp3'], loop: true, volume: 0.8 }),
        "☀️": new Howl({ src: ['sounds/sunny.mp3'], loop: true, volume: 0.8 }),
        "⛈️": new Howl({ src: ['sounds/thunder_cloud_rain.mp3'], loop: true, volume: 0.8 }),
        "❄️": new Howl({ src: ['sounds/snowflake.mp3'], loop: true, volume: 0.8 }),
        "🌈": new Howl({ src: ['sounds/rainbow.mp3'], loop: true, volume: 0.8 }),
        "🌊": new Howl({ src: ['sounds/water_wave.mp3'], loop: true, volume: 0.8 }),
        "🔥": new Howl({ src: ['sounds/fire.mp3'], loop: true, volume: 0.8 }),
        "🌳": new Howl({ src: ['sounds/tree.mp3'], loop: true, volume: 0.8 }),
        "🌸": new Howl({ src: ['sounds/cherry_blossom.mp3'], loop: true, volume: 0.8 }),
        "🌅": new Howl({ src: ['sounds/sunrise.mp3'], loop: true, volume: 0.8 }),
        "🌇": new Howl({ src: ['sounds/sunset.mp3'], loop: true, volume: 0.8 }),
        "🌪️": new Howl({ src: ['sounds/tornado.mp3'], loop: true, volume: 0.8 }),
        "🌋": new Howl({ src: ['sounds/volcano.mp3'], loop: true, volume: 0.8 }),
        "🎆": new Howl({ src: ['sounds/fireworks.mp3'], loop: true, volume: 0.8 }),
        "🎇": new Howl({ src: ['sounds/sparkler.mp3'], loop: true, volume: 0.8 }),
        "🫧": new Howl({ src: ['sounds/bubbles.mp3'], loop: true, volume: 0.8 }),
        "🏜️": new Howl({ src: ['sounds/desert.mp3'], loop: true, volume: 0.8 }),
        "💧": new Howl({ src: ['sounds/droplet.mp3'], loop: true, volume: 0.8 }),
        "🍂": new Howl({ src: ['sounds/fallen_leaf.mp3'], loop: true, volume: 0.8 }),
        "🪸": new Howl({ src: ['sounds/coral.mp3'], loop: true, volume: 0.8 }),
        "💥": new Howl({ src: ['sounds/boom.mp3'], loop: true, volume: 0.8 }),
        "🦁": new Howl({ src: ['sounds/lion_face.mp3'], loop: true, volume: 0.8 }),
        "🐘": new Howl({ src: ['sounds/elephant.mp3'], loop: true, volume: 0.8 }),
        "🐎": new Howl({ src: ['sounds/racehorse.mp3'], loop: true, volume: 0.8 }),
        "🐕": new Howl({ src: ['sounds/dog2.mp3'], loop: true, volume: 0.8 }),
        "🐈": new Howl({ src: ['sounds/cat2.mp3'], loop: true, volume: 0.8 }),
        "🐗": new Howl({ src: ['sounds/boar.mp3'], loop: true, volume: 0.8 }),
        "🐐": new Howl({ src: ['sounds/goat.mp3'], loop: true, volume: 0.8 }),
        "🐏": new Howl({ src: ['sounds/ram.mp3'], loop: true, volume: 0.8 }),
        "🐖": new Howl({ src: ['sounds/pig2.mp3'], loop: true, volume: 0.8 }),
        "🐮": new Howl({ src: ['sounds/cow.mp3'], loop: true, volume: 0.8 }),
        "🐺": new Howl({ src: ['sounds/wolf.mp3'], loop: true, volume: 0.8 })
    };


    const emojiButtons = document.querySelectorAll(".emoji-button");
    const displayArea = document.querySelector(".selected-emojis-display");

    emojiButtons.forEach(button => {
        button.addEventListener("click", () => {
            const emoji = button.textContent;
            const sound = emojiSounds[emoji];
            button.classList.toggle("selected");

            if (button.classList.contains("selected")) {
                // 音を再生
                sound.play();

                // 選択された絵文字を display に追加
                const item = document.createElement("div");
                item.className = "selected-emoji-item";
                item.dataset.emoji = emoji;

                const icon = document.createElement("span");
                icon.className = "emoji-icon";
                icon.textContent = emoji;

                const slider = document.createElement("input");
                slider.type = "range";
                slider.min = 0;
                slider.max = 1;
                slider.step = 0.01;
                slider.value = sound.volume();
                slider.className = "volume-slider";

                // スライダーで音量調整
                slider.addEventListener("input", () => {
                    sound.volume(parseFloat(slider.value));
                });

                item.appendChild(icon);
                item.appendChild(slider);
                displayArea.appendChild(item);

            } else {
                // 音を停止
                sound.stop();

                // display から削除
                const item = displayArea.querySelector(`.selected-emoji-item[data-emoji='${emoji}']`);
                if (item) item.remove();
            }
        });
    });
});