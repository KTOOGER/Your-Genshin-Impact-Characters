// ==UserScript==
// @name         Your Genshin Impact Characters
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @version      0.1.0
// @author       KTOOGER
// @match        https://genshin.gg/*
// ==/UserScript==

function initGM(characters) {
  let settings = {}
  for (let el in characters) {
      settings[characters[el]] = {
              'label': characters[el],
              'type': 'checkbox',
              'default': false
          }
  }
  GM_config.init({
      'id': 'Characters',
      'fields': settings,
      'events': {
          'close': function() {window.history.back()}
      }
  });
  return GM_config
}

(function() {
  'use strict';

  root.querySelector(".dropdown-menu").insertAdjacentHTML("beforeend", '<a class="nav-link" href="/settings">Settings</a>')

  let characters = ["Amber","Barbara","Beidou","Bennett","Chongyun","Diluc","Diona","Fischl","Jean","Kaeya","Keqing","Klee","Lisa","Mona","Ningguang","Noelle","Qiqi","Razor","Sucrose","Tartaglia","Traveler(Anemo)","Traveler(Geo)","Venti","Zhongli","Xiangling","Xiao","Xingqiu","Xinyan"]

  let gms = initGM(characters)

  console.log(window.location.pathname)
  if (window.location.pathname === "/settings") {
      gms.open()
  }

  let style = document.createElement('style');
  let text = "a.character-portrait{opacity:0.3333;}"
  for (let el in characters) {
    if (gms.get(characters[el])) {
      text += `\na.character-portrait[href="/characters/${characters[el]}"]{opacity:1}`
    }
  }
  style.innerHTML = text;
  document.head.append(style);
})();