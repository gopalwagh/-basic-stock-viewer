document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("analyzeBtn").addEventListener("click", analyzeStock);
});

/* loader logic  */
let progress = 0;
  const main_page = document.getElementById("main-page");
  const bar = document.getElementById("bar");
  const percent = document.getElementById("percent");
  const loader1 = document.getElementById("loader1");
  const app = document.querySelector(".container");
  
  const interval = setInterval(() => {
    progress++;
    bar.style.width = progress + "%";
    percent.innerText = progress + "%";

    if(progress === 100) {
        clearInterval(interval);

        setTimeout(() => {
            loader1.style.display = "none";
            main_page.style.display = "block";
        }, 300);
    }
  }, 4000/100); 

/* main page code */
const loader = document.getElementById("loader");
loader.style.display = "none";

function analyzeStock() {
  const symbol = document.getElementById("symbolInput").value.trim();
  const status = document.getElementById("status");
  const charts = document.getElementById("charts");


  // if input is empty stop functioning and all
  if (!symbol) return;
  
  status.innerText = "Analyzing stock...";
  charts.style.display = "none";
  loader.style.display = "flex";

  fetch(`/api/analyze?symbol=${symbol}`)
  .then(res => res.json())
  .then(() => {
    const base = `/output/${symbol.toUpperCase()}`;

    const priceImg = document.getElementById("priceChart");
    const volumeImg = document.getElementById("volumeChart");

    let loadedCount = 0; 
    // for checking both images loadedd or not
    function imageLoaded() {
      loadedCount++;
      if (loadedCount === 2) {
        loader.style.display = "none";
        charts.style.display = "block";
        status.innerText = "Analysis completed";
      }
    }
      // attach load listeners BEFORE setting src
      // onload basically A javascript function which is used 
      //for checking images loaded or not..if yes then run imageLoaded function 
      priceImg.onload = imageLoaded;
      volumeImg.onload = imageLoaded;
      
      priceImg.src = `${base}/price.png?${Date.now()}`;
      volumeImg.src = `${base}/volume.png?${Date.now()}`;
    })
    .catch(() => {
      loader.style.display = "none";
      status.innerText = "Error generating charts";
    });

}
