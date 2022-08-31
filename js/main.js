// Get some elements
const form = document.getElementById("log-input-form");
const formTextArea = document.getElementById("log-input-form-textarea");
const results = document.getElementById("results");

// A map to sort card values with
const cardValueMap = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};

// A map to sort hand values with
const handValueMap = {
  AA: 169,
  KK: 168,
  QQ: 167,
  AKs: 166,
  JJ: 165,
  AQs: 164,
  KQs: 163,
  AJs: 162,
  KJs: 161,
  TT: 160,
  AKo: 159,
  ATs: 158,
  QJs: 157,
  KTs: 156,
  QTs: 155,
  JTs: 154,
  99: 153,
  AQo: 152,
  A9s: 151,
  KQo: 150,
  88: 149,
  K9s: 148,
  T9s: 147,
  A8s: 146,
  Q9s: 145,
  J9s: 144,
  AJo: 143,
  A5s: 142,
  77: 141,
  A7s: 140,
  KJo: 139,
  A4s: 138,
  A3s: 137,
  A6s: 136,
  QJo: 135,
  66: 134,
  K8s: 133,
  T8s: 132,
  A2s: 131,
  "98s": 130,
  J8s: 129,
  ATo: 128,
  Q8s: 127,
  K7s: 126,
  KTo: 125,
  55: 124,
  JTo: 123,
  "87s": 122,
  QTo: 121,
  44: 120,
  33: 119,
  22: 118,
  K6s: 117,
  "97s": 116,
  K5s: 115,
  "76s": 114,
  T7s: 113,
  K4s: 112,
  K3s: 111,
  K2s: 110,
  Q7s: 109,
  "86s": 108,
  "65s": 107,
  J7s: 106,
  "54s": 105,
  Q6s: 104,
  "75s": 103,
  "96s": 102,
  Q5s: 101,
  "64s": 100,
  Q4s: 99,
  Q3s: 98,
  T9o: 97,
  T6s: 96,
  Q2s: 95,
  A9o: 94,
  "53s": 93,
  "85s": 92,
  J6s: 91,
  J9o: 90,
  K9o: 89,
  J5s: 88,
  Q9o: 87,
  "43s": 86,
  "74s": 85,
  J4s: 84,
  J3s: 83,
  "95s": 82,
  J2s: 81,
  "63s": 80,
  A8o: 79,
  "52s": 78,
  T5s: 77,
  "84s": 76,
  T4s: 75,
  T3s: 74,
  "42s": 73,
  T2s: 72,
  "98o": 71,
  T8o: 70,
  A5o: 69,
  A7o: 68,
  "73s": 67,
  A4o: 66,
  "32s": 65,
  "94s": 64,
  "93s": 63,
  J8o: 62,
  A3o: 61,
  "62s": 60,
  "92s": 59,
  K8o: 58,
  A6o: 57,
  "87o": 56,
  Q8o: 55,
  "83s": 54,
  A2o: 53,
  "82s": 52,
  "97o": 51,
  "72s": 50,
  "76o": 49,
  K7o: 48,
  "65o": 47,
  T7o: 46,
  K6o: 45,
  "86o": 44,
  "54o": 43,
  K5o: 42,
  J7o: 41,
  "75o": 40,
  Q7o: 39,
  K4o: 38,
  K3o: 37,
  "96o": 36,
  K2o: 35,
  "64o": 34,
  Q6o: 33,
  "53o": 32,
  "85o": 31,
  T6o: 30,
  Q5o: 29,
  "43o": 28,
  Q4o: 27,
  Q3o: 26,
  "74o": 25,
  Q2o: 24,
  J6o: 23,
  "63o": 22,
  J5o: 21,
  "95o": 20,
  "52o": 19,
  J4o: 18,
  J3o: 17,
  "42o": 16,
  J2o: 15,
  "84o": 14,
  T5o: 13,
  T4o: 12,
  "32o": 11,
  T3o: 10,
  "73o": 9,
  T2o: 8,
  "62o": 7,
  "94o": 6,
  "93o": 5,
  "92o": 4,
  "83o": 3,
  "82o": 2,
  "72o": 1,
};

// Function to take in array of log lines and map-like object containing
// hand frequency
const processLogLines = (lines) => {
  const hands = lines
    .filter((line) => line.startsWith('"Your hand is '))
    .map((line) => line.match(/(?:[2-9]|10|[JQKA])[♠️♦️♥️♣️]/g))
    .map((cards) => {
      // Convert 10 to T
      const processedCards = cards.map((card) =>
        card.length === 3 ? "T" + card.slice(-1) : card
      );

      // Unpack the cards
      const card1 = processedCards[0];
      const card2 = processedCards[1];
      const val1 = card1[0];
      const val2 = card2[0];
      const suit1 = card1[1];
      const suit2 = card2[1];

      // Combine the two values in order
      const vals = [val1, val2]
        .sort((v1, v2) => cardValueMap[v1] - cardValueMap[v2])
        .reverse()
        .join("");

      // Now determine the suit suffix: suited, off-suit, or if the hand
      // is a pair, then nothing
      let suitSuffix = "";

      if (val1 !== val2) {
        if (suit1 === suit2) {
          suitSuffix = "s";
        } else {
          suitSuffix = "o";
        }
      }

      return vals + suitSuffix;
    });

  // Get hand frequency
  const counts = {};

  for (const hand of hands) {
    counts[hand] = (counts[hand] || 0) + 1;
  }

  return counts;
};

