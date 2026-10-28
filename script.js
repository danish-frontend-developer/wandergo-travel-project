const trips = [
  {id:1,title:"Bali Island Reset",place:"Bali, Indonesia",category:"Beach",days:6,price:459,rating:"4.9",label:"BESTSELLER",image:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",description:"Find your rhythm among emerald rice terraces, quiet temples, beach cafés and golden-hour sunsets.",includes:["Boutique stay","Local guide","Airport transfer"]},
  {id:2,title:"Alpine Dream Escape",place:"Swiss Alps, Switzerland",category:"Nature",days:5,price:699,rating:"4.9",label:"SMALL GROUP",image:"https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85",description:"Wake up to mountain air, wander scenic trails and discover lakeside villages tucked into the Alps.",includes:["Mountain lodge","Guided hike","Breakfast daily"]},
  {id:3,title:"Santorini in Blue",place:"Santorini, Greece",category:"Culture",days:4,price:579,rating:"4.8",label:"SUNSET FAVORITE",image:"https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=85",description:"Explore whitewashed lanes, seaside tavernas and the famous blue-and-white island views.",includes:["Sea-view stay","Island tour","Welcome dinner"]},
  {id:4,title:"Wild Costa Rica",place:"La Fortuna, Costa Rica",category:"Nature",days:7,price:829,rating:"5.0",label:"ADVENTURE",image:"https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=85",description:"Step into lush rainforest, spot wildlife and unwind in natural hot springs beneath volcanoes.",includes:["Eco-lodge","Nature guide","Hot spring entry"]},
  {id:5,title:"Marrakech Stories",place:"Marrakech, Morocco",category:"Culture",days:4,price:389,rating:"4.8",label:"CULTURE PICK",image:"https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=85",description:"Get lost in colorful souks, discover historic courtyards and taste your way through Moroccan cuisine.",includes:["Riad stay","Medina walk","Food tasting"]},
  {id:6,title:"Maldives Slow Days",place:"Maldives",category:"Beach",days:5,price:999,rating:"4.9",label:"ISLAND LIFE",image:"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85",description:"Trade busy days for turquoise water, soft sand, snorkeling and long, peaceful island mornings.",includes:["Island resort","Boat transfer","Snorkeling trip"]},
  {id:7,title:"Kyoto Quiet Paths",place:"Kyoto, Japan",category:"Culture",days:5,price:749,rating:"4.9",label:"CULTURE PICK",image:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",description:"Walk through serene gardens, traditional streets and beautiful shrines with a local host.",includes:["Central hotel","Local host","Transit pass"]},
  {id:8,title:"Dolomites Trail Days",place:"Dolomites, Italy",category:"Nature",days:6,price:769,rating:"4.9",label:"TRAIL FAVORITE",image:"https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85",description:"Follow dramatic mountain paths, stay in cozy alpine towns and take in unforgettable views.",includes:["Mountain hotel","Trail guide","Daily breakfast"]}
];
let activeFilter = "All";
let searchTerm = "";
let showAll = false;
let toastTimer;
const grid = document.getElementById("tourGrid");
const modal = document.getElementById("tourModal");
const modalContent = document.getElementById("modalContent");
const toast = document.getElementById("toast");

function money(n){return "$" + n.toLocaleString("en-US");}
function getVisibleTrips(){
  let list = trips.filter(t => (activeFilter === "All" || t.category === activeFilter) && (t.title + " " + t.place + " " + t.category).toLowerCase().includes(searchTerm.toLowerCase()));
  const sort = document.getElementById("sortSelect").value;
  if(sort === "low") list.sort((a,b)=>a.price-b.price);
  if(sort === "high") list.sort((a,b)=>b.price-a.price);
  return showAll ? list : list.slice(0,6);
}
function renderTrips(){
  const visible = getVisibleTrips();
  grid.innerHTML = "";
  document.getElementById("resultsLine").textContent = visible.length ? `Showing ${visible.length} handpicked ${visible.length===1?"escape":"escapes"}` : "No trips found — try another destination or filter.";
  visible.forEach((trip,index)=>{
    const card = document.createElement("article");
    card.className = "tour-card reveal";
    card.style.transitionDelay = `${Math.min(index*60,240)}ms`;
    card.innerHTML = `<div class="tour-photo"><img src="${trip.image}" alt="${trip.title}" loading="lazy"><span class="tour-label">${trip.label}</span><button class="tour-heart" aria-label="Save ${trip.title}" data-save="${trip.id}">♡</button></div>
      <div class="tour-content"><div class="tour-meta"><span>⌁ ${trip.place}</span><span class="tour-rating">★ ${trip.rating}</span></div><h3>${trip.title}</h3><p>${trip.description}</p><div class="tour-card-bottom"><div><span class="price-label">FROM / PERSON</span><span class="tour-price">${money(trip.price)} <small>/ ${trip.days} days</small></span></div><button class="details-btn" data-details="${trip.id}" aria-label="View ${trip.title} details">↗</button></div></div>`;
    grid.appendChild(card);
  });
  document.getElementById("showAllBtn").textContent = showAll ? "Show fewer trips ↑" : "Explore all adventures ↗";
  observeReveals();
}
function showToast(message){
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2800);
}
function openTrip(tripId){
  const trip=trips.find(t=>t.id===Number(tripId)); if(!trip)return;
  modalContent.innerHTML = `<img class="modal-image" src="${trip.image}" alt="${trip.title}"><p class="eyebrow dark-eyebrow">${trip.category.toUpperCase()} ESCAPE · ★ ${trip.rating}</p><h3 id="modalTitle">${trip.title}</h3><p>${trip.description}</p><p><strong>Included:</strong> ${trip.includes.join(" · ")}</p><div class="modal-price">${money(trip.price)} <span style="font:500 12px 'DM Sans',sans-serif;color:#788179">/ person · ${trip.days} days</span></div><form class="booking-form" id="bookingForm"><label>Your name<input name="name" required minlength="2" placeholder="Full name"></label><label>Email address<input name="email" type="email" required placeholder="you@example.com"></label><label>Start date<input name="date" type="date" required min="${new Date().toISOString().slice(0,10)}"></label><label>Travelers<select name="travelers"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5+</option></select></label><button class="button button-dark full" type="submit">Request this trip <span>↗</span></button></form><p style="font-size:10px">Demo only: this form shows a confirmation and does not take payment or create a real booking.</p>`;
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
  document.getElementById("bookingForm").addEventListener("submit",e=>{
    e.preventDefault(); const name=new FormData(e.currentTarget).get("name");
    closeModal(); showToast(`Thanks, ${name}! Demo booking request received.`);
  });
}
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";}
document.getElementById("filterPills").addEventListener("click",e=>{
  const btn=e.target.closest("[data-filter]");if(!btn)return;
  activeFilter=btn.dataset.filter;
  document.querySelectorAll(".filter-pill").forEach(b=>b.classList.toggle("selected",b===btn));
  renderTrips();
});
document.getElementById("sortSelect").addEventListener("change",renderTrips);
document.getElementById("showAllBtn").addEventListener("click",()=>{showAll=!showAll;renderTrips();});
document.getElementById("searchForm").addEventListener("submit",e=>{
  e.preventDefault(); searchTerm=document.getElementById("destinationSearch").value.trim();
  const style=document.getElementById("styleSearch").value; activeFilter=style;
  document.querySelectorAll(".filter-pill").forEach(b=>b.classList.toggle("selected",b.dataset.filter===activeFilter));
  showAll=true;renderTrips();document.getElementById("tours").scrollIntoView({behavior:"smooth"});
  showToast(`Searching for ${searchTerm || "all destinations"} · ${document.getElementById("travelerSearch").value} traveler(s)`);
});
document.querySelectorAll("[data-destination]").forEach(card=>card.addEventListener("click",()=>{
  document.getElementById("destinationSearch").value=card.dataset.destination;
  searchTerm=card.dataset.destination;activeFilter="All";showAll=true;
  document.querySelectorAll(".filter-pill").forEach(b=>b.classList.toggle("selected",b.dataset.filter==="All"));
  renderTrips();document.getElementById("tours").scrollIntoView({behavior:"smooth"});
}));
grid.addEventListener("click",e=>{
  const detail=e.target.closest("[data-details]"); if(detail){openTrip(detail.dataset.details);return;}
  const save=e.target.closest("[data-save]");if(save){save.classList.toggle("saved");save.textContent=save.classList.contains("saved")?"♥":"♡";showToast(save.classList.contains("saved")?"Trip saved to your favorites":"Removed from favorites");}
});
document.getElementById("modalClose").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
document.getElementById("newsletterForm").addEventListener("submit",e=>{
  e.preventDefault();const email=document.getElementById("emailInput").value;
  document.getElementById("newsletterMessage").textContent=`You're on the list! (Demo confirmation for ${email})`;
  e.currentTarget.reset();showToast("Subscribed successfully — demo mode!");
});
const nav=document.getElementById("nav"),menuToggle=document.getElementById("menuToggle");
menuToggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.textContent=open?"×":"☰";});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");menuToggle.textContent="☰";}));
document.getElementById("year").textContent=new Date().getFullYear();
function observeReveals(){
  const els=document.querySelectorAll(".reveal:not(.visible)");
  if(!("IntersectionObserver" in window)){els.forEach(el=>el.classList.add("visible"));return;}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.08});
  els.forEach(el=>observer.observe(el));
}
observeReveals();renderTrips();
