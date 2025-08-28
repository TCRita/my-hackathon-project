const emojiSounds = {
    '🫧':'sounds/bubbles.mp3',
    '🌸':'sounds/cherry_blossom.mp3',
    '🏜️':'sounds/desert.mp3',
    '💧':'sounds/droplet.mp3',
    '🍂':'sounds/fallen_leaf.mp3',
    '🔥':'sounds/fire.mp3',
    '🎆':'sounds/fireworks.mp3',
    '🌧️':'sounds/rain.mp3',
    '🌈':'sounds/rainbow.mp3',
    '❄️':'sounds/snowflake.mp3',
    '🎇':'sounds/sparkler.mp3',
    '☀️':'sounds/sunny.mp3',
    '🌅':'sounds/sunrise.mp3',
    '🌇':'sounds/sunset.mp3',
    '⛈️':'sounds/thunder_cloud_rain.mp3',
    '🌪️':'sounds/tornado.mp3',
    '🌳':'sounds/tree.mp3',
    '🌋':'sounds/volcano.mp3',
    '🌊':'sounds/water_wave.mp3',
    '🪸':'sounds/coral.mp3',
    '💥':'sounds/boom.mp3',
    '🦁':'sounds/lion_face.mp3',
    '🐘':'sounds/elephant.mp3',
    '🐎':'sounds/racehorse.mp3',
    '🐕':'sounds/dog2.mp3',
    '🐈':'sounds/cat2.mp3',
    '🐗':'sounds/boar.mp3',
    '🐐':'sounds/goat.mp3',
    '🐏':'sounds/ram.mp3',
    '🐖':'sounds/pig2.mp3',
    '🐮':'sounds/cow.mp3',
    '🐺':'sounds/wolf.mp3',
    '🪙':'sounds/coin.mp3',
    '🐸':'sounds/frog.mp3',
    '🚑':'sounds/ambulance.mp3',
    '🎐':'sounds/wind_chime.mp3',
    '🏝️':'sounds/island.mp3',
    '🧊':'sounds/ice_cube.mp3',
    '🥤':'sounds/cup_with_straw.mp3',
    '🥩':'sounds/cut_of_meat.mp3',
    '🍽️':'sounds/fork_knife_plate.mp3',
    '🔫':'sounds/gun.mp3',
    '✨':'sounds/sparkles.mp3',
    '🔔':'sounds/bell.mp3',
    '🏹':'sounds/bow_and_arrow.mp3',
    '🐚':'sounds/shell.mp3',
    '🥁':'sounds/drum.mp3',
    '🫙':'sounds/jar.mp3',
    '🪨':'sounds/rock.mp3',
    '🕰️':'sounds/clock.mp3',
    '⌨️':'sounds/keyboard.mp3',
    '🚀':'sounds/rocket.mp3',
    '☂️':'sounds/umbrella2.mp3'
};

const INITIAL_VOLUME = 0.8;
const SLIDER_COLOR_ACTIVE = '#007bff';
const SLIDER_COLOR_INACTIVE = '#e9eef2';

const displayArea = document.querySelector(".selected-emojis-display");
const filterToggleButton = document.getElementById("filter-toggle-button");
const filterMenu = document.getElementById("filter-menu");
const filterCheckboxes = document.querySelectorAll('#filter-menu input[name="category"]');
const emojiListItems = document.querySelectorAll('.emoji-list li');
const shareButton = document.getElementById('share-button');
const copyButton = document.getElementById('copy-button');
const playToggleButton = document.getElementById('play-toggle-button');

const activeSounds = new Map();
let isPlaying = false;

function updateSliderBackground(slider){
    const percentage = slider.value*100;
    slider.style.background = `linear-gradient(to right, ${SLIDER_COLOR_ACTIVE} 0%, ${SLIDER_COLOR_ACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} ${percentage}%, ${SLIDER_COLOR_INACTIVE} 100%)`;
}

function applyFilters(){
    const selectedCategories = Array.from(filterCheckboxes)
        .filter(cb=>cb.checked && cb.value!=='all')
        .map(cb=>cb.value);
    const isAllSelected = document.querySelector('#filter-menu input[value="all"]').checked;
    emojiListItems.forEach(item=>{
        item.style.display=(isAllSelected || selectedCategories.includes(item.dataset.category))?'list-item':'none';
    });
}

function generateUrlWithState(){
    if(activeSounds.size===0) return window.location.origin + window.location.pathname;
    const state=[];
    activeSounds.forEach((s,emoji)=>{ state.push({emoji, volume:s.volume(), rate:s.rate()}); });
    return `${window.location.origin}${window.location.pathname}?data=${encodeURIComponent(JSON.stringify(state))}`;
}

