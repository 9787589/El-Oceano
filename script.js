const loader=document.getElementById("loader");
window.addEventListener("load",()=>setTimeout(()=>{loader.style.opacity="0";loader.style.visibility="hidden"},1550));
const prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroVideo=document.getElementById("heroVideo");
if(prefersReducedMotion)heroVideo.pause();

const glow=document.querySelector(".cursor-glow");
let mx=innerWidth/2,my=innerHeight/2,gx=mx,gy=my;
window.addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY});
function cursorLoop(){if(prefersReducedMotion)return;gx+=(mx-gx)*.12;gy+=(my-gy)*.12;glow.style.left=gx+"px";glow.style.top=gy+"px";requestAnimationFrame(cursorLoop)} if(!prefersReducedMotion)cursorLoop();

const canvas=document.getElementById("oceanCanvas"),ctx=canvas.getContext("2d");
let W,H,particles=[];
function resize(){W=canvas.width=innerWidth*devicePixelRatio;H=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);particles=Array.from({length:Math.min(100,innerWidth/12)},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.7+.3,v:Math.random()*.35+.08,a:Math.random()*.5+.1,phase:Math.random()*6.28}))}
resize();addEventListener("resize",resize);
let t=0;
function animate(){
	if(prefersReducedMotion)return;
	t+=.008;ctx.clearRect(0,0,innerWidth,innerHeight);
	particles.forEach(p=>{p.y-=p.v;p.x+=Math.sin(t+p.phase)*.18;if(p.y<-5)p.y=innerHeight+5;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(116,231,225,${p.a})`;ctx.fill()});
	ctx.beginPath();for(let x=0;x<=innerWidth;x+=10){let y=innerHeight*.84+Math.sin(x*.008+t)*12+Math.sin(x*.019-t*1.5)*5;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.strokeStyle="rgba(91,218,215,.08)";ctx.stroke();requestAnimationFrame(animate)
}
if(!prefersReducedMotion)animate();

document.querySelectorAll("[data-tilt]").forEach(card=>{card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;card.style.transform=`perspective(900px) rotateX(${(y/r.height-.5)*-3}deg) rotateY(${(x/r.width-.5)*3}deg)`});card.addEventListener("pointerleave",()=>card.style.transform="")});

const zones=document.querySelectorAll(".zone");
zones.forEach(zone=>zone.addEventListener("click",()=>{
	zones.forEach(item=>{
		const isActive=item===zone;
		item.classList.toggle("active",isActive);
		item.setAttribute("aria-pressed",String(isActive));
	});
}));

const menuButton=document.querySelector(".menu"),siteNav=document.getElementById("site-nav");
menuButton.addEventListener("click",()=>{const isOpen=menuButton.getAttribute("aria-expanded")==="true";menuButton.setAttribute("aria-expanded",String(!isOpen));menuButton.setAttribute("aria-label",isOpen?"Abrir menú":"Cerrar menú");siteNav.classList.toggle("is-open",!isOpen)});
siteNav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","Abrir menú");siteNav.classList.remove("is-open")}));

const contactForm=document.getElementById("contactForm");
contactForm.addEventListener("submit",event=>{
	event.preventDefault();
	const formData=new FormData(contactForm);
	const name=formData.get("name").trim();
	const email=formData.get("email").trim();
	const message=formData.get("message").trim();
	const subject=encodeURIComponent(`Mensaje desde Océano — ${name}`);
	const body=encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\n${message}`);
	document.getElementById("contactStatus").textContent="Se abrió tu aplicación de correo con el mensaje listo para enviar.";
	window.location.href=`mailto:rodrigoirala7@icloud.com?subject=${subject}&body=${body}`;
});

const depthControl=document.getElementById("depthControl");
if(depthControl){
	const depthValue=document.getElementById("depthValue");
	const depthZone=document.getElementById("depthZone");
	const depthDescription=document.getElementById("depthDescription");
	const descentScene=document.getElementById("descentScene");
	const formatDepth=new Intl.NumberFormat("es-ES");
	const depthZones=[
		{max:200,name:"epipelágica",description:"Luz solar y aguas cálidas: la zona donde comienza la mayor parte de la vida marina."},
		{max:1000,name:"mesopelágica",description:"La luz se debilita y empieza la penumbra; muchos animales ascienden aquí durante la noche."},
		{max:4000,name:"batipelágica",description:"La luz del sol ya no llega. La vida se adapta al frío, la presión y la oscuridad."},
		{max:6000,name:"abisopelágica",description:"Enormes llanuras oscuras cubren el fondo, con temperaturas cercanas a la congelación."},
		{max:11000,name:"hadal",description:"En las fosas más profundas, la presión es extrema y cada forma de vida es extraordinaria."}
	];
	function updateDescent(){
		const depth=Number(depthControl.value);
		const progress=depth/Number(depthControl.max);
		const zone=depthZones.find(item=>depth<=item.max)||depthZones[depthZones.length-1];
		depthValue.textContent=formatDepth.format(depth)+" m";
		depthZone.textContent="Zona "+zone.name;
		depthDescription.textContent=zone.description;
		depthControl.setAttribute("aria-valuetext",formatDepth.format(depth)+" metros, zona "+zone.name);
		descentScene.style.setProperty("--depth-progress",progress.toFixed(3));
		descentScene.style.setProperty("--sub-position",(8+progress*78).toFixed(1)+"%");
	}
	depthControl.addEventListener("input",updateDescent);
	updateDescent();
}

