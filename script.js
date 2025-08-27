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

// --- グローバル変数 ---
const activeSounds = new Map();

// --- 関数定義 ---
function updateSliderBackground(slider) {
    const percentage = slider.value * 100;
    slider.style.background = `linear-gradient(to right, ${SLIDER_COLOR_ACTIVE} 0%, ${SLIDER_COLOR_ACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} 100%)`;
}

// フィルターを適用する関数
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

// --- イベントリスナーの設定 ---

// フィルターボタンのクリックイベント
filterToggleButton.addEventListener('click', () => {
    filterMenu.classList.toggle('show');
});

// フィルターメニューのチェックボックス変更イベント
filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        const allCheckbox = Array.from(filterCheckboxes).find(cb => cb.value === 'all');
        
        if (e.target.value === 'all' && e.target.checked) {
            filterCheckboxes.forEach(cb => {
                if (cb.value !== 'all') cb.checked = false;
            });
        } else if (e.target.value !== 'all' && e.target.checked) {
            allCheckbox.checked = false;
        }

        const anyChecked = Array.from(filterCheckboxes).some(cb => cb.checked);
        if (!anyChecked) {
            allCheckbox.checked = true;
        }
        
        applyFilters();
    });
});

// 絵文字ボタンのクリックイベント
emojiListItems.forEach(item => {
    const button = item.querySelector('.emoji-button');
    button.addEventListener("click", () => {
        const emoji = button.textContent;
        if (!emojiSounds[emoji]) { return; }
        button.classList.toggle("selected");

        if (button.classList.contains("selected")) {
            const sound = new Howl({ src: [emojiSounds[emoji]], loop: true, volume: INITIAL_VOLUME, html5: true });
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
                if (currentSound) { currentSound.volume(volumeSlider.value); }
                updateSliderBackground(volumeSlider);
            });
            newItem.appendChild(emojiIcon);
            newItem.appendChild(volumeSlider);
            displayArea.appendChild(newItem);
            updateSliderBackground(volumeSlider);
        } else {
            const sound = activeSounds.get(emoji);
            if (sound) { sound.stop(); activeSounds.delete(emoji); }
            const itemToRemove = displayArea.querySelector(`.selected-emoji-item[data-emoji="${emoji}"]`);
            if (itemToRemove) { displayArea.removeChild(itemToRemove); }
        }
    });
});