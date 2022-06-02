// ==UserScript==
// @name         Your Genshin Impact Characters
// @namespace    https://github.com/KTOOGER/Your-Genshin-Impact-Characters
// @description  A userscript that highlights your characters on Genshin Impact sites
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @version      1.1.0
// @license      MIT
// @author       KTOOGER
// @grant        GM_getValue
// @grant        GM_setValue
// @match        https://genshin.gg/*
// @match        https://genshin.honeyhunterworld.com/*
// ==/UserScript==

(function () {
  'use strict';

  const CHARACTERS = {
    "Albedo": {},
    "Aloy": {},
    "Amber": {},
    "Ayaka": {},
    "Ayato": {},
    "Barbara": {},
    "Beidou": {},
    "Bennett": {},
    "Chongyun": {},
    "Diluc": {},
    "Diona": {},
    "Eula": {},
    "Fischl": {},
    "Ganyu": {},
    "Gorou": {},
    "HuTao": {},
    "Itto": {},
    "Jean": {},
    "Kaeya": {},
    "Kazuha": {},
    "Keqing": {},
    "Klee": {},
    "Kokomi": {},
    "Lisa": {},
    "Mona": {},
    "Ningguang": {},
    "Noelle": {},
    "Qiqi": {},
    "Raiden": {
      "genshin.honeyhunterworld.com": "shougun"
    },
    "Razor": {},
    "Rosaria": {},
    "Sara": {},
    "Sayu": {},
    "Shenhe": {},
    "Sucrose": {},
    "Tartaglia": {},
    "Thoma": {},
    "Traveler(Anemo)": {
      "genshin.honeyhunterworld.com": ["traveler_girl_anemo", "traveler_boy_anemo"]
    },
    "Traveler(Geo)": {
      "genshin.honeyhunterworld.com": ["traveler_girl_geo", "traveler_boy_geo"]
    },
    "Traveler(Electro)": {
      "genshin.honeyhunterworld.com": ["traveler_girl_electro", "traveler_boy_electro"]
    },
    "Venti": {},
    "Xiangling": {},
    "Xiao": {},
    "Xingqiu": {},
    "Xinyan": {},
    "YaeMiko": {},
    "Yanfei": {
      "genshin.honeyhunterworld.com": "feiyan"
    },
    "Yelan": {},
    "Yoimiya": {},
    "YunJin": {},
    "Zhongli": {}
  }

  const HASHES = {
    "#settings": () => gms.open(),
    "#import": () => importCharacters()
  }

  const charNameRules = {
    "genshin.honeyhunterworld.com": (text) => text.toLowerCase()
  }

  const cssFor = {
    'genshin.gg': (chars) =>
      chars.map((char) =>
        `a.character-portrait[href^="/characters/${char}"] { opacity: 1 }\n`
      ).join('') + (
        `a.character-portrait{ opacity:0.3333 }
        iframe#Characters {z-index: 99999 !important}`
      ),
    'genshin.honeyhunterworld.com': (chars) =>
      (
        `a img[src^="/img/char"] { opacity: 0.333 }
        iframe#Characters {z-index: 99999 !important}`
      ) + chars.map((char) =>
        `a img[src^="/img/char/${char}"] { opacity: 1 }\n`
      ).join('')
  }

  const addHtmlInterfaceFor = {
    'genshin.gg'() {
      root.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", '<a class="nav-link" href="#settings">Settings</a>')
    },
    'genshin.honeyhunterworld.com'() {
      sidebar2.querySelector(".textwidget.custom-html-widget").insertAdjacentHTML("beforeend",
        `<a href="#settings">
          <div class="widget_menu_item">
            <div class="menu_icon_wrapper">
              <img class="widget_menu_icon" src="https://genshin.honeyhunterworld.com/img/icons/char_35.png">
            </div>
            <span class="menu_item_text">Settings</span>
          </div>
        </a>`)
    }
  }

  function getAllCharsFor(site) {
    let result = {}
    let rename = charNameRules[site] || (t => t)
    for (let char in CHARACTERS) {
      result[char] = CHARACTERS[char][site] || rename(char)
    }
    return result
  }

  function getUserCharsFor(site) {
    let result = []
    let characters = getAllCharsFor(site)
    for (let char in characters) {
      if (gms.get(char)) {
        if (typeof characters[char] === "object") {
          for (let name in characters[char]) {
            result.push(characters[char][name])
          }
        } else {
          result.push(characters[char])
        }
      }
    }
    return result
  }

  function initGM(CHARACTERS) {
    let settings = {}
    for (let el in CHARACTERS) {
      settings[el] = {
        'label': el,
        'type': 'checkbox',
        'default': false
      }
    }
    GM_config.init({
      'id': 'Characters',
      'fields': settings,
      'events': {
        'save': function () {
          document.location.href = document.location.pathname
        },
        'close': function () {
          document.location.href = document.location.pathname
        }
      }
    });
    return GM_config
  }

  function hashCheck() {
    for (let hash in HASHES) {
      if (document.location.hash === hash) {
        HASHES[hash]()
        break
      }
    }
  }

  function addHtml(site) {
    addHtmlInterfaceFor[site]()

    let style = document.createElement('style');
    style.innerHTML = cssFor[site](getUserCharsFor(site));
    document.head.append(style);
  }

  function initScript() {
    hashCheck()
    window.onhashchange = hashCheck
    addHtml(site)
  }

  if (document.location.ancestorOrigins.length) return

  const site = document.location.host
  var gms = initGM(CHARACTERS)
  initScript()
})();