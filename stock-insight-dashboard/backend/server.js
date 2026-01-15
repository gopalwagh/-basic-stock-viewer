//it's a third party module
const express = require("express");

// imoorting a exec module for running child_process 
// in that we are  using a pyton script as a child process 
const { exec } = require("child_process");

// it's a local module
const path = require("path");

// it's a instances of a exxpress() basically we is use to handle middleware and router's easily
const app = express();

// this is a fronted path directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Root route
app.get("/", (req, res,next) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


// //static middleware for output folder
app.use("/output", express.static(path.join(__dirname, "output")));

// API
app.get("/api/analyze", (req, res) => {
  const symbol = req.query.symbol;
  
  //agar symbol nahi raha to python scripts bina symbol ke run ho jati
  //aur unclear error milta to usse bachne ke liye validation lagaya simple
  if (!symbol) {
    return res.status(400).json({ error: "Stock symbol is required" });
  }

  const pythonScript = path.join(__dirname, "python", "stock_analysis.py");
  const command = `python "${pythonScript}" ${symbol}`;

  // stderr => the error output of the command line
  // error => the command fails (non-zero exit code, or execution error).
  // stdout: The normal output of the command (like what you’d see in terminal).
  exec(command, (error, stdout, stderr) => {
    if (error) { // it's for error handling beacause of user awareness python scripts kyu fail ho gayi
      console.error(stderr);
      return res.status(500).json({
        error: "Python execution failed",
        details: stderr || stdout,
      });
    }

    console.log(stdout);

    res.json({
      message: "Stock analysis completed",
      symbol: symbol.toUpperCase(),
    });
  });
});

//it's a listening PORT
const PORT = 3000;
console.log("server get started soon...")
// server get started to listening
setTimeout(() => {
  app.listen(PORT, () => {
    console.log("Server now ready ")
    console.log(`Server running at http://localhost:${PORT}`);
  });
}, 2000);