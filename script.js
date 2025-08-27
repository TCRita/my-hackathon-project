document.addEventListener("DOMContentLoaded", () => {
    // 絵文字と音ファイルの対応
    const emojiSounds = {
        "🌧️": new Howl({ src: ['sounds/rain.mp3'], loop: true, volume: 0.5 }),
        "☀️": new Howl({ src: ['sounds/sunny.mp3'], loop: true, volume: 0.5 }),
        "⛈️": new Howl({ src: ['sounds/thunder_cloud_rain.mp3'], loop: true, volume: 0.5 }),
        "❄️": new Howl({ src: ['sounds/snowflake.mp3'], loop: true, volume: 0.5 }),
        "🌈": new Howl({ src: ['sounds/rainbow.mp3'], loop: true, volume: 0.5 }),
        "🌊": new Howl({ src: ['sounds/water_wave.mp3'], loop: true, volume: 0.5 }),
        "🔥": new Howl({ src: ['sounds/fire.mp3'], loop: true, volume: 0.5 }),
        "🌳": new Howl({ src: ['sounds/tree.mp3'], loop: true, volume: 0.5 }),
        "🌸": new Howl({ src: ['sounds/cherry_blossom.mp3'], loop: true, volume: 0.5 }),
        "🌅": new Howl({ src: ['sounds/sunrise.mp3'], loop: true, volume: 0.5 })
    };

    const emojiButtons = document.querySelectorAll(".emoji-button");

    emojiButtons.forEach(button => {
        button.addEventListener("click", () => {
            const emoji = button.textContent;
            button.classList.toggle("selected");

            if (button.classList.contains("selected")) {
                emojiSounds[emoji].play();
            } else {
                emojiSounds[emoji].stop();
            }
        });
    });
});
