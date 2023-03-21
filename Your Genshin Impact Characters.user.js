// ==UserScript==
// @name         Your Genshin Impact Characters
// @namespace    https://github.com/KTOOGER/Your-Genshin-Impact-Characters
// @description  A userscript that highlights your characters on Genshin Impact sites
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @version      1.2.4
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
    "Alhaitham": {},
    "Aloy": {},
    "Amber": {},
    "Ayaka": {
      "genshin-center.com": "kamisatoayaka",
      "genshin.honeyhunterworld.com": "Kamisato Ayaka"
    },
    "Ayato": {
      "genshin-center.com": "kamisatoayato",
      "genshin.honeyhunterworld.com": "Kamisato Ayato"
    },
    "Barbara": {},
    "Beidou": {},
    "Baizhu": {},
    "Bennett": {},
    "Candace": {},
    "Chongyun": {},
    "Collei": {},
    "Cyno": {},
    "Dehya": {},
    "Diluc": {},
    "Diona": {},
    "Dori": {},
    "Eula": {},
    "Faruzan": {},
    "Fischl": {},
    "Ganyu": {},
    "Gorou": {},
    "Heizou": {
      "genshin-center.com": "shikanoinheizou",
      "genshin.honeyhunterworld.com": "Shikanoin Heizou"
    },
    "HuTao": {
      "genshin.chiya.dev": "Hu Tao",
      "genshin.honeyhunterworld.com": "Hu Tao"
    },
    "Itto": {
      "genshin-center.com": "aratakiitto",
      "genshin.honeyhunterworld.com": "Arataki Itto"
    },
    "Jean": {},
    "Kaeya": {},
    "Kaveh": {},
    "Kazuha": {
      "genshin-center.com": "kaedeharakazuha",
      "genshin.honeyhunterworld.com": "Kaedehara Kazuha"
    },
    "Keqing": {},
    "Klee": {},
    "Kokomi": {
      "genshin-center.com": "sangonomiyakokomi",
      "genshin.honeyhunterworld.com": "Sangonomiya Kokomi"
    },
    "Layla": {},
    "Lisa": {},
    "Mika": {},
    "Mona": {},
    "Nahida": {},
    "Nilou": {},
    "Ningguang": {},
    "Noelle": {},
    "Qiqi": {},
    "Raiden": {
      "genshin.chiya.dev": "Raiden Shogun",
      "genshin.honeyhunterworld.com": "Raiden Shogun"
    },
    "Razor": {},
    "Rosaria": {},
    "Sara": {
      "genshin-center.com": "kujousara",
      "genshin.honeyhunterworld.com": "Kujou Sara"
    },
    "Sayu": {},
    "Shenhe": {},
    "Shinobu": {
      "genshin.gg": "kukishinobu",
      "genshin-center.com": "kukishinobu",
      "genshin.honeyhunterworld.com": "Kuki Shinobu"
    },
    "Sucrose": {},
    "Tartaglia": {
      "genshin.gg": "childe"
    },
    "Thoma": {},
    "Tighnari": {},
    "Traveler(Anemo)": {
      "genshin-center.com": "traveler",
      "genshin.honeyhunterworld.com": "Traveler"
    },
    "Traveler(Dendro)": {
      "genshin-center.com": "traveler",
      "genshin.honeyhunterworld.com": "Traveler"
    },
    "Traveler(Geo)": {
      "genshin-center.com": "traveler",
      "genshin.honeyhunterworld.com": "Traveler"
    },
    "Traveler(Electro)": {
      "genshin-center.com": "traveler",
      "genshin.honeyhunterworld.com": "Traveler"
    },
    "Venti": {},
    "Wanderer": {},
    "Xiangling": {},
    "Xiao": {},
    "Xingqiu": {},
    "Xinyan": {},
    "YaeMiko": {
      "genshin.chiya.dev": "Yae Miko",
      "genshin.honeyhunterworld.com": "Yae Miko"
    },
    "Yanfei": {},
    "Yaoyao": {},
    "Yelan": {},
    "Yoimiya": {},
    "YunJin": {
      "genshin.chiya.dev": "Yun Jin",
      "genshin.honeyhunterworld.com": "Yun Jin"
    },
    "Zhongli": {}
  }

  const HASHES = {
    "#settings": () => gms.open(),
    "#import": () => importCharacters()
  }

  const charNameRules = {
    "genshin.gg": (text) => text.toLowerCase(),
    "genshin-center.com": (text) => text.toLowerCase()
  }

  const cssFor = {
    'genshin-center.com': (chars) => {
      return (
        `a .CharacterThumbnail_charBox__NsyIF .containedImage { opacity : 0.333 }`
        + chars.highlight.map((char) => `\na[href*="/characters/${char}"] .containedImage {opacity: 1}`).join('')
      )
    },
    'genshin.chiya.dev': (chars) => {
      return (
        `.chakra-link[href^="/customize/characters/"] :not(.chakra-badge) > * > img{opacity: 0.333}`
        + chars.highlight.map((char) => `\n.chakra-link[href^="/customize/characters/"] img[alt="${char}"] { opacity: 1 }`).join('')
      )
    },
    'genshin.gg': (chars) => {
      return (
        chars.highlight.map((char) => `a.character-portrait[href^="/characters/${char}"]>img, a.tierlist-portrait[href^="/characters/${char}"] > .tierlist-icon-wrapper { opacity: 1 }\n`).join('')
        + `a.character-portrait>img, a.tierlist-portrait > .tierlist-icon-wrapper { opacity:0.3333 } iframe#Characters {z-index: 99999 !important}`
      )
    },
    'genshin.honeyhunterworld.com': (chars) => {
      return (
        `iframe#Characters {z-index: 99999 !important}`
        + chars.highlight.map((char) => `\na .itempic_cont img[alt="${char}"] { opacity: 1 }`).join('')
        + chars.other.map((char) => `\na .itempic_cont img[alt="${char}"] { opacity: 0.333 }`).join('')
      )
    }
  }

  const addHtmlInterfaceFor = {
    'genshin.gg'() {
      root.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", '<a class="nav-link" href="#settings">Settings</a>')
    },
    'genshin.honeyhunterworld.com'() {
      document.querySelector("body > div > div.wp-block-columns > div:nth-child(1) > .ad_sidebar_left").insertAdjacentHTML("beforebegin",
        `<a href="#settings">
          <label class="menu_item_text">
            <div class="menu_item_img_wrap">
              <img alt="Settings" loading="lazy" class="widget_menu_icon" src="/img/icons/char_35.webp?x37636">
            </div>
            Settings
          </label>
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
    let result = {
      highlight: [],
      other: []
    }
    let characters = getAllCharsFor(site)
    for (let char in characters) {
      let names = []
      if (typeof characters[char] === "object") {
        for (let name in characters[char]) {
          names.push(characters[char][name])
        }
      } else {
        names.push(characters[char])
      }
      if (gms.get(char)) {
        result.highlight = result.highlight.concat(names)
      } else {
        result.other = result.other.concat(names)
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
