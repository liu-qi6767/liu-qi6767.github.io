// ✅ 全局变量 - 强制读取musicDb，加兜底判断，确保有数据
let allMusic = window.musicDb || [];
let currentMusic = null;
const player = document.getElementById('globalPlayer');
const playerInfo = document.getElementById('playerInfo');
const musicLibrary = document.getElementById('musicLibrary');
const lyricBtn = document.getElementById('lyricBtn');
const lyricLayer = document.getElementById('lyricLayer');
const lyricImg = document.getElementById('lyricImg');

// ✅ 页面加载完成后，强制执行渲染，优先级最高
window.onload = function(){
    console.log("读取到的歌曲数据：", allMusic); // 控制台打印数据，方便查看
    // 如果无数据，弹出提示，告诉你问题在哪
    if(allMusic.length === 0){
        alert("⚠️ 未读取到歌曲数据！请检查：1.js/musicdb.json是否有歌曲数据 2.格式是否正确");
        musicLibrary.innerHTML = '<div style="text-align:center;padding:50px 0;color:#ccc;font-size:16px;">暂无歌曲，请先在后台添加歌曲</div>';
        return;
    }
    // 强制渲染歌曲列表，必出歌！
    renderMusicList(allMusic);
    // 歌词层拖拽功能
    dragElement(lyricLayer);
}

// 渲染歌曲列表 - 强制渲染，无任何隐藏逻辑
function renderMusicList(list){
    musicLibrary.innerHTML = '';
    if(list.length === 0){
        musicLibrary.innerHTML = '<div style="text-align:center;padding:50px 0;color:#ccc;">暂无歌曲</div>';
        return;
    }
    // 循环生成歌曲卡片，有多少首就显示多少首
    list.forEach(item => {
        let coverHtml = `<div class="music-cover">🎵</div>`;
        if(item.cover && item.cover !== 'default.jpg' && item.cover !== ''){
            coverHtml = `<div class="music-cover"><img src="${item.cover}" alt="${item.name}"></div>`;
        }
        musicLibrary.innerHTML += `
            <div class="music-card" onclick="playMusic('${item.src}', '${item.name}', '${item.singer}', '${item.lyric || ''}')">
                ${coverHtml}
                <div class="music-name">${item.name}</div>
                <div class="music-singer">${item.singer}</div>
            </div>
        `;
    });
}

// 歌曲分类筛选
function filterMusic(type){
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    let filteredList = type === 'all' ? allMusic : allMusic.filter(item => item.type === type);
    renderMusicList(filteredList);
}

// 播放歌曲+歌词加载
function playMusic(src, name, singer, lyric){
    currentMusic = {src, name, singer, lyric};
    player.src = src;
    player.play();
    playerInfo.innerHTML = `${name} - ${singer}`;
    
    if(lyric && lyric !== ''){
        lyricBtn.style.display = 'block';
        lyricBtn.innerHTML = '📖 显示歌词';
        lyricImg.src = lyric;
    } else {
        lyricBtn.style.display = 'none';
        lyricLayer.style.display = 'none';
    }
}

// 歌词显示/隐藏切换
function toggleLyric(){
    if(!currentMusic || !currentMusic.lyric) return;
    if(lyricLayer.style.display === 'block'){
        lyricLayer.style.display = 'none';
        lyricBtn.innerHTML = '📖 显示歌词';
    } else {
        lyricLayer.style.display = 'block';
        lyricBtn.innerHTML = '🙈 隐藏歌词';
    }
}

// 歌词层拖拽功能
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}