function activateEmoji(emoji, volume, rate=1.0){
    const button = Array.from(document.querySelectorAll('.emoji-button')).find(b=>b.textContent===emoji);
    if(!button||!emojiSounds[emoji]) return;

    button.classList.add('selected');

    let sound;
    if(!activeSounds.has(emoji)){
        sound = new Howl({src:[emojiSounds[emoji]], loop:true, volume:volume, rate:rate, html5:true});
        activeSounds.set(emoji,sound);
    } else {
        sound = activeSounds.get(emoji);
        sound.volume(volume);
        sound.rate(rate);
    }

    if(!displayArea.querySelector(`.selected-emoji-item[data-emoji="${emoji}"]`)){
        const newItem=document.createElement('div');
        newItem.className='selected-emoji-item';
        newItem.dataset.emoji=emoji;

        const emojiIcon=document.createElement('span');
        emojiIcon.className='emoji-icon';
        emojiIcon.textContent=emoji;

        const volumeSlider=document.createElement('input');
        volumeSlider.type='range'; volumeSlider.min=0; volumeSlider.max=1; volumeSlider.step=0.01; volumeSlider.value=volume;
        volumeSlider.className='volume-slider';
        volumeSlider.addEventListener('input', ()=>{
            const s = activeSounds.get(emoji);
            if(s) s.volume(volumeSlider.value);
            updateSliderBackground(volumeSlider);
        });

        const rateSlider=document.createElement('input');
        rateSlider.type='range'; rateSlider.min=0.5; rateSlider.max=2; rateSlider.step=0.01; rateSlider.value=rate;
        rateSlider.className='rate-slider';
        rateSlider.addEventListener('input', ()=>{
            const s=activeSounds.get(emoji);
            if(s) s.rate(rateSlider.value);
            updateSliderBackground(rateSlider);
        });

        newItem.append(emojiIcon, volumeSlider, rateSlider);
        displayArea.appendChild(newItem);
        updateSliderBackground(volumeSlider); updateSliderBackground(rateSlider);
    }
}

// イベント
shareButton.addEventListener('click', async()=>{
    if(activeSounds.size===0){ alert('共有する絵文字が選択されていません'); return; }
    try{ await navigator.share({ title:'Emoji Soundscape', text:'🎵 私の作ったサウンドスケープを聴いてみて！', url:generateUrlWithState()}); }
    catch(e){ console.error(e); }
});

copyButton.addEventListener('click', ()=>{
    if(activeSounds.size===0){ alert('コピーする絵文字が選択されていません'); return; }
    navigator.clipboard.writeText(generateUrlWithState()).then(()=>alert('URLコピーしました'));
});

filterToggleButton.addEventListener('click', ()=>filterMenu.classList.toggle('show'));
filterCheckboxes.forEach(cb=>cb.addEventListener('change', applyFilters));

emojiListItems.forEach(item=>{
    const button=item.querySelector('.emoji-button');
    button.addEventListener('click', ()=>{
        const emoji = button.textContent;
        const selected = button.classList.contains('selected');
        if(selected){
            button.classList.remove('selected');
            const s=activeSounds.get(emoji);
            if(s){ s.stop(); activeSounds.delete(emoji); }
            const itemToRemove = displayArea.querySelector(`.selected-emoji-item[data-emoji="${emoji}"]`);
            if(itemToRemove) displayArea.removeChild(itemToRemove);
        } else {
            activateEmoji(emoji, INITIAL_VOLUME, 1.0);
            if(isPlaying) activeSounds.get(emoji).play();
        }
    });
});

// 再生／停止トグル
playToggleButton.addEventListener('click', ()=>{
    if(isPlaying){
        // 停止：全ての音を完全に止める
        activeSounds.forEach(s=>s.stop());
        playToggleButton.textContent='再生';
        isPlaying=false;
    } else {
        // 再生：全ての音を再生
        activeSounds.forEach(s=>{
            // Howl は stop 後に再度 play で最初から再生可能
            s.play();
        });
        playToggleButton.textContent='停止';
        isPlaying=true;
    }
});

// URLパラメータ復元（再生はしない）
document.addEventListener('DOMContentLoaded', ()=>{
    const params=new URLSearchParams(window.location.search);
    const data=params.get('data');
    if(data){
        try{
            const state = JSON.parse(decodeURIComponent(data));
            state.forEach(item=>{
                if(item.emoji && typeof item.volume==='number'){
                    activateEmoji(item.emoji, item.volume, item.rate||1.0);
                }
            });
        }catch(e){ console.error(e); }
    }
});
