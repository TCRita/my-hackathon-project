// --- 設定 ---
// 各絵文字に対応する音声ファイルのマッピング
const emojiSounds = {
    '🫧': 'sounds/bubbles.mp3',
    '🌸': 'sounds/cherry_blossom.mp3',
    '🏜️': 'sounds/desert.mp3',
    '💧': 'sounds/droplet.mp3',
    '🍂': 'sounds/fallen_leaf.mp3',
    '🔥': 'sounds/fire.mp3',
    '🎆': 'sounds/fireworks.mp3',
    '🌧️': 'sounds/rain.mp3',
    '🌈': 'sounds/rainbow.mp3',
    '❄️': 'sounds/snowflake.mp3',
    '🎇': 'sounds/sparkler.mp3',
    '☀️': 'sounds/sunny.mp3',
    '🌅': 'sounds/sunrise.mp3',
    '🌇': 'sounds/sunset.mp3',
    '⛈️': 'sounds/thunder_cloud_rain.mp3',
    '🌪️': 'sounds/tornado.mp3',
    '🌳': 'sounds/tree.mp3',
    '🌋': 'sounds/volcano.mp3',
    '🌊': 'sounds/water_wave.mp3'
};

const INITIAL_VOLUME = 0.8;
const SLIDER_COLOR_ACTIVE = '#007bff';
const SLIDER_COLOR_INACTIVE = '#e9eef2';

// --- HTML要素を取得 ---
const emojiButtons = document.querySelectorAll(".emoji-button");
const displayArea = document.querySelector(".selected-emojis-display");

// --- グローバル変数 ---
const activeSounds = new Map(); // 再生中のHowlオブジェクトを管理

// --- 関数定義 ---

/**
 * スライダーの背景グラデーションを更新
 * @param {HTMLInputElement} slider - 対象のスライダー要素
 */
function updateSliderBackground(slider) {
    const percentage = slider.value * 100;
    slider.style.background = `linear-gradient(to right, ${SLIDER_COLOR_ACTIVE} 0%, ${SLIDER_COLOR_ACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} 100%)`;
}


emojiButtons.forEach(button => {
    button.addEventListener("click", () => {
        const emoji = button.textContent;

        if (!emojiSounds[emoji]) {
            console.warn(`音声ファイルが設定されていません: ${emoji}`);
            return;
        }

        button.classList.toggle("selected");

        if (button.classList.contains("selected")) {
            // --- 音声再生とUI生成 ---
            const sound = new Howl({
                src: [emojiSounds[emoji]],
                loop: true,
                volume: INITIAL_VOLUME,
                html5: true
            });
            sound.play();
            activeSounds.set(emoji, sound);

            const newItem = document.createElement("div");
            newItem.className = "selected-emoji-item";
            newItem.dataset.emoji = emoji;

            const emojiIcon = document.createElement("span");
            emojiIcon.className = "emoji-icon";
            emojiIcon.textContent = emoji;

            const volumeSlider = document.createElement("input");
            volumeSlider.type = "range";
            volumeSlider.className = "volume-slider";
            volumeSlider.min = 0;
            volumeSlider.max = 1;
            volumeSlider.step = 0.01;
            volumeSlider.value = INITIAL_VOLUME;

            volumeSlider.addEventListener("input", () => {
                const currentSound = activeSounds.get(emoji);
                if (currentSound) {
                    currentSound.volume(volumeSlider.value);
                }
                updateSliderBackground(volumeSlider);
            });

            newItem.appendChild(emojiIcon);
            newItem.appendChild(volumeSlider);
            displayArea.appendChild(newItem);

            updateSliderBackground(volumeSlider);

        } else {
            // --- 音声停止とUI削除 ---
            const sound = activeSounds.get(emoji);
            if (sound) {
                sound.stop();
                activeSounds.delete(emoji);
            }
            
            const itemToRemove = displayArea.querySelector(`.selected-emoji-item[data-emoji="${emoji}"]`);
            if (itemToRemove) {
                displayArea.removeChild(itemToRemove);
            }
        }
    });
});