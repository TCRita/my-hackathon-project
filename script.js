// --- 設定 ---
const emojiSounds = {
    '🫧': 'sounds/bubbles.mp3', '🌸': 'sounds/cherry_blossom.mp3', '🏜️': 'sounds/desert.mp3', '💧': 'sounds/droplet.mp3', '🍂': 'sounds/fallen_leaf.mp3', '🔥': 'sounds/fire.mp3', '🎆': 'sounds/fireworks.mp3', '🌧️': 'sounds/rain.mp3', '🌈': 'sounds/rainbow.mp3', '❄️': 'sounds/snowflake.mp3', '🎇': 'sounds/sparkler.mp3', '☀️': 'sounds/sunny.mp3', '🌅': 'sounds/sunrise.mp3', '🌇': 'sounds/sunset.mp3', '⛈️': 'sounds/thunder_cloud_rain.mp3', '🌪️': 'sounds/tornado.mp3', '🌳': 'sounds/tree.mp3', '🌋': 'sounds/volcano.mp3', '🌊': 'sounds/water_wave.mp3', '🪸': 'sounds/coral.mp3', '💥': 'sounds/boom.mp3', '🦁': 'sounds/lion_face.mp3', '🐘': 'sounds/elephant.mp3', '🐎': 'sounds/racehorse.mp3', '🐕': 'sounds/dog2.mp3', '🐈': 'sounds/cat2.mp3', '🐗': 'sounds/boar.mp3', '🐐': 'sounds/goat.mp3', '🐏': 'sounds/ram.mp3', '🐖': 'sounds/pig2.mp3', '🐮': 'sounds/cow.mp3', '🐺': 'sounds/wolf.mp3'
};
const INITIAL_VOLUME = 0.8;
const INITIAL_RATE = 1.0;
const SLIDER_COLOR_ACTIVE = '#007bff';
const SLIDER_COLOR_INACTIVE = '#e9eef2';

// --- HTML要素の取得 ---
const displayArea = document.querySelector(".selected-emojis-display");
const sliderLabelsHeader = document.getElementById("slider-labels-header");
const emojiListItems = document.querySelectorAll('.emoji-list li');
const shareButton = document.getElementById('share-button');
const copyButton = document.getElementById('copy-button');
const filterToggleButton = document.getElementById("filter-toggle-button");
const filterMenu = document.getElementById("filter-menu");
const filterCheckboxes = document.querySelectorAll('#filter-menu input[name="category"]');
const playPauseButton = document.getElementById('play-pause-button');
const saveFavoriteButton = document.getElementById('save-favorite-button');
const favoritesListButton = document.getElementById('favorites-list-button');
const favoritesMenu = document.getElementById('favorites-menu');
const diceButton = document.getElementById('dice-button');

// --- グローバル変数 ---
const activeSounds = new Map();
let isPlaying = false;

