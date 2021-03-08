// ==UserScript==
// @name         Your Genshin Impact Characters
// @namespace    https://github.com/KTOOGER/Your-Genshin-Impact-Characters
// @description  A userscript that highlights your characters on Genshin Impact sites
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @version      0.3.3
// @license      MIT
// @author       KTOOGER
// @match        https://genshin.gg/*
// @match        https://genshin.honeyhunterworld.com/*
// ==/UserScript==

function initGM(characters) {
  let settings = {}
  for (let el in characters) {
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

(function () {
  'use strict';

  const site = document.location.host
  const characters = {
    "Albedo": {},
    "Amber": {},
    "Barbara": {},
    "Beidou": {},
    "Bennett": {},
    "Chongyun": {},
    "Diluc": {},
    "Diona": {},
    "Fischl": {},
    "Ganyu": {},
    "HuTao": {},
    "Jean": {},
    "Kaeya": {},
    "Keqing": {},
    "Klee": {},
    "Lisa": {},
    "Mona": {},
    "Ningguang": {},
    "Noelle": {},
    "Qiqi": {},
    "Razor": {},
    "Sucrose": {},
    "Tartaglia": {},
    "Traveler(Anemo)": {
      "genshin.honeyhunterworld.com": "traveler_anemo"
    },
    "Traveler(Geo)": {
      "genshin.honeyhunterworld.com": "traveler_geo"
    },
    "Venti": {},
    "Zhongli": {},
    "Xiangling": {},
    "Xiao": {},
    "Xingqiu": {},
    "Xinyan": {}
  }

  let gms = initGM(characters)

  if (document.location.hash === "#settings") {
    gms.open()
  }

  window.onhashchange = () => {
    if (document.location.hash === "#settings")
      gms.open()
  }

  let style = document.createElement('style');
  let text = 'iframe#Characters {z-index: 99999 !important}\n'
  switch (site) {
    case 'genshin.gg':
      root.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", '<a class="nav-link" href="#settings">Settings</a>')
      text += "a.character-portrait{ opacity:0.3333 }"
      for (let el in characters) {
        if (gms.get(el)) {
          text += `\na.character-portrait[href="/characters/${characters[el][site] || el}"] { opacity: 1 }`
        }
      }
      break;
    case 'genshin.honeyhunterworld.com':
      sidebar2.querySelector(".textwidget.custom-html-widget").insertAdjacentHTML("beforeend", '<a href="#settings"><div class="widget_menu_item"><div class="menu_icon_wrapper"><img class="widget_menu_icon" src="https://genshin.honeyhunterworld.com/img/icons/char_35.png"></div><span class="menu_item_text">Settings</span></div></a>')
      text += 'a > img.char_portrait_card_sea, .sea_item_used_by_char > a > img { opacity: 0.3333 }'
      for (let el in characters) {
        if (gms.get(el)) {
          text += `\na[href="/db/char/${characters[el][site] || el.toLowerCase()}/"] > img { opacity: 1 }`
        }
      }
  }

  style.innerHTML = text;
  document.head.append(style);
})();