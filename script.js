// --- 設定 ---
const emojiSounds = {
    '🫧': 'sounds/bubbles.mp3', '🌸': 'sounds/cherry_blossom.mp3', '🏜️': 'sounds/desert.mp3', '💧': 'sounds/droplet.mp3', '🍂': 'sounds/fallen_leaf.mp3', '🔥': 'sounds/fire.mp3', '🎆': 'sounds/fireworks.mp3', '🌧️': 'sounds/rain.mp3', '🌈': 'sounds/rainbow.mp3', '❄️': 'sounds/snowflake.mp3', '🎇': 'sounds/sparkler.mp3', '☀️': 'sounds/sunny.mp3', '🌅': 'sounds/sunrise.mp3', '🌇': 'sounds/sunset.mp3', '⛈️': 'sounds/thunder_cloud_rain.mp3', '🌪️': 'sounds/tornado.mp3', '🌳': 'sounds/tree.mp3', '🌋': 'sounds/volcano.mp3', '🌊': 'sounds/water_wave.mp3', '🪸': 'sounds/coral.mp3', '💥': 'sounds/boom.mp3', '🦁': 'sounds/lion_face.mp3', '🐘': 'sounds/elephant.mp3', '🐎': 'sounds/racehorse.mp3', '🐕': 'sounds/dog2.mp3', '🐈': 'sounds/cat2.mp3', '🐗': 'sounds/boar.mp3', '🐐': 'sounds/goat.mp3', '🐏': 'sounds/ram.mp3', '🐖': 'sounds/pig2.mp3', '🐮': 'sounds/cow.mp3', '🐺': 'sounds/wolf.mp3'
};
const INITIAL_VOLUME = 0.8;
const SLIDER_COLOR_ACTIVE = '#007bff';
const SLIDER_COLOR_INACTIVE = '#e9eef2';

// --- HTML要素の取得 ---
const displayArea = document.querySelector(".selected-emojis-display");
const emojiListItems = document.querySelectorAll('.emoji-list li');
const shareButton = document.getElementById('share-button');
const copyButton = document.getElementById('copy-button');
const filterToggleButton = document.getElementById("filter-toggle-button");
const filterMenu = document.getElementById("filter-menu");
const filterCheckboxes = document.querySelectorAll('#filter-menu input[name="category"]');
const playPauseButton = document.getElementById('play-pause-button');

// --- グローバル変数 ---
const activeSounds = new Map();
let isPlaying = false;

// --- 関数定義 ---
function updateSliderBackground(slider) {
    const percentage = slider.value * 100;
    slider.style.background = `linear-gradient(to right, ${SLIDER_COLOR_ACTIVE} 0%, ${SLIDER_COLOR_ACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} 100%)`;
}

function updatePlayPauseButton() {
    if (isPlaying) {
        playPauseButton.textContent = '停止';
        playPauseButton.classList.add('playing');
    } else {
        playPauseButton.textContent = '再生';
        playPauseButton.classList.remove('playing');
    }
}

// UIの生成とサウンドオブジェクトの準備を行う関数
function setupEmojiSound(emoji, volume) {
    const button = Array.from(document.querySelectorAll('.emoji-button')).find(btn => btn.textContent === emoji);
    if (!button || !emojiSounds[emoji]) return;

    button.classList.add("selected");
    
    // Howlオブジェクトを作成するが、まだ再生しない
    const sound = new Howl({ src: [emojiSounds[emoji]], loop: true, volume: volume, html5: true });
    activeSounds.set(emoji, sound);

    // UI要素を生成
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

// UIの削除とサウンドオブジェクトの破棄を行う関数
function teardownEmojiSound(emoji) {
    const button = Array.from(document.querySelectorAll('.emoji-button')).find(btn => btn.textContent === emoji);
    if (button) {
        button.classList.remove("selected");
    }

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


// --- イベントリスナー ---

// 絵文字ボタンのクリックイベント
emojiListItems.forEach(item => {
    const button = item.querySelector('.emoji-button');
    button.addEventListener("click", () => {
        const emoji = button.textContent;
        const isSelected = button.classList.contains("selected");
        
        if (isSelected) {
            teardownEmojiSound(emoji);
        } else {
            setupEmojiSound(emoji, INITIAL_VOLUME);
        }
    });
});

// 再生/停止ボタンのクリックイベント
playPauseButton.addEventListener('click', () => {
    // 状態を反転させる
    isPlaying = !isPlaying;

    if (isPlaying) {
        if (activeSounds.size > 0) {
            // 全てのサウンドを再生
            activeSounds.forEach(sound => {
                if (!sound.playing()) {
                    sound.play();
                }
            });
        } else {
            // 再生するサウンドがない場合は再生状態にしない
            isPlaying = false;
        }
    } else {
        // 全てのサウンドを停止
        activeSounds.forEach(sound => sound.pause());
    }
    updatePlayPauseButton();
});

// 共有・コピー機能
function generateShareText() {
    const dataToShare = [];
    document.querySelectorAll('.selected-emoji-item').forEach(item => {
        const emoji = item.dataset.emoji;
        const volume = item.querySelector('.volume-slider').value;
        dataToShare.push({ emoji, volume });
    });

    if (dataToShare.length === 0) return null;
    
    const jsonState = JSON.stringify(dataToShare);
    const encodedState = encodeURIComponent(jsonState);
    const url = `${window.location.origin}${window.location.pathname}?data=${encodedState}`;
    
    return `🎵 私の作ったサウンドスケープ 🎵\n\n${url}\n\n#EmojiSoundscape`;
}

shareButton.addEventListener('click', async () => {
    const shareText = generateShareText();
    if(!shareText) { alert('共有する絵文字が選択されていません。'); return; }
    try {
        await navigator.share({ title: 'Emoji Soundscape', text: shareText });
    } catch (err) { console.error('共有に失敗しました:', err); }
});

copyButton.addEventListener('click', () => {
    const shareText = generateShareText();
    if(!shareText) { alert('コピーする絵文字が選択されていません。'); return; }
    navigator.clipboard.writeText(shareText.split('\n\n')[1]) // URL部分だけをコピー
        .then(() => alert('共有URLをクリップボードにコピーしました！'))
        .catch(err => console.error('コピーに失敗しました:', err));
});

// フィルター機能
function applyFilters() {
    const selectedCategories = Array.from(filterCheckboxes).filter(cb => cb.checked && cb.value !== 'all').map(cb => cb.value);
    const isAllSelected = Array.from(filterCheckboxes).find(cb => cb.value === 'all').checked;
    emojiListItems.forEach(item => {
        if (isAllSelected || selectedCategories.length === 0 || selectedCategories.includes(item.dataset.category)) {
            item.style.display = 'list-item';
        } else {
            item.style.display = 'none';
        }
    });
}
filterToggleButton.addEventListener('click', () => { filterMenu.classList.toggle('show'); });
filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const allCheckbox = Array.from(filterCheckboxes).find(cb => cb.value === 'all');
        const currentCheckbox = event.target;
        if (currentCheckbox.value === 'all' && currentCheckbox.checked) {
            filterCheckboxes.forEach(cb => { if (cb.value !== 'all') cb.checked = false; });
        } else if (currentCheckbox.value !== 'all' && currentCheckbox.checked) {
            allCheckbox.checked = false;
        }
        const anyChecked = Array.from(filterCheckboxes).some(cb => cb.checked);
        if (!anyChecked) {
            allCheckbox.checked = true;
        }
        applyFilters();
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
                    if (item.emoji && typeof parseFloat(item.volume) === 'number') {
                        setupEmojiSound(item.emoji, parseFloat(item.volume));
                    }
                });
            }
        } catch (e) {
            console.error('URLパラメータの解析に失敗しました:', e);
        }
    }
});