// --- 関数定義 ---
function updateSliderBackground(slider) {
    const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, ${SLIDER_COLOR_ACTIVE} 0%, ${SLIDER_COLOR_ACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} 100%)`;
}

function updateLabelsHeaderVisibility() {
    sliderLabelsHeader.style.visibility = activeSounds.size > 0 ? 'visible' : 'hidden';
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

function clearCurrentState() {
    isPlaying = false;
    activeSounds.forEach(sound => sound.stop());
    updatePlayPauseButton();
    Array.from(activeSounds.keys()).forEach(emoji => teardownEmojiSound(emoji));
}

function setupEmojiSound(emoji, volume, rate) {
    const button = Array.from(document.querySelectorAll('.emoji-button')).find(btn => btn.textContent === emoji);
    if (!button || !emojiSounds[emoji] || activeSounds.has(emoji)) return;

    button.classList.add("selected");
    const sound = new Howl({ 
        src: [emojiSounds[emoji]], 
        loop: true, 
        volume: volume, 
        rate: rate,
        html5: true 
    });
    activeSounds.set(emoji, sound);

    const newItem = document.createElement("div");
    newItem.className = "selected-emoji-item";
    newItem.dataset.emoji = emoji;

    const emojiIcon = document.createElement("span");
    emojiIcon.className = "emoji-icon";
    emojiIcon.textContent = emoji;

    const volumeContainer = document.createElement('div');
    volumeContainer.className = 'slider-container';
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
    volumeContainer.appendChild(volumeSlider);
    
    const rateContainer = document.createElement('div');
    rateContainer.className = 'slider-container';
    const rateSlider = document.createElement("input");
    rateSlider.type = "range";
    rateSlider.className = "rate-slider";
    rateSlider.min = 0.5;
    rateSlider.max = 2.0;
    rateSlider.step = 0.1;
    rateSlider.value = rate;
    rateSlider.addEventListener("input", () => {
        const currentSound = activeSounds.get(emoji);
        if (currentSound) { currentSound.rate(rateSlider.value); }
        updateSliderBackground(rateSlider);
    });
    rateContainer.appendChild(rateSlider);

    newItem.appendChild(emojiIcon);
    newItem.appendChild(volumeContainer);
    newItem.appendChild(rateContainer);
    displayArea.appendChild(newItem);
    
    updateSliderBackground(volumeSlider);
    updateSliderBackground(rateSlider);
    updateLabelsHeaderVisibility();
}

function teardownEmojiSound(emoji) {
    const button = Array.from(document.querySelectorAll('.emoji-button')).find(btn => btn.textContent === emoji);
    if (button) { button.classList.remove("selected"); }

    const sound = activeSounds.get(emoji);
    if (sound) { sound.stop(); activeSounds.delete(emoji); }

    const itemToRemove = displayArea.querySelector(`.selected-emoji-item[data-emoji="${emoji}"]`);
    if (itemToRemove) { displayArea.removeChild(itemToRemove); }
    
    updateLabelsHeaderVisibility();
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('emojiSoundscapeFavorites') || '[]');
}

function saveFavorites(favorites) {
    localStorage.setItem('emojiSoundscapeFavorites', JSON.stringify(favorites));
}

function renderFavoritesMenu() {
    favoritesMenu.innerHTML = '';
    const favorites = getFavorites();
    if (favorites.length === 0) {
        favoritesMenu.innerHTML = '<div style="padding: 8px 12px; color: #888;">保存リストは空です</div>';
        return;
    }
    favorites.forEach((fav, index) => {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.dataset.index = index;
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = fav.name;
        item.appendChild(nameSpan);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-favorite-button';
        deleteButton.textContent = '×';
        item.appendChild(deleteButton);
        
        favoritesMenu.appendChild(item);
    });
}

function playRandomCombination() {
    clearCurrentState();
    const baseSounds = ['🌧️', '🌊', '🌳', '🔥', '☀️', '🏜️'];
    const accentSounds = ['💧', '🍂', '🌸', '💥', '🦁', '🐘', '🐎', '🐕', '🐈', '🐗', '🐐', '🐏', '🐖', '🐮', '🐺'];
    const getRandom = (arr, num) => arr.sort(() => 0.5 - Math.random()).slice(0, num);
    const randomBases = getRandom(baseSounds, Math.random() > 0.5 ? 1 : 2);
    const randomAccents = getRandom(accentSounds, Math.random() > 0.5 ? 1 : 2);
    const combination = Array.from(new Set([...randomBases, ...randomAccents]));
    combination.forEach(emoji => {
        if (emojiSounds[emoji]) {
            setupEmojiSound(emoji, INITIAL_VOLUME, INITIAL_RATE);
        }
    });
    isPlaying = true;
    activeSounds.forEach(sound => sound.play());
    updatePlayPauseButton();
}

function generateShareText() {
    const dataToShare = Array.from(activeSounds.entries()).map(([emoji, sound]) => ({ 
        emoji, 
        volume: sound.volume(),
        rate: sound.rate()
    }));
    if (dataToShare.length === 0) return null;
    const jsonState = JSON.stringify(dataToShare);
    const encodedState = encodeURIComponent(jsonState);
    const url = `${window.location.origin}${window.location.pathname}?data=${encodedState}`;
    return `🎵 私の作ったサウンドスケープ 🎵\n\n${url}\n\n#EmojiSoundscape`;
}

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

// --- イベントリスナー ---

emojiListItems.forEach(item => {
    const button = item.querySelector('.emoji-button');
    button.addEventListener("click", () => {
        const emoji = button.textContent;
        const isSelected = button.classList.contains("selected");
        if (isSelected) {
            teardownEmojiSound(emoji);
        } else {
            setupEmojiSound(emoji, INITIAL_VOLUME, INITIAL_RATE);
            if (isPlaying) {
                activeSounds.get(emoji).play();
            }
        }
    });
});