const counters=document.querySelectorAll("[data-count]");
if("IntersectionObserver" in window&&!document.hidden){
	const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const el=e.target,end=+el.dataset.count;let n=0;const step=Math.max(1,Math.ceil(end/45));const timer=setInterval(()=>{n+=step;if(n>=end){n=end;clearInterval(timer)}el.textContent=n},25);io.unobserve(el)}})},{threshold:.5});
	counters.forEach(counter=>io.observe(counter));
}else{
	counters.forEach(counter=>counter.textContent=counter.dataset.count);
}

document.querySelectorAll("a[href^='#']").forEach(a=>a.addEventListener("click",e=>{const target=document.querySelector(a.getAttribute("href"));if(target){e.preventDefault();target.scrollIntoView({behavior:prefersReducedMotion?"auto":"smooth"})}}));

const readingProgress=document.getElementById("readingProgress");
const readingProgressBar=document.getElementById("readingProgressBar");
const navLinks=Array.from(document.querySelectorAll("#site-nav a"));
const navSections=navLinks.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
let scrollUpdatePending=false;
function updateReadingProgress(){
	const scrollRange=document.documentElement.scrollHeight-innerHeight;
	const progress=scrollRange>0?Math.min(1,Math.max(0,scrollY/scrollRange)):0;
	readingProgressBar.style.transform=`scaleX(${progress})`;
	readingProgress.setAttribute("aria-valuenow",String(Math.round(progress*100)));
	const activeSection=navSections.reduce((active,section)=>section.getBoundingClientRect().top<=innerHeight*.38?section:active,null);
	navLinks.forEach(link=>{
		const isActive=activeSection&&link.getAttribute("href")==="#"+activeSection.id;
		link.classList.toggle("is-active",Boolean(isActive));
		if(isActive)link.setAttribute("aria-current","location");
		else link.removeAttribute("aria-current");
	});
}
function scheduleReadingProgress(){
	if(scrollUpdatePending)return;
	scrollUpdatePending=true;
	requestAnimationFrame(()=>{updateReadingProgress();scrollUpdatePending=false;});
}
window.addEventListener("scroll",scheduleReadingProgress,{passive:true});
window.addEventListener("resize",scheduleReadingProgress);
window.addEventListener("load",scheduleReadingProgress);
updateReadingProgress();

const soundBtn=document.getElementById("soundBtn");
const soundLabel=document.getElementById("soundLabel");
const oceanAudio=document.getElementById("oceanAudio");
const ambientVolume=.75;
let ambientFadeTimer;
soundBtn.addEventListener("click",async()=>{
	if(oceanAudio.paused){
		try{
			oceanAudio.volume=0;
			await oceanAudio.play();
			if(ambientFadeTimer)clearInterval(ambientFadeTimer);
			const fadeStart=performance.now();
			ambientFadeTimer=setInterval(()=>{
				if(oceanAudio.paused){
					clearInterval(ambientFadeTimer);
					ambientFadeTimer=undefined;
					return;
				}
				const progress=Math.min(1,(performance.now()-fadeStart)/1200);
				oceanAudio.volume=ambientVolume*progress;
				if(progress>=1){
					clearInterval(ambientFadeTimer);
					ambientFadeTimer=undefined;
				}
			},50);
			soundBtn.setAttribute("aria-pressed","true");
			soundLabel.textContent="Pausar ambiente";
		}catch{
			oceanAudio.pause();
			oceanAudio.volume=ambientVolume;
			soundBtn.setAttribute("aria-pressed","false");
			soundLabel.textContent="Audio no disponible";
		}
	}else{
		oceanAudio.pause();
		if(ambientFadeTimer){
			clearInterval(ambientFadeTimer);
			ambientFadeTimer=undefined;
		}
		soundBtn.setAttribute("aria-pressed","false");
		soundLabel.textContent="Escuchar oleaje suave";
	}
});

