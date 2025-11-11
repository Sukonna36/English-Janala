 const revomeActive =() =>{
      const lessonBtns = document.querySelectorAll(".lesson-btn");
      // console.log(lessonBtns);
      lessonBtns.forEach( (btn) => 
        btn.classList.remove("active"))
    };
 
 
 
 const creatElements =(arr)=>{
 const htmlElements = arr.map(el =>`<span class="btn" >${el}</span>`)
 return htmlElements.join(' ');
} 

function pronounceWord(word){
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-EN';
  window.speechSynthesis.speak(utterance);
}

const manageSpinner =(status)=>{
  if(status === true){
document.getElementById("spinner").classList.remove("hidden");
document.getElementById("word-container").classList.add("hidden");
  }
  else{
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("word-container").classList.remove("hidden");
  }
} ;

const loadLessons =() =>{
  fetch("https://openapi.programming-hero.com/api/levels/all")
  .then( (res) => res.json())
  .then((json) => displayLesson(json.data) )
}; 

const loadLevelWord = (id) => {
  manageSpinner (true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
  .then((res) => res.json())
  .then((data) => {
    
    revomeActive();
    // remove active class from all buttons
    
    const clickBtn = document.getElementById(`lesson-btn-${id}`);
    clickBtn.classList.add("active")
    displayLevelWord(data.data)
  
  }); 
}

const loadWordDetail =async(id) =>{
  const url =`https://openapi.programming-hero.com/api/word/${id}`;
  
  const res = await fetch (url);
  const ditails = await res.json();
  displayWordDetails(ditails.data);
}

const displayWordDetails = (word) => {
  console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML= ` 
  <div>
     <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2> 
    </div>
    <div>
      <h2 class="text-sm font-semibold">Meaning</h2>
      <p class="font-bangla">${word.meaning}</p>
    </div>
   <div>
    <h2 class="text-sm font-semibold"> Example </h2>
    <p class="text-[#000000]">${word.sentence} </p>
   </div>
   <div>
    <h2>সমার্থক শব্দ গুলো</h2>
    </div>
    <div>${creatElements(word.synonyms)}</div>
  `;
  document.getElementById("word_modal").showModal();

}

const displayLevelWord = (words) => {
  //1. get the container & empty
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if(words.length == 0 ){
    wordContainer.innerHTML = `
    <div class="font-bangla text-center items-center col-span-full  rounded-xl py-10 space-y-6"> 
      <img src="assets/alert-error.png" class="mx-auto">
      <p class="text-xs font-medium text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h2 class="text-[#292524] font-bold text-3xl">নেক্সট Lesson এ যান</h2>
    </div>
    `;
    manageSpinner (false);
    return;
  }
  //2. get intro every lessons
  words.forEach( word => {
      // 3. creat element
      const card = document.createElement("div");
      card.innerHTML= `
      <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
      <h2 class="font-bold text-2xl"> ${word.word ? word.word:"The Word couldn't be found" }</h2>
      <p class="font-semibold">Meaning /Pronounciation</p>
      <div class="text-2xl font-medium font-bangla">"${word.meaning ? word.meaning :"Meaning Couldn't be found"} /${word.pronunciation ? word.pronunciation:"Pronunciation couldn't be found"}"</div>
      <div class="flex justify-between items-center">
        <button onClick="loadWordDetail(${word.id})" class="btn  bg-[#1A91FF1A] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
        <button onClick="pronounceWord('${word.word}')" class="btn  bg-[#1A91FF1A] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
      </div>
    </div>`;
      wordContainer.appendChild(card);
  })
  manageSpinner (false);
}

const displayLesson = (lessons) => {
  //1. get the container & empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  //2. get intro every lessons
  for(let lesson of lessons) {
     // 3. creat element
     console.log(lesson);
     const btnDiv = document.createElement("div"); 
     btnDiv.innerHTML = `
      <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"> <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>
     `

  // 4. append to the container

  levelContainer.appendChild(btnDiv);
  }

};

loadLessons();

document.getElementById("btn-search")
.addEventListener('click', () =>{
  revomeActive();
  manageSpinner(true);

  const input = document.getElementById("input-search");
const searchValue = input.value.trim().toLowerCase();
console.log(searchValue);
fetch("https://openapi.programming-hero.com/api/words/all")
.then((res) => res.json())
.then((data) => {
  const allWords = data.data;
  console.log(allWords);
  const filterWords = allWords.filter( word =>word.word.toLowerCase().includes(searchValue) );
  displayLevelWord(filterWords);
  manageSpinner(false);

})
});
