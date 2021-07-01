// ==UserScript==
// @name         Your Genshin Impact Characters
// @namespace    https://github.com/KTOOGER/Your-Genshin-Impact-Characters
// @description  A userscript that highlights your characters on Genshin Impact sites
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @version      0.3.7
// @license      MIT
// @author       KTOOGER
// @match        https://genshin.gg/*
// @match        https://genshin.honeyhunterworld.com/*
// ==/UserScript==

(function () {
  'use strict';

  const site = document.location.host

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

  const CHARACTERS = {
    "Albedo": {},
    "Amber": {},
    "Barbara": {},
    "Beidou": {},
    "Bennett": {},
    "Chongyun": {},
    "Diluc": {},
    "Diona": {},
    "Eula": {},
    "Fischl": {},
    "Ganyu": {},
    "HuTao": {},
    "Jean": {},
    "Kaeya": {},
    "Kazuha": {},
    "Keqing": {},
    "Klee": {},
    "Lisa": {},
    "Mona": {},
    "Ningguang": {},
    "Noelle": {},
    "Qiqi": {},
    "Razor": {},
    "Rosaria": {},
    "Sucrose": {},
    "Tartaglia": {},
    "Traveler(Anemo)": {
      "genshin.honeyhunterworld.com": ["traveler_girl_anemo", "traveler_boy_anemo"]
    },
    "Traveler(Geo)": {
      "genshin.honeyhunterworld.com": ["traveler_girl_geo", "traveler_boy_geo"]
    },
    "Yanfei": {
      "genshin.honeyhunterworld.com": "feiyan"
    },
    "Venti": {},
    "Zhongli": {},
    "Xiangling": {},
    "Xiao": {},
    "Xingqiu": {},
    "Xinyan": {}
  }

  const charNameRules = {
    "genshin.honeyhunterworld.com": (text) => text.toLowerCase()
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

  let gms = initGM(CHARACTERS)

  if (document.location.hash === "#settings") {
    gms.open()
  }

  window.onhashchange = () => {
    if (document.location.hash === "#settings")
      gms.open()
  }

  let text = 'iframe#Characters {z-index: 99999 !important}\n'
  let characters = getUserCharsFor(site)
  switch (site) {
    case 'genshin.gg':
      root.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", '<a class="nav-link" href="#settings">Settings</a>')
      text += "a.character-portrait{ opacity:0.3333 }"
      for (let el in characters) {
        text += `\na.character-portrait[href^="/characters/${characters[el]}"] { opacity: 1 }`
      }
      break;
    case 'genshin.honeyhunterworld.com':
      sidebar2.querySelector(".textwidget.custom-html-widget").insertAdjacentHTML("beforeend", '<a href="#settings"><div class="widget_menu_item"><div class="menu_icon_wrapper"><img class="widget_menu_icon" src="https://genshin.honeyhunterworld.com/img/icons/char_35.png"></div><span class="menu_item_text">Settings</span></div></a>')
      text += 'a > img.char_portrait_card_sea, .sea_item_used_by_char > a > img { opacity: 0.3333 }'
      for (let el in characters) {
        text += `\na[href^="/db/char/${characters[el]}"] > img { opacity: 1 }`
      }
      break;
  }

  let style = document.createElement('style');
  style.innerHTML = text;
  document.head.append(style);

})();