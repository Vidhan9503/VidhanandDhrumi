const quiz = [
 {q:"Who is more likely to say “I'm not hungry” and then steal the other's food?",a:["Me","Her","Both. Absolutely both.","The waiter"],correct:2},
 {q:"What is our most important relationship skill?",a:["Communication","Making each other laugh","Sending random screenshots","All of the above"],correct:3},
 {q:"Who would plan the entire trip and still somehow forget one important thing?",a:["Me","Her","Both","The universe"],correct:2},
 {q:"What do I want more of in our future?",a:["Trips","Ordinary days together","More photos","All of these"],correct:3},
 {q:"After three years, who is still my favourite person?",a:["You","Obviously you","Still you","Why are you asking this?"],correct:0}
];
let current=0, score=0;
const qEl=document.getElementById("question"), ansEl=document.getElementById("answers"), result=document.getElementById("quizResult"), next=document.getElementById("nextQuestion"), num=document.getElementById("questionNumber");
function render(){
  const item=quiz[current]; num.textContent=`${String(current+1).padStart(2,"0")} / ${String(quiz.length).padStart(2,"0")}`;
  qEl.textContent=item.q; ansEl.innerHTML=""; result.textContent=""; next.classList.add("hidden");
  item.a.forEach((a,i)=>{const b=document.createElement("button");b.className="answer";b.textContent=a;b.onclick=()=>answer(i,b);ansEl.appendChild(b)});
}
function answer(i,btn){
  [...ansEl.children].forEach(b=>b.disabled=true);
  const item=quiz[current];
  if(i===item.correct){btn.classList.add("correct");score++;result.textContent="correct. you know us. ♡";}
  else{btn.classList.add("wrong");ansEl.children[item.correct].classList.add("correct");result.textContent="hmm. we'll discuss this later.";}
  next.classList.remove("hidden");
}
next.onclick=()=>{current++;if(current<quiz.length)render();else{qEl.textContent=`You scored ${score}/${quiz.length}.`;ansEl.innerHTML="";result.textContent=score===quiz.length?"Perfect score. Suspiciously good. 💗":"Honestly? Still getting full marks for effort.";next.textContent="play again ↻";next.classList.remove("hidden");next.onclick=()=>{current=0;score=0;next.textContent="next →";render();}}};
render();