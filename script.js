// --- 設定 ---
const emojiSounds = {
    '🫧': 'sounds/bubbles.mp3', '🌸': 'sounds/cherry_blossom.mp3', '🏜️': 'sounds/desert.mp3', '💧': 'sounds/droplet.mp3', '🍂': 'sounds/fallen_leaf.mp3', '🔥': 'sounds/fire.mp3', '🎆': 'sounds/fireworks.mp3', '🌧️': 'sounds/rain.mp3', '🌈': 'sounds/rainbow.mp3', '❄️': 'sounds/snowflake.mp3', '🎇': 'sounds/sparkler.mp3', '☀️': 'sounds/sunny.mp3', '🌅': 'sounds/sunrise.mp3', '🌇': 'sounds/sunset.mp3', '⛈️': 'sounds/thunder_cloud_rain.mp3', '🌪️': 'sounds/tornado.mp3', '🌳': 'sounds/tree.mp3', '🌋': 'sounds/volcano.mp3', '🌊': 'sounds/water_wave.mp3', '🪸': 'sounds/coral.mp3', '💥': 'sounds/boom.mp3', '🦁': 'sounds/lion_face.mp3', '🐘': 'sounds/elephant.mp3', '🐎': 'sounds/racehorse.mp3', '🐕': 'sounds/dog2.mp3', '🐈': 'sounds/cat2.mp3', '🐗': 'sounds/boar.mp3', '🐐': 'sounds/goat.mp3', '🐏': 'sounds/ram.mp3', '🐖': 'sounds/pig2.mp3', '🐮': 'sounds/cow.mp3', '🐺': 'sounds/wolf.mp3'
};
const INITIAL_VOLUME = 0.8;
const SLIDER_COLOR_ACTIVE = '#007bff';
const SLIDER_COLOR_INACTIVE = '#e9eef2';

// --- HTML要素を取得 ---
const displayArea = document.querySelector(".selected-emojis-display");
const filterToggleButton = document.getElementById("filter-toggle-button");
const filterMenu = document.getElementById("filter-menu");
const filterCheckboxes = document.querySelectorAll('#filter-menu input[name="category"]');
const emojiListItems = document.querySelectorAll('.emoji-list li');
const shareButton = document.getElementById('share-button');
const copyButton = document.getElementById('copy-button');

// --- グローバル変数 ---
const activeSounds = new Map();

// --- 関数定義 ---

/**
 * 状態を元に共有URLを生成する関数
 * @returns {string} 生成されたURL
 */
function generateUrlWithState() {
    if (activeSounds.size === 0) return window.location.origin + window.location.pathname;

    const state = [];
    activeSounds.forEach((sound, emoji) => {
        state.push({ emoji: emoji, volume: sound.volume() });
    });

    const jsonState = JSON.stringify(state);
    const encodedState = encodeURIComponent(jsonState);
    return `${window.location.origin}${window.location.pathname}?data=${encodedState}`;
}

// 他の関数は変更なし...
function updateSliderBackground(slider) {
    const percentage = slider.value * 100;
    slider.style.background = `linear-gradient(to right, ${SLIDER_COLOR_ACTIVE} 0%, ${SLIDER_COLOR_ACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} 100%)`;
}

function applyFilters() {
    const selectedCategories = Array.from(filterCheckboxes)
        .filter(cb => cb.checked && cb.value !== 'all')
        .map(cb => cb.value);
    const isAllSelected = Array.from(filterCheckboxes).find(cb => cb.value === 'all').checked;
    emojiListItems.forEach(item => {
        if (isAllSelected || selectedCategories.length === 0 || selectedCategories.includes(item.dataset.category)) {
            item.style.display = 'list-item';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * 特定の絵文字を選択状態にし、音を再生する関数
 * @param {string} emoji - 対象の絵文字
 * @param {number} volume - 初期音量
 */
function activateEmoji(emoji, volume) {
    const button = Array.from(document.querySelectorAll('.emoji-button')).find(btn => btn.textContent === emoji);
    if (!button || !emojiSounds[emoji]) return;

    button.classList.add("selected");

    const sound = new Howl({ src: [emojiSounds[emoji]], loop: true, volume: volume, html5: true });
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
    volumeSlider.value = volume;

    volumeSlider.addEventListener("input", () => {
        const currentSound = activeSounds.get(emoji);
        if (currentSound) { currentSound.volume(volumeSlider.value); }
        updateSliderBackground(volumeSlider);
    });

    newItem.appendChild(emojiIcon);
    newItem.appendChild(volumeSlider);
    displayArea.appendChild(newItem);
    updateSliderBackground(volumeSlider);
}

// --- イベントリスナーの設定 ---

// 共有ボタンのクリックイベント
shareButton.addEventListener('click', async () => {
    if (activeSounds.size === 0) {
        alert('共有する絵文字が選択されていません。');
        return;
    }
    
    const url = generateUrlWithState();
    const shareText = `🎵 私の作ったサウンドスケープを聴いてみて！\n\n#EmojiSoundscape`;

    try {
        await navigator.share({
            title: 'Emoji Soundscape',
            text: shareText,
            url: url,
        });
    } catch (err) {
        console.error('共有に失敗しました:', err);
    }
});

// コピーボタンのクリックイベント
copyButton.addEventListener('click', () => {
    if (activeSounds.size === 0) {
        alert('コピーする絵文字が選択されていません。');
        return;
    }
    const url = generateUrlWithState();
    navigator.clipboard.writeText(url).then(() => {
        alert('共有URLをクリップボードにコピーしました！');
    }).catch(err => {
        console.error('コピーに失敗しました:', err);
        alert('コピーに失敗しました。');
    });
});

// フィルター関連のイベントリスナーは変更なし
filterToggleButton.addEventListener('click', () => { filterMenu.classList.toggle('show'); });
filterCheckboxes.forEach(checkbox => { /* ... */ });

// 絵文字ボタンのクリックイベント（選択・解除のロジックを少し変更）
emojiListItems.forEach(item => {
    const button = item.querySelector('.emoji-button');
    button.addEventListener("click", () => {
        const emoji = button.textContent;
        const isSelected = button.classList.contains("selected");

        if (isSelected) {
            // 解除処理
            button.classList.remove("selected");
            const sound = activeSounds.get(emoji);
            if (sound) {
                sound.stop();
                activeSounds.delete(emoji);
            }
            const itemToRemove = displayArea.querySelector(`.selected-emoji-item[data-emoji="${emoji}"]`);
            if (itemToRemove) {
                displayArea.removeChild(itemToRemove);
            }
        } else {
            // 選択処理
            activateEmoji(emoji, INITIAL_VOLUME);
        }
    });
});

// --- ページ読み込み時の処理 ---
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');

    if (dataParam) {
        try {
            const decodedState = decodeURIComponent(dataParam);
            const state = JSON.parse(decodedState);
            
            if (Array.isArray(state)) {
                state.forEach(item => {
                    if (item.emoji && typeof item.volume === 'number') {
                        activateEmoji(item.emoji, item.volume);
                    }
                });
            }
        } catch (e) {
            console.error('URLパラメータの解析に失敗しました:', e);
        }
    }
});