// Function to attach heatmap to a parent element
const attachHeatmap = (parentElId, counts) => {
  // Some display settings
  const innerWidth = 500;
  const innerHeight = 500;
  const margin = { top: 20, bottom: 0, left: 30, right: 0 };

  const axisPadding = 0.01;

  const scaleRangeColours = ["#f8f8f8", "#be1931"];

  // Make data. Here the v1 value will correspond to the x-axis, and the
  // v2 value to the y-axis. Hence given that the suited cards are in
  // the upper right corner of the grid, suited cards will have v1 > v2,
  // while off-suit cards will have v1 < v2. We'll put a bit more
  // information in each data point then we'll probably need.
  const cardVals = Object.keys(cardValueMap)
    .sort((v1, v2) => cardValueMap[v1] - cardValueMap[v2])
    .reverse();

  const data = [];

  for (const v1 of cardVals) {
    for (const v2 of cardVals) {
      const datum = { v1: v1, v2: v2 };

      let label;
      let suited = false;
      let pair = false;

      if (v1 === v2) {
        label = v1 + v2;
        pair = true;
      } else if (cardValueMap[v1] > cardValueMap[v2]) {
        label = v1 + v2 + "o";
      } else {
        label = v2 + v1 + "s";
        suited = true;
      }

      datum.label = label;
      datum.count = counts[label] || 0;
      datum.pair = pair;
      datum.suited = suited;

      data.push(datum);
    }
  }

  // Tooltip
  const tooltip = d3
    .select("#" + parentElId)
    .append("div")
    .style("opacity", 0)
    .style("position", "absolute")
    .attr("class", "tooltip");
  const tooltipMousemove = (event) =>
    tooltip
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY - 11 + "px");
  const tooltipMouseout = () => tooltip.style("opacity", 0);

  const numTotalHands = Object.values(counts).reduce((a, b) => a + b, 0);
  const tooltipMouseover = (event, d) => {
    const expectedCount =
      Math.round(
        ((numTotalHands * (d.pair ? 6 : d.suited ? 4 : 12)) / 1326) * 100
      ) / 100;

    tooltip
      .style("opacity", 0.9)
      .html(
        `<b>${d.label}</b><br>` +
          `count: ${d.count}<br>` +
          `expected count: ${expectedCount}`
      );
  };

  // Make SVG
  const svg = d3
    .select("#" + parentElId)
    .append("svg")
    .attr("width", innerWidth + margin.left + margin.right)
    .attr("height", innerHeight + margin.top + margin.bottom);

  const svgG = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Make axes
  const x = d3
    .scaleBand()
    .range([0, innerWidth])
    .domain(cardVals)
    .padding(axisPadding);

  const y = d3
    .scaleBand()
    .range([0, innerHeight])
    .domain(cardVals)
    .padding(axisPadding);

  svgG.append("g").attr("class", "x axis").call(d3.axisTop(x));
  svgG.append("g").attr("class", "y axis").call(d3.axisLeft(y));

  // Make colour scale
  const colourScale = d3
    .scaleLinear()
    .range(scaleRangeColours)
    .domain([0, d3.max(Object.values(counts))]);

  // Draw the rectangles
  svgG
    .selectAll()
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.v1))
    .attr("y", (d) => y(d.v2))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", (d) => colourScale(d.count))
    .on("mouseover", tooltipMouseover)
    .on("mousemove", tooltipMousemove)
    .on("mouseout", tooltipMouseout);
};

