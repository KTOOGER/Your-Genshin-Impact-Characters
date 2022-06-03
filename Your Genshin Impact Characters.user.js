// ==UserScript==
// @name         Your Genshin Impact Characters
// @namespace    https://github.com/KTOOGER/Your-Genshin-Impact-Characters
// @description  A userscript that highlights your characters on Genshin Impact sites
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @version      1.2.1
// @license      MIT
// @author       KTOOGER
// @grant        GM_getValue
// @grant        GM_setValue
// @match        https://genshin-center.com/*
// @match        https://genshin.chiya.dev/*
// @match        https://genshin.gg/*
// @match        https://genshin.honeyhunterworld.com/*
// ==/UserScript==

(function () {
  'use strict';

  const CHARACTERS = {
    "Albedo": {},
    "Aloy": {},
    "Amber": {},
    "Ayaka": {
      "genshin-center.com": "kamisatoayaka"
    },
    "Ayato": {
      "genshin-center.com": "kamisatoayato"
    },
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
    "HuTao": {
      "genshin.chiya.dev": "Hu Tao"
    },
    "Itto": {
      "genshin-center.com": "aratakiitto"
    },
    "Jean": {},
    "Kaeya": {},
    "Kazuha": {
      "genshin-center.com": "kaedeharakazuha"
    },
    "Keqing": {},
    "Klee": {},
    "Kokomi": {
      "genshin-center.com": "sangonomiyakokomi"
    },
    "Lisa": {},
    "Mona": {},
    "Ningguang": {},
    "Noelle": {},
    "Qiqi": {},
    "Raiden": {
      "genshin.chiya.dev": "Raiden Shogun",
      "genshin.honeyhunterworld.com": "shougun"
    },
    "Razor": {},
    "Rosaria": {},
    "Sara": {
      "genshin-center.com": "kujousara"
    },
    "Sayu": {},
    "Shenhe": {},
    "Shinobu": {},
    "Sucrose": {},
    "Tartaglia": {
      "genshin.gg": "Childe"
    },
    "Thoma": {},
    "Traveler(Anemo)": {
      "genshin-center.com": "traveler",
      "genshin.honeyhunterworld.com": ["traveler_girl_anemo", "traveler_boy_anemo"]
    },
    "Traveler(Geo)": {
      "genshin-center.com": "traveler",
      "genshin.honeyhunterworld.com": ["traveler_girl_geo", "traveler_boy_geo"]
    },
    "Traveler(Electro)": {
      "genshin-center.com": "traveler",
      "genshin.honeyhunterworld.com": ["traveler_girl_electro", "traveler_boy_electro"]
    },
    "Venti": {},
    "Xiangling": {},
    "Xiao": {},
    "Xingqiu": {},
    "Xinyan": {},
    "YaeMiko": {
      "genshin.chiya.dev": "Yae Miko"
    },
    "Yanfei": {
      "genshin.honeyhunterworld.com": "feiyan"
    },
    "Yelan": {},
    "Yoimiya": {},
    "YunJin": {
      "genshin.chiya.dev": "Yun Jin"
    },
    "Zhongli": {}
  }

  const HASHES = {
    "#settings": () => gms.open(),
    "#import": () => importCharacters()
  }

  const charNameRules = {
    "genshin-center.com": (text) => text.toLowerCase(),
    "genshin.honeyhunterworld.com": (text) => text.toLowerCase()
  }

  const cssFor = {
    'genshin-center.com': (chars) => {
      return (
        `a .CharacterThumbnail_charBox__NsyIF .containedImage { opacity : 0.333 }`
        + chars.map((char) => `\na[href*="/characters/${char}"] .containedImage {opacity: 1}`).join('')
      )
    },
    'genshin.chiya.dev': (chars) => {
      return (
        `.chakra-link[href^="/customize/characters/"] :not(.chakra-badge) > * > img{opacity: 0.333}`
        + chars.map((char) => `\n.chakra-link[href^="/customize/characters/"] img[alt="${char}"] { opacity: 1 }`).join('')
      )
    },
    'genshin.gg': (chars) => {
      return (
        chars.map((char) => `a.character-portrait[href^="/characters/${char}"] { opacity: 1 }\n`).join('')
        + `a.character-portrait{ opacity:0.3333 } iframe#Characters {z-index: 99999 !important}`
      )
    },
    'genshin.honeyhunterworld.com': (chars) => {
      return (
        `a img[src^="/img/char"] { opacity: 0.333 } iframe#Characters {z-index: 99999 !important}`
        + chars.map((char) => `\na img[src^="/img/char/${char}"] { opacity: 1 }`).join('')
      )
    }
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
    (addHtmlInterfaceFor[site] || (() => console.log('Interface not added')))()

    let style = document.createElement('style')
    style.innerHTML = cssFor[site](getUserCharsFor(site))
    document.head.append(style)
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