const socket = io()
socket.emit('message', 'haaa')

window.onload = function() {
  const prevBtn = document.getElementById("prev")
  const url = document.getElementById("url")
  const goBtn = document.getElementById("go")
  const nextBtn = document.getElementById("next")
  const downloadBtn = document.getElementById("download")
  prevBtn.addEventListener("click", function(e) {
    loadContent("/assets/img/loading.gif", "img", true)
    askForContent(this.dataset.url)
  })
  nextBtn.addEventListener("click", function(e) {
    loadContent("/assets/img/loading.gif", "img", true)
    askForContent(this.dataset.url)
  })
  downloadBtn.addEventListener("click", function(e) {
    socket.emit('download', { url: this.dataset.url, id: this.dataset.id })
  })
  goBtn.addEventListener("click", function(e) {
    loadContent("/assets/img/loading.gif", "img", true)
    askForContent(`https://api.pexels.com/v1/${url.value}`)
  })
}

function loadContent(src, app = false) {
  document.getElementById("mainContent").innerHTML = `<img src="${src}">`

  if (app) {
    document.getElementById("mainContent").classList.add("small")
  } else {
    document.getElementById("mainContent").classList.remove("small")
  }
}

const loadData = json => {
  let data = document.createElement('pre')
  data.className = 'card'
  data.innerHTML = syntaxHighlight(JSON.stringify(json, undefined, 2))
  document.getElementById('descContent').innerHTML = data.outerHTML;
}

const setNextBtn = url => {
  document.getElementById("next").dataset.url = url
}

const setPrevBtn = url => {
  document.getElementById("prev").dataset.url = url
}

const setDownloadBtn = (url, id) => {
  document.getElementById("download").dataset.url = url
  document.getElementById("download").dataset.id = id
  toast('download started!')
}

function askForContent(url) {
  const Options = {
    headers: {
      "Authorization": "563492ad6f917000010000016c0c1442fae54a71a836670a994a56be"
    }
  }

  fetch(url, Options)
    .then(data => { return data.json() })
    .then(res => {
      // console.log(res.photos[0]['src'])
      loadData(res)
      setNextBtn(res.next_page)
      setPrevBtn(res.prev_page)
      setDownloadBtn(res.photos[0]['src']['original'], res.photos[0]['id'])
      loadContent(res.photos[0]['src']['medium'])
    })
    .catch(error => console.error(error))
}

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

socket.on('download status', data => {
  console.log(data)
  toast('download completed!')
})

const toast = (text = 'toast!') => {
  if (document.querySelector('.toast')) document.querySelector('.toast').remove()
  document.body.insertAdjacentHTML('beforeend', `<div class="toast">${text}</div>`)
  setTimeout(() => {
    document.querySelector('.toast').remove()
  }, 3000)
}