const currentMap=document.getElementById("currentMap");
const currentDescription=document.getElementById("currentDescription");
const currentDetails={
	global:{
		name:"Circulación global",
		description:"Las corrientes superficiales responden al viento; las profundas, a diferencias de temperatura y salinidad.",
		route:"Red de corrientes superficiales y profundas que conecta las cuencas oceánicas.",
		effect:"Redistribuye calor, nutrientes y carbono entre regiones.",
		source:"NOAA · Corrientes oceánicas",
		href:"https://www.noaa.gov/education/resource-collections/ocean-coasts/ocean-currents"
	},
	atlantic:{
		name:"Corriente del Golfo",
		description:"La corriente del Golfo lleva agua cálida desde el Caribe hacia el Atlántico Norte.",
		route:"Caribe → estrecho de Florida → costa este de Estados Unidos → Atlántico Norte.",
		effect:"Transporta calor hacia latitudes altas y modera el clima regional.",
		source:"NOAA · Corriente del Golfo",
		href:"https://oceanservice.noaa.gov/facts/gulfstreamspeed.html"
	},
	pacific:{
		name:"Corriente de Kuroshio",
		description:"La corriente de Kuroshio transporta aguas cálidas desde Filipinas y Taiwán hacia Japón y el Pacífico Norte.",
		route:"Filipinas → Taiwán → costa de Japón → Pacífico Norte.",
		effect:"Mueve calor y nutrientes a través del Pacífico noroccidental.",
		source:"NOAA · Corrientes oceánicas",
		href:"https://www.noaa.gov/education/resource-collections/ocean-coasts/ocean-currents"
	},
	southern:{
		name:"Corriente Circumpolar Antártica",
		description:"La corriente Circumpolar Antártica fluye de oeste a este alrededor de la Antártida.",
		route:"Rodea la Antártida y conecta los océanos Atlántico, Índico y Pacífico.",
		effect:"Intercambia agua, calor y carbono entre las grandes cuencas oceánicas.",
		source:"NOAA · Corrientes oceánicas",
		href:"https://www.noaa.gov/education/resource-collections/ocean-coasts/ocean-currents"
	}
};
	const currentName=document.getElementById("currentName");
	const currentRoute=document.getElementById("currentRoute");
	const currentEffect=document.getElementById("currentEffect");
	const currentSource=document.getElementById("currentSource");
	function selectCurrent(current){
		const details=currentDetails[current];
		if(!details)return;
	currentMap.dataset.current=current;
		currentDescription.textContent=details.description;
		currentName.textContent=details.name;
		currentRoute.textContent=details.route;
		currentEffect.textContent=details.effect;
		currentSource.textContent=details.source+" ↗";
		currentSource.href=details.href;
		document.querySelectorAll(".current-choice").forEach(choice=>{
			const isSelected=choice.dataset.current===current;
			choice.classList.toggle("is-active",isSelected);
			choice.setAttribute("aria-pressed",String(isSelected));
		});
		document.querySelectorAll(".current-route-group").forEach(route=>{
			route.setAttribute("aria-pressed",String(route.dataset.current===current&&current!=="global"));
		});
	}
	document.querySelectorAll(".current-choice").forEach(button=>button.addEventListener("click",()=>selectCurrent(button.dataset.current)));
	document.querySelectorAll(".current-route-group").forEach(route=>{
		route.addEventListener("click",()=>selectCurrent(route.dataset.current));
		route.addEventListener("keydown",event=>{
			if(event.key==="Enter"||event.key===" "){
				event.preventDefault();
				selectCurrent(route.dataset.current);
			}
		});
	});

const revealTargets=document.querySelectorAll([
	".intro-grid", ".stat", ".creature-card", ".depth-intro", ".zone",
	".section-head", ".fact-grid article", ".descent-heading", ".descent-console",
	".topic-card", ".current-feature", ".ocean-image-strip > div", ".ocean-list article",
	".exploration-visual", ".exploration-copy", ".gallery-item", ".curiosity-grid article",
	".threat-image", ".threat-content", ".future-copy"
].join(","));
if("IntersectionObserver" in window&&!document.hidden){
	const revealObserver=new IntersectionObserver((entries,observer)=>{
		entries.forEach(entry=>{
			if(entry.isIntersecting){
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		});
	},{threshold:.12,rootMargin:"0px 0px -35px 0px"});
	revealTargets.forEach((element,index)=>{
		element.classList.add("scroll-reveal");
		element.style.setProperty("--reveal-delay",(index%4)*65+"ms");
		revealObserver.observe(element);
	});
}else{
	revealTargets.forEach(element=>element.classList.add("is-visible"));
}

const localImageFallbacks=[
	{match:/corrient|current/i,src:"corrientes%20marinas.jpg",alt:"Mapa local de corrientes marinas"},
	{match:/carbono|manglar/i,src:"carbono.jpg",alt:"Carbono azul en ecosistemas costeros"},
	{match:/atl[aá]ntico/i,src:"oceanoatlantico.jpg",alt:"Olas del océano Atlántico"},
	{match:/ártico|artico/i,src:"artico.jpg",alt:"Hielo y mar del océano Ártico"}
];
document.querySelectorAll("img").forEach(image=>image.addEventListener("error",()=>{
	if(image.dataset.localFallbackApplied)return;
	image.dataset.localFallbackApplied="true";
	const description=image.alt+" "+image.src;
	const fallback=localImageFallbacks.find(item=>item.match.test(description))||{
		src:"biodiversidad.jpg",
		alt:"Arrecife de coral y peces"
	};
	image.src=fallback.src;
	image.alt=fallback.alt;
	image.classList.add("local-image-fallback");
	const creatureCard=image.closest(".creature-card");
	if(creatureCard){
		creatureCard.querySelector("h3").textContent="Vida marina";
		creatureCard.querySelector("p").textContent="Una muestra local de la vida en los arrecifes.";
	}
	const caption=image.closest(".gallery-item")?.querySelector("figcaption");
	if(caption)caption.textContent="Arrecife de coral y peces";
},{once:true}));
