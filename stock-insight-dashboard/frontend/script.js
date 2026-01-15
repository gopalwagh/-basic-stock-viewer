document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("analyzeBtn").addEventListener("click", analyzeStock);
});


/* main page code */
function analyzeStock() {
  const symbol = document.getElementById("symbolInput").value.trim();
  const status = document.getElementById("status");
  const charts = document.getElementById("charts");
  // if input is empty stop functioning and all
  if (!symbol) return;
  
  status.innerText = "Analyzing stock...";
  charts.style.display = "none";

  fetch(`/api/analyze?symbol=${symbol}`)
  .then(res => res.json())
  .then(() => {
    const base = `/output/${symbol.toUpperCase()}`;

    document.getElementById("priceChart").src =
      `${base}/price.png?${Date.now()}`;
    // - ?${Date.now()} adds a timestamp → 
    // prevents browser caching old image.
    //- Why: Ensures user sees fresh chart after each analysis.


    document.getElementById("volumeChart").src =
      `${base}/volume.png?${Date.now()}`;

    charts.style.display = "block";
    status.innerText = "Analysis completed";
  })
  .catch(() => {
    status.innerText = "Error generating charts";
  });

}
