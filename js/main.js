// 歌词类
class LyricUl {
  constructor(mainaudio, container, lyricTime, lyricJson) {
    this.ul = document.createElement('ul')
    this.ul.className = 'lyriclist'
    container.appendChild(this.ul)
    addLi(this.ul, lyricJson)

    this.lyricTime = lyricTime
    this.lyricTime[this.lyricTime.length] =
      this.lyricTime[this.lyricTime.length - 1] + 100

    this.$li1 = $(this.ul).find('li')
    this.oldLine = -1
    this.currentLine = -1
    this.currentTime

    // this.pHeight = (20 + 16) * 2
    // this.tyMax = 1 * this.pHeight
    // this.ty

    this.mainaudio = mainaudio
    this.mainaudio.volume = 0.5
  }

  ontimeupdate() {
    this.currentTime = this.mainaudio.currentTime
    this.currentLine = getCurrentLine(this.lyricTime, this.currentTime)

    if (this.oldLine != this.currentLine) {
      // this.ty = -this.currentLine * this.pHeight
      // if (-this.ty > this.tyMax) this.ul.style.transform = 'translateY(' + (this.ty + this.tyMax).toString() + 'px)'
      // else this.ul.style.transform = 'translateY(0px)'
      if (this.oldLine != -1) this.$li1.get(this.oldLine).className = ''
      if (this.currentLine != -1)
        this.$li1.get(this.currentLine).className = 'on'
      this.oldLine = this.currentLine
    }
  }
}

// 在 ul 中添加包含有歌词的 li
function addLi(ul, lyricJson) {
  for (i in lyricJson) {
    let s = ''
    for (j in lyricJson[i]) {
      s += '<p>' + lyricJson[i][j] + '</p>'
    }
    ul.innerHTML += '<li>' + s + '</li>'
  }
}

// 二分法查找当前歌词位置
function getCurrentLine(lyricTime, currentTime) {
  if (currentTime < lyricTime[0]) return -1
  let left = 0
  let right = lyricTime.length - 1
  let mid
  while (left <= right) {
    mid = left + parseInt((right - left) / 2)
    if (currentTime < lyricTime[mid]) right = mid
    else left = mid
    if (right - left == 1) return left
  }
  return -1
}

// 检查时间线
function getLyricTime(lyricJson) {
  let oldT = 0
  let lyricTime = []
  let i = 0
  for (key in lyricJson) {
    lyricTime[i] =
      parseFloat(key.substr(1, 3)) * 60 + parseFloat(key.substring(4, 10))
    if (lyricTime[i] > oldT) {
      oldT = lyricTime[i]
    } else {
      alert('Error: 时间不是顺序递增')
      return false
    }
    i += 1
  }

  return lyricTime
}

// 开始
var mainaudio = $('#mainaudio')[0]
var container = $('#container')[0]

var lyricTime = getLyricTime(lyricJson)
if (lyricTime !== false) {
  var lyricUl = new LyricUl(mainaudio, container, lyricTime, lyricJson)
}

mainaudio.ontimeupdate = () => {
  lyricUl.ontimeupdate()
}
