/* AI consultant Eriks: hero CTA, widget texts per site language, one-time hint bubble */
(function(){
var L={
lv:{t:"Runājiet ar mūsu AI konsultantu Ēriku",p:"Viņš atbildēs uz jautājumiem un uzzinās, kas jums vajadzīgs. Tieši tagad, bez gaidīšanas — balsī vai čatā.",b:"Runāt ar konsultantu",c:"vai rakstīt čatā",
    h:"Sveiki! Esmu Ēriks, AI konsultants. Jautājiet man jebko 👋",x:"Aizvērt",
    w:{main_label:"Runājiet ar AI konsultantu",start_call:"Runāt",start_chat:"Rakstīt"}},
ru:{t:"Поговорите с нашим AI-консультантом Эриком",p:"Он ответит на вопросы и узнает, что вам нужно. Прямо сейчас, без ожидания — голосом или в чате.",b:"Поговорить с консультантом",c:"или написать в чат",
    h:"Здравствуйте! Я Эрик, AI-консультант. Спросите меня о чём угодно 👋",x:"Закрыть",
    w:{main_label:"Поговорите с AI-консультантом",start_call:"Поговорить",start_chat:"Написать"}},
en:{t:"Talk to our AI consultant Eriks",p:"He will answer your questions and find out what you need. Right now, no waiting — by voice or chat.",b:"Talk to the consultant",c:"or send a message",
    h:"Hi! I'm Eriks, the AI consultant. Ask me anything 👋",x:"Close",
    w:{main_label:"Talk to our AI consultant",start_call:"Talk",start_chat:"Message"}}
};
var CALL=[],CHAT=[];for(var k in L){CALL.push(L[k].w.start_call);CHAT.push(L[k].w.start_chat);}
CALL.push("Sākt zvanu","Start a call","Начать звонок");CHAT.push("Ziņojums","Message","Сообщение");
function lang(){var l=document.documentElement.lang;return L[l]?l:"lv";}
function W(){return document.querySelector("elevenlabs-convai");}
function apply(){
  var t=L[lang()];
  document.querySelectorAll("[data-e]").forEach(function(e){e.textContent=t[e.getAttribute("data-e")];});
  var w=W(); if(w) w.setAttribute("text-contents",JSON.stringify(t.w));
  var hb=document.getElementById("eriksHint"); if(hb){hb.querySelector("span").textContent=t.h;hb.querySelector("button").setAttribute("aria-label",t.x);}
}
function btns(){var w=W(),r=w&&w.shadowRoot;return r?[].slice.call(r.querySelectorAll("button")):[];}
function pick(list,names,idx){
  for(var i=0;i<list.length;i++){var a=(list[i].getAttribute("aria-label")||list[i].textContent||"").trim();if(names.indexOf(a)>=0)return list[i];}
  return null;
}
function highlight(){
  var a=document.getElementById("eriksArrow"); if(!a) return;
  a.hidden=false; a.classList.remove("go"); void a.offsetWidth; a.classList.add("go");
  setTimeout(function(){a.hidden=true;},4200);
}
function open(mode,tries){
  tries=tries||0; hideHint(true);
  var b=btns(), el=mode==="chat"?pick(b,CHAT):pick(b,CALL);
  if(!el&&b.length) el=mode==="chat"?(b[1]||b[0]):b[0];
  if(el){el.click();return;}
  if(tries<10){setTimeout(function(){open(mode,tries+1)},300);return;}
  highlight();
}
document.addEventListener("click",function(e){
  var t=e.target.closest&&e.target.closest("[data-eriks]"); if(!t) return;
  e.preventDefault(); open(t.getAttribute("data-eriks"));
});
/* hint bubble: once per session, after 6 s, auto-hides */
function hideHint(forever){var h=document.getElementById("eriksHint");if(h)h.classList.remove("on");if(forever){try{sessionStorage.setItem("eriksHint","1")}catch(e){}}}
function showHint(){
  try{if(sessionStorage.getItem("eriksHint"))return;sessionStorage.setItem("eriksHint","1")}catch(e){}
  var h=document.getElementById("eriksHint"); if(!h||!btns().length) return;
  h.classList.add("on"); setTimeout(function(){hideHint()},14000);
}
document.addEventListener("DOMContentLoaded",function(){});
var hb=document.getElementById("eriksHint");
if(hb){
  hb.querySelector("button").addEventListener("click",function(e){e.stopPropagation();hideHint(true);});
  hb.addEventListener("click",function(){open("chat");});
}
var w=W(); if(w) w.addEventListener("click",function(){hideHint(true);});
new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
apply();
setTimeout(showHint,6000);
})();