playPauseButton.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        if (activeSounds.size > 0) {
            activeSounds.forEach(sound => { if (!sound.playing()) sound.play(); });
        } else { isPlaying = false; }
    } else {
        activeSounds.forEach(sound => sound.pause());
    }
    updatePlayPauseButton();
});

saveFavoriteButton.addEventListener('click', () => {
    const currentSettings = Array.from(activeSounds.entries()).map(([emoji, sound]) => ({ 
        emoji, 
        volume: sound.volume(),
        rate: sound.rate()
    }));
    if (currentSettings.length === 0) {
        alert('保存する絵文字が選択されていません。');
        return;
    }
    const name = prompt('この組み合わせの名前を入力してください:', 'お気に入り');
    if (name) {
        const favorites = getFavorites();
        favorites.push({ name, settings: currentSettings });
        saveFavorites(favorites);
        renderFavoritesMenu();
    }
});

favoritesListButton.addEventListener('click', () => {
    favoritesMenu.classList.toggle('show');
});

favoritesMenu.addEventListener('click', (e) => {
    const target = e.target;
    const item = target.closest('.favorite-item');
    if (!item) return;

    const index = parseInt(item.dataset.index, 10);
    let favorites = getFavorites();
    const favorite = favorites[index];

    if (target.classList.contains('delete-favorite-button')) {
        e.stopPropagation();
        if (confirm(`「${favorite.name}」を削除しますか？`)) {
            favorites.splice(index, 1);
            saveFavorites(favorites);
            renderFavoritesMenu();
        }
    } else {
        if (favorite) {
            clearCurrentState();
            favorite.settings.forEach(s => {
                const rate = s.rate || INITIAL_RATE;
                const volume = s.volume || INITIAL_VOLUME;
                setupEmojiSound(s.emoji, volume, rate);
            });
            favoritesMenu.classList.remove('show');
        }
    }
});

diceButton.addEventListener('click', playRandomCombination);
document.addEventListener('click', (e) => {
    if (!favoritesListButton.contains(e.target) && !favoritesMenu.contains(e.target)) {
        favoritesMenu.classList.remove('show');
    }
    if (!filterToggleButton.contains(e.target) && !filterMenu.contains(e.target)) {
        filterMenu.classList.remove('show');
    }
});
shareButton.addEventListener('click', async () => {
    const shareText = generateShareText();
    if (!shareText) { alert('共有する絵文字が選択されていません。'); return; }
    try {
        await navigator.share({ title: 'Emoji Soundscape', text: shareText.split('\n\n')[1] });
    } catch (err) { console.error('共有に失敗しました:', err); }
});

copyButton.addEventListener('click', () => {
    const shareText = generateShareText();
    if (!shareText) { alert('コピーする絵文字が選択されていません。'); return; }
    navigator.clipboard.writeText(shareText.split('\n\n')[1])
        .then(() => alert('共有URLをクリップボードにコピーしました！'))
        .catch(err => console.error('コピーに失敗しました:', err));
});

filterToggleButton.addEventListener('click', () => { filterMenu.classList.toggle('show'); });
filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        const allCheckbox = Array.from(filterCheckboxes).find(cb => cb.value === 'all');
        if (e.target.value === 'all' && e.target.checked) {
            filterCheckboxes.forEach(cb => { if (cb.value !== 'all') cb.checked = false; });
        } else if (e.target.value !== 'all' && e.target.checked) {
            allCheckbox.checked = false;
        }
        const anyChecked = Array.from(filterCheckboxes).some(cb => cb.checked);
        if (!anyChecked) { allCheckbox.checked = true; }
        applyFilters();
    });
});

// --- ページ読み込み時の処理 ---
document.addEventListener('DOMContentLoaded', () => {
    renderFavoritesMenu();
    updateLabelsHeaderVisibility();
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    if (dataParam) {
        try {
            const state = JSON.parse(decodeURIComponent(dataParam));
            if (Array.isArray(state)) {
                state.forEach(item => {
                    if (item.emoji && typeof parseFloat(item.volume) === 'number') {
                        const rate = item.rate || INITIAL_RATE;
                        setupEmojiSound(item.emoji, parseFloat(item.volume), rate);
                    }
                });
            }
        } catch (e) { console.error('URLパラメータの解析に失敗しました:', e); }
    }
});