// Function to attach CDF plot to a parent element
const attachCDFPlot = (parentElId, counts) => {
  // Some display settings
  const innerWidth = 500;
  const innerHeight = 500;
  const margin = { top: 10, bottom: 20, left: 30, right: 10 };

  const lineStrokeWidth = 1.5;

  const realDataColourHex = "#be1931";
  const expectedDataColourHex = "#989898";

  // Make data we can work with
  const realData = [{ x: 0, y: 0 }];
  const expectedData = [{ x: 0, y: 0 }];

  const numHandsPlayed = Object.values(counts).reduce((a, b) => a + b, 0);
  const allHandsOrdered = Object.keys(handValueMap)
    .sort((h1, h2) => handValueMap[h1] - handValueMap[h2])
    .reverse();

  let prevX = 0;
  let prevRealY = 0;
  let prevExpY = 0;

  const incX = 1 / 169;

  for (let i = 0; i < 169; i++) {
    const hand = allHandsOrdered[i];
    const pair = hand.length === 2;
    const suited = hand.length === 3 && hand.slice(-1) === "s";

    const realY = counts[hand] ? counts[hand] / numHandsPlayed : 0;
    const expY = (pair ? 6 : suited ? 4 : 12) / 1326;

    prevX += incX;
    prevRealY += realY;
    prevExpY += expY;

    realData.push({ x: prevX, y: prevRealY });
    expectedData.push({ x: prevX, y: prevExpY });
  }

  const data = [
    { data: expectedData, colourHex: expectedDataColourHex, label: "expected" },
    { data: realData, colourHex: realDataColourHex, label: "actual" },
  ];

  // Make SVG
  const svg = d3
    .select("#" + parentElId)
    .append("svg")
    .attr("width", innerWidth + margin.left + margin.right)
    .attr("height", innerHeight + margin.top + margin.bottom);

  const svgG = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Make axes
  const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
  const y = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

  svgG
    .append("g")
    .attr("class", "x axis-grid")

    .attr("transform", `translate(0,${innerHeight})`)
    .call(
      d3.axisBottom(x).tickSize(-innerHeight).tickFormat("").tickSizeOuter(0)
    );
  svgG
    .append("g")
    .attr("class", "y axis-grid")
    .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat("").tickSizeOuter(0));
  svgG
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x));
  svgG.append("g").attr("class", "y axis").call(d3.axisLeft(y));

  // Draw the lines
  const lineParse = d3
    .line()
    .x((d) => x(d.x))
    .y((d) => y(d.y));

  svgG
    .selectAll(".line")
    .data(data)
    .enter()
    .append("path")
    .attr("d", (d) => lineParse(d.data))
    .attr("fill", "none")
    .attr("stroke", (d) => d.colourHex)
    .attr("stroke-width", lineStrokeWidth);
};

// Function to attach raw hand counts to a parent element
const attachRawCounts = (parentEl, counts) => {
  for (const hand of Object.keys(counts)
    .sort((hand1, hand2) => handValueMap[hand1] - handValueMap[hand2])
    .reverse()) {
    const handDiv = document.createElement("div");
    handDiv.classList.add("results-list-item");

    parentEl.appendChild(handDiv);

    const handValueSpan = document.createElement("span");
    const handCountSpan = document.createElement("span");

    handValueSpan.classList.add("results-list-item-hand-value-span");
    handCountSpan.classList.add("results-list-item-hand-count-span");

    handDiv.appendChild(handValueSpan);
    handDiv.appendChild(handCountSpan);

    handValueSpan.textContent = hand + ": ";
    handCountSpan.textContent = counts[hand];
  }
};

// Function to process the form and spit out results
const processForm = (event) => {
  // Prevent default
  if (event.preventDefault) {
    event.preventDefault();
  }

  // Wipe previous results
  results.innerHTML = "";

  // Process the textarea data
  const formLines = formTextArea.value.split(/\n/);
  const handCounts = processLogLines(formLines);

  // If there are no hands, then something probably went wrong, so show
  // an error
  if (!Object.keys(handCounts).length) {
    results.textContent = "no hands found. you've probably made a mistake.";

    return false;
  }

  // Draw a heatmap
  const resultsGridTitle = document.createElement("h2");
  resultsGridTitle.textContent = "heatmap";

  const resultsGridDiv = document.createElement("div");
  const resultsGridDivId = "results-grid-div";
  resultsGridDiv.id = resultsGridDivId;

  results.appendChild(resultsGridTitle);
  results.appendChild(resultsGridDiv);

  attachHeatmap(resultsGridDivId, handCounts);

  // Draw cumulative distribution function plots
  const resultsPlotTitle = document.createElement("h2");
  resultsPlotTitle.textContent = "cumulative distribution function plot";

  const resultsPlotDiv = document.createElement("div");
  const resultsPlotDivId = "results-cdf-plot-div";
  resultsPlotDiv.id = resultsPlotDivId;

  results.appendChild(resultsPlotTitle);
  results.appendChild(resultsPlotDiv);

  attachCDFPlot(resultsPlotDivId, handCounts);

  // Show hand frequencies, in order of best to worst hands
  const resultsListTitle = document.createElement("h2");
  resultsListTitle.textContent = "raw counts";

  const resultsListDiv = document.createElement("div");
  resultsListDiv.classList.add("results-list");

  results.appendChild(resultsListTitle);
  results.appendChild(resultsListDiv);

  attachRawCounts(resultsListDiv, handCounts);

  // Return false to prevent default form behavior
  return false;
};

// Hook in the form processing function
if (form.attachEvent) {
  form.attachEvent("submit", processForm);
} else {
  form.addEventListener("submit", processForm);
}
