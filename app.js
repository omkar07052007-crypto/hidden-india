const destinations = [
 {id:"ziro",name:"Ziro Valley",state:"Arunachal Pradesh",category:"Mountains",season:"Summer",description:"Lush green valleys, Apatani culture and peaceful landscapes.",detail:"Spend time among green rice fields, pine-covered hills and the distinctive Apatani cultural landscape. Travel respectfully and check local access guidance before visiting."},
 {id:"gokarna",name:"Gokarna",state:"Karnataka",category:"Beaches",season:"Winter",description:"Quiet beaches, coastal trails and a slower seaside rhythm.",detail:"Explore coastal walking routes, relaxed beaches and small-town cafés. Avoid littering and follow local safety advice around the sea."},
 {id:"hampi",name:"Hampi",state:"Karnataka",category:"Historical",season:"Winter",description:"Ancient ruins, giant boulders and stories from a remarkable past.",detail:"Discover the remains of the Vijayanagara landscape, temple architecture and dramatic boulder-strewn scenery. Wear comfortable shoes and respect protected monuments."},
 {id:"tirthan",name:"Tirthan Valley",state:"Himachal Pradesh",category:"Nature",season:"Summer",description:"A peaceful Himalayan escape for forest walks and mountain air.",detail:"Use the valley as a base for nature walks and village stays. Mountain weather can change quickly, so plan routes carefully and check conditions."},
 {id:"mawsynram",name:"Mawlynnong",state:"Meghalaya",category:"Nature",season:"Monsoon",description:"Green village paths, living-root bridges nearby and rich local traditions.",detail:"Enjoy village walks and the lush landscapes of Meghalaya. Ask before photographing residents and respect community rules."},
 {id:"bundelkhand",name:"Orchha",state:"Madhya Pradesh",category:"Historical",season:"Winter",description:"Riverside cenotaphs, palaces and quiet lanes steeped in history.",detail:"Explore palace complexes, cenotaphs and the Betwa river landscape. Check monument timings locally and give yourself time to explore on foot."},
 {id:"varkala",name:"Varkala Cliffs",state:"Kerala",category:"Beaches",season:"Winter",description:"Cliffside views, cafés and sandy stretches along the Arabian Sea.",detail:"Take in coastal views and beach walks. Pay attention to warning signs and use designated access paths to the shore."},
 {id:"chopta",name:"Chopta",state:"Uttarakhand",category:"Mountains",season:"Summer",description:"Meadows, forest trails and big Himalayan views in a compact escape.",detail:"Chopta is a starting point for mountain walks and scenic viewpoints. Check weather, trail conditions and local guidance before heading out."}
];
const grid = document.getElementById("destinationGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const seasonFilter = document.getElementById("seasonFilter");
const emptyState = document.getElementById("emptyState");
const favoritesKey = "hiddenIndiaFavorites";
let showAll = false;

function getFavorites(){ try{return JSON.parse(localStorage.getItem(favoritesKey)||"[]")}catch{return []} }
function saveFavorites(ids){localStorage.setItem(favoritesKey,JSON.stringify(ids))}
function renderDestinations(){
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value, season = seasonFilter.value;
  let filtered = destinations.filter(d =>
    (d.name+" "+d.state+" "+d.description+" "+d.category).toLowerCase().includes(term) &&
    (category==="all"||d.category===category) && (season==="all"||d.season===season));
  if(!showAll && !term && category==="all" && season==="all") filtered=filtered.slice(0,4);
  const favorites=getFavorites();
  grid.innerHTML=filtered.map(d=>`
    <div class="col-12 col-sm-6 col-xl-3">
      <article class="destination-card">
        <div class="destination-card-top"><span class="category-tag">${d.category}</span><span class="destination-monogram" aria-hidden="true">${d.name.split(" ").map(word=>word[0]).join("").slice(0,2)}</span></div>
        <div class="destination-body"><h3>${d.name}</h3><div class="place-state">⌖ ${d.state}</div><p>${d.description}</p>
          <div class="card-bottom"><button class="btn-outline-custom details-btn" data-id="${d.id}">View details →</button>
          <button class="favorite-btn ${favorites.includes(d.id)?"saved":""}" data-favorite="${d.id}" aria-label="${favorites.includes(d.id)?"Remove from":"Add to"} favourites" title="Save favourite">${favorites.includes(d.id)?"♥":"♡"}</button></div>
        </div>
      </article>
    </div>`).join("");
  emptyState.classList.toggle("d-none",filtered.length>0);
}
function toast(message){const el=document.getElementById("toastMessage");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600)}
document.getElementById("searchForm").addEventListener("submit",e=>{e.preventDefault();showAll=true;renderDestinations();document.getElementById("destinations").scrollIntoView({behavior:"smooth"});});
[searchInput,categoryFilter,seasonFilter].forEach(el=>el.addEventListener("input",()=>{showAll=true;renderDestinations()}));
document.getElementById("showAllBtn").addEventListener("click",()=>{showAll=true;searchInput.value="";categoryFilter.value="all";seasonFilter.value="all";renderDestinations()});
grid.addEventListener("click",e=>{
 const fav=e.target.closest("[data-favorite]");
 if(fav){const id=fav.dataset.favorite;let ids=getFavorites();if(ids.includes(id)){ids=ids.filter(x=>x!==id);toast("Removed from your favourites.")}else{ids.push(id);toast("Saved to your favourites.")}saveFavorites(ids);renderDestinations();return}
 const details=e.target.closest("[data-id]");
 if(details){const d=destinations.find(x=>x.id===details.dataset.id);if(!d)return;alert(`${d.name} · ${d.state}\n\n${d.detail}\n\nBest time to visit: ${d.season}\nCategory: ${d.category}`)}
});
const planSelect=document.getElementById("planDestination");
destinations.forEach(d=>{const opt=document.createElement("option");opt.value=d.id;opt.textContent=`${d.name} — ${d.state}`;planSelect.appendChild(opt)});
document.getElementById("plannerForm").addEventListener("submit",e=>{
 e.preventDefault();const d=destinations.find(x=>x.id===planSelect.value);if(!d){planSelect.focus();return}
 const days=Number(document.getElementById("planDays").value),style=document.getElementById("travelStyle").value;
 const ideas=style==="Adventure"?["Start early and choose a locally recommended trail or outdoor activity.","Keep time for a viewpoint or a short guided excursion.","Leave a buffer for weather and transport."]:style==="Culture & history"?["Explore the main heritage sites with a local guide if available.","Visit a local market and learn about regional food and crafts.","Keep time for a slower walk and a second historic stop."]:style==="Nature"?["Begin with a quiet nature walk and observe local guidance.","Choose one scenic spot and spend time there without rushing.","Carry water, take your waste back and respect wildlife."]:["Arrive and settle in, then explore the nearby area on foot.","Choose one main attraction and leave room for spontaneous stops.","Enjoy a local meal and keep the final morning relaxed."];
 const result=document.getElementById("planResult");result.innerHTML=`<h4>${days}-day ${style.toLowerCase()} plan for ${d.name}</h4><p class="text-secondary mb-2">${d.state} · Suggested outline, not a live booking or route.</p><ul>${Array.from({length:days},(_,i)=>`<li><strong>Day ${i+1}:</strong> ${ideas[i%ideas.length]}</li>`).join("")}</ul><p class="small text-secondary mt-3 mb-0">Before travelling, verify transport, opening times, weather and local access rules.</p>`;result.classList.remove("d-none");result.scrollIntoView({behavior:"smooth",block:"nearest"});
});
const feedbackForm=document.getElementById("feedbackForm");
feedbackForm.addEventListener("submit",async e=>{
 e.preventDefault();let valid=true;
 const name=document.getElementById("feedbackName"),email=document.getElementById("feedbackEmail"),message=document.getElementById("feedbackMessage");
 [name,email,message].forEach(x=>{x.classList.remove("is-invalid","is-valid");if(!x.checkValidity()){x.classList.add("is-invalid");valid=false}else{x.classList.add("is-valid")}});
 if(!valid){document.getElementById("feedbackStatus").textContent="Please correct the highlighted fields.";return}
 const payload={name:name.value.trim(),email:email.value.trim(),message:message.value.trim()};
 try{
  const response=await fetch("/api/feedback",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  if(!response.ok)throw new Error("server");
  const result=await response.json();
  document.getElementById("feedbackStatus").textContent=result.message||"Thanks! Your feedback was submitted.";
  feedbackForm.reset();[name,email,message].forEach(x=>x.classList.remove("is-valid"));
 }catch{
  // Static hosting fallback: do not claim server storage if no backend is running.
  const local=JSON.parse(localStorage.getItem("hiddenIndiaFeedback")||"[]");local.push({...payload,submittedAt:new Date().toISOString()});localStorage.setItem("hiddenIndiaFeedback",JSON.stringify(local));
  document.getElementById("feedbackStatus").textContent="Thanks! Feedback saved in this browser demo. Run the Node server to save it on the server.";
  feedbackForm.reset();[name,email,message].forEach(x=>x.classList.remove("is-valid"));
 }
});
document.getElementById("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark-mode");localStorage.setItem("hiddenIndiaDark",document.body.classList.contains("dark-mode")?"1":"0")});
if(localStorage.getItem("hiddenIndiaDark")==="1")document.body.classList.add("dark-mode");
document.getElementById("year").textContent=new Date().getFullYear();
renderDestinations();
