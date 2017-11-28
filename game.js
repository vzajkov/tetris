
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      var xShift = 0;

      var cols = [3,4,5,6];

      var currentCols = cols;

      var rows = [0 ,0 ,0 ,0];

      var currentRows = rows;

      var toggle = false;

      var rowHolder = [];

      var score = 0;

      var oldScore = 0;

      var anchorCol = 0;

      var delay = 200;

      var startGame = false;

      var pauseGame = false;

      var oldDelay = delay;

      var gameOver = false;

      var baseCol = 0;

      var baseRow = 0;

      var highScores = [500, 1000,  5000,  10000, 25000];

      const colors = ["#F7DC6F","#2471A3", "#2ECC71", "#EB984E", "#AF7AC5", "#D5DBDB", "#784212"];
      var currentColor = "#F7DC6F";

      //in block positions, xPos key points to an array of yPos's
      var blockPositions = {0: [25], 1: [25],  2: [25], 3: [25], 4: [25], 5: [25], 6: [25], 7: [25], 8: [25], 9:[25], 10: [25], 11: [25]};

      const kicksRight = (inputCols, inputRows) => {
        inputCols.forEach((col, idx) => {
          if (blockPositions[col].includes(inputRows[idx]) ) {
            return true;
          }
        });
        return false;
      };

      const sinkBlocks = (delay, cols,  rows, color) => {
        document.getElementById("score").innerHTML = score;

        //starting and pausing game
        if (startGame === true) {
          document.getElementById("press-start").innerHTML = "";
        }
        if (pauseGame === true) {
          document.getElementById("game-paused").innerHTML = "Game Paused";
        } else {
          document.getElementById("game-paused").innerHTML = "";
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        currentCols = cols;
        currentRows = rows;
        Object.keys(blockPositions).forEach( (col) => {
          if (blockPositions[col].includes(0)) {
            gameOver = true;
          }
        });

        //checks if any of the blocks touch the stacked blocks
          cols.forEach( (col, idx) => {
            if (blockPositions[col + xShift].slice(-1)[0] === rows[idx] + 1) {
              toggle =  true;
            }
          });

        if (toggle === true) {
          cols.forEach( (col, idx) => {

              blockPositions[col + xShift].push(rows[idx]);
              blockPositions[col + xShift].sort(function(a,b) {return b - a;});

          });

          //gets all the rows that are filled up
          Object.values(blockPositions).forEach( (arr) => {
            arr.forEach( (row) => {
              if (Object.values(blockPositions).every( (array) => {
                return array.includes(row) && row != 25 && !rowHolder.includes(row);
              })) {
                rowHolder.push(row);
              }
            });
          });

          // increment the rows by one if they are on top of the deleted row
          Object.keys(blockPositions).forEach( (col, idx) => {
            rowHolder.forEach( (fullRow) => {
              if (blockPositions[col].includes(fullRow)) {
                blockPositions[col].splice(blockPositions[col].indexOf(fullRow), 1);
                blockPositions[col].forEach((row) => {
                  if (row < fullRow) {
                    blockPositions[col][blockPositions[col].indexOf(row)]++;
                  }
                });
              }
            });
          });

          rowHolder = [];
          cols = [];
          rows = [0];
          anchorCol = Math.floor(Math.random() * 10);
          cols.push(anchorCol);
          for (let blockCount = 1; blockCount < 4; blockCount++) {
            switch (Math.floor(Math.random() * 4)) {

              case 0 :
                if (cols.slice(-1)[0] < 11) {
                  cols.push(cols.slice(-1)[0] + 1); //new column
                  rows.push(rows.slice(-1)[0]); //same row
                } else {
                  cols.push(cols.slice(-1)[0]); //same column
                  rows.push(rows.slice(-1)[0] + 1); //new row
                }
                break;
              case 1 :
                cols.push(cols.slice(-1)[0]); //same column
                rows.push(rows.slice(-1)[0] + 1); //new row
                break;
              case 2:
                cols = [anchorCol, anchorCol, anchorCol + 1, anchorCol + 1];
                rows = [0, 1 , 0 , 1];
                blockCount = 4;
                break;
              case 3:
                if (anchorCol + 1 < 11) {
                  cols = [anchorCol, anchorCol, anchorCol, anchorCol + 1];
                  rows = [0 , 1 , 2, 1];
                  blockCount = 4;
                }
                break;
            }
          }

          toggle = false;
          xShift = 0;

          currentColor = colors[Math.floor(Math.random() * colors.length)];
          return sinkBlocks(delay, cols, rows, currentColor);
        }

        //all the stacked blocks
          Object.keys(blockPositions).forEach((x) => {
            return blockPositions[x].forEach((y) => {
              ctx.beginPath();
              ctx.moveTo((x * 25) + 1, (y * 25) - 24);
              ctx.lineTo((x * 25) + 1, (y * 25));
              ctx.lineTo((x * 25) + 23, (y * 25));
              ctx.lineTo((x * 25) + 23, (y * 25) - 24);
              ctx.lineTo((x * 25) + 1, (y * 25) - 24);
              ctx.strokeStyle = "#ffffff";
              ctx.stroke();
            });
          });

          // current dropping unique block
          cols.forEach( (col, idx) => {
            ctx.fillStyle = currentColor;
            ctx.beginPath();
            ctx.moveTo(((col + xShift) * 25) + 1, (rows[idx] * 25));
            ctx.lineTo(((col + xShift) * 25) + 1, (rows[idx] * 25) + 24);
            ctx.lineTo(((col + xShift) * 25) + 23, (rows[idx] * 25) + 24);
            ctx.lineTo(((col + xShift) * 25) + 23, (rows[idx] * 25));
            ctx.lineTo(((col + xShift) * 25) + 1, (rows[idx] * 25));
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();
            ctx.fillRect(((col + xShift) * 25) + 1, (rows[idx] * 25), 23, 23);
          });

          score = score + 10;
          toggle = false;
          if (score > oldScore + 500 &&  delay >= 100) {
            oldScore = score;
            delay = delay - 10;
          }

          if (gameOver === true) {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            document.getElementById("game-over").innerHTML = "Game Over! Press any key to play again.";
            highScores.forEach( (highScore, idx) => {
              if (score > highScore) {
                highScores[idx] = score;
              }
            });
            scoreFlasher(score, highScores);
          }

          if (pauseGame === false && gameOver === false) {
          setTimeout( () => {
            sinkBlocks(delay, currentCols, currentRows.map((row) => { return row + 1;}))
          }, delay);
          }


      };

      //key movements
      document.addEventListener('keypress', (e) => {
        if (gameOver === true) {
          gameOver = false;
          blockPositions = {0: [25], 1: [25],  2: [25], 3: [25], 4: [25], 5: [25], 6: [25], 7: [25], 8: [25], 9:[25], 10: [25], 11: [25]};
          score = 0;
          oldScore = 0;
          delay = 400;
          cols = [3,4,5,6];
          rows = [0, 0, 0, 0];
          currentColor = "#F7DC6F";
          document.getElementById("game-over").innerHTML = "";
          return sinkBlocks(delay, cols, rows, currentColor );
        }
        if (startGame === false) {
          startGame = true;
          return sinkBlocks(delay, cols, rows, currentColor);
        }
        switch(e.key) {
          case "p" :
            if (pauseGame === false) {
              console.log("hitting!!!");
              pauseGame = true;
            } else if (pauseGame === true) {
              pauseGame = false;
              return sinkBlocks(delay, currentCols, currentRows, currentColor);
            }
            break;
          case "d" :
            if (currentCols.every((currentCol) => {
              return currentCol + xShift < 11;
              // && blockPositions[currentCol + xShift + 1].every( (row) => {return row != currentRows[idx] })
            })) {
              console.log("d pressed!");
              xShift = xShift + 1;
            }

            break;
          case "a" :
            if (currentCols.every((currentCol) => {
              return currentCol + xShift > 0;
              // && blockPositions[currentCol + xShift - 1].every( (row) => {return row != currentRows[idx] })
            })) {
              console.log("a pressed!");
              xShift = xShift - 1;
            }
            break;
          case "r" :
          console.log("r pressed!");
            baseCol = currentCols[0];
            baseRow = currentRows[0];


            if (currentRows.every((row) => {return row === currentRows[0];}) && currentCols.slice(1,5).every((col) => {return col != currentCols[0];})) {
              //special case for flat I bar
              //make all the columns the same to keep it vertical, make rows increment
              for (let i=0; i < 4; i++) {
                currentCols[i] = currentCols[0];
                currentRows[i] = currentRows[0] + i;
              }
            }
            else if (currentRows.slice(1,5).every((row) => {return row != currentRows[0];}) &&  currentCols.every((col) => {return col === currentCols[0]})) {
              //special case for vertical I bar
              for (let i=0; i < 4; i++) {
                currentRows[i] = currentRows[0];
                currentCols[i] = currentCols[0] + i;
              }
            }
            else if (currentCols.toString() === [baseCol, baseCol, baseCol, baseCol + 1].toString() && currentRows.toString() === [baseRow , baseRow + 1 , baseRow + 2, baseRow + 1].toString() ) {
              //hitting the right pointing T shape to transform to down pointing T shape
              currentCols = [baseCol - 1, baseCol, baseCol, baseCol + 1];
              currentRows = [baseRow + 1, baseRow + 1, baseRow + 2, baseRow + 1];
            }
            else if (currentCols.toString() === [baseCol, baseCol + 1, baseCol + 1, baseCol + 2].toString() &&  currentRows.toString() === [baseRow, baseRow, baseRow + 1, baseRow].toString()) {
              //hitting the down pointing T shape to transform to the left pointing T shape
              currentCols = [baseCol, baseCol + 1, baseCol + 1, baseCol + 1];
              currentRows = [baseRow, baseRow - 1, baseRow, baseRow + 1];
            }
            else if (currentCols.toString() === [baseCol, baseCol + 1,baseCol + 1,baseCol + 1].toString() && currentRows.toString() === [baseRow, baseRow - 1, baseRow, baseRow + 1].toString()) {
              //hitting the left pointing T shape to transform to the up pointing T shape
              currentCols = [baseCol, baseCol + 1, baseCol + 1, baseCol + 2];
              currentRows = [baseRow, baseRow - 1, baseRow, baseRow];
            }
            else if (currentCols.toString() === [baseCol, baseCol + 1, baseCol + 1, baseCol + 2].toString() && currentRows.toString() === [baseRow, baseRow - 1, baseRow, baseRow].toString()) {
              //hitting the up pointing T shape to transform to the right pointing T shape
              currentCols = [baseCol + 1, baseCol + 1, baseCol + 1, baseCol + 2];
              currentRows = [baseRow - 1, baseRow, baseRow + 1, baseRow];
            }
            else if ( currentCols.toString() === [baseCol, baseCol, baseCol + 1, baseCol + 1].toString() && currentRows.toString()=== [baseRow, baseRow + 1, baseRow, baseRow + 1].toString()) {
              //hitting the square shape!
            }
            else if (currentCols.toString() === [baseCol, baseCol + 1, baseCol + 1, baseCol + 2].toString() && currentRows.toString() === [baseRow, baseRow, baseRow + 1, baseRow + 1].toString()) {
              //hitting the regular z shape to transform to up facing z shape
              currentCols = [baseCol, baseCol, baseCol + 1, baseCol + 1];
              currentRows = [baseRow, baseRow + 1, baseRow - 1, baseRow];
            }
            else if (currentCols.toString() === [baseCol, baseCol, baseCol + 1, baseCol + 1].toString() && currentRows.toString() === [baseRow, baseRow + 1, baseRow - 1, baseRow].toString()) {
              //hitting the up facing z shape to transform to the regular z shape
              currentCols = [baseCol, baseCol + 1, baseCol + 1, baseCol + 2];
              currentRows = [baseRow, baseRow, baseRow + 1, baseRow + 1];
            }
            else if (currentCols.toString() === [baseCol, baseCol, baseCol + 1, baseCol + 2].toString() && currentRows.toString() === [baseRow, baseRow + 1, baseRow, baseRow].toString()) {
              //hitting the down facing L shape transform to upside down L shape
              currentCols = [baseCol, baseCol + 1, baseCol + 1, baseCol + 1];
              currentRows = [baseRow - 1, baseRow - 1, baseRow, baseRow + 1];
            }
            else if (currentCols[0] === currentCols[1] && currentCols[2] === currentCols[3] && currentCols[0] != currentCols[2]) {
              //up facing S shape
              currentCols.shift();
              currentCols.push(currentCols.slice(-1)[0] + 1);
              currentRows[0] = currentRows[0] + 2;
              currentRows[2] = currentRows[2] + 1;
              currentRows[3] = currentRows[3] - 1;
            }
            else if (currentCols.toString() === [baseCol, baseCol + 1, baseCol + 1, baseCol + 1].toString() && currentRows.toString() === [baseRow, baseRow, baseRow + 1, baseRow + 2].toString()) {
              //hitting the upside down facing L shape transform to flat L shape
              currentCols = [baseCol, baseCol + 1, baseCol + 2, baseCol + 2];
              currentRows = [baseRow + 2, baseRow + 2, baseRow + 1, baseRow + 2];
            }
            else if (currentCols.toString() === [baseCol, baseCol + 1, baseCol + 2, baseCol + 2].toString() && currentRows.toString() === [baseRow, baseRow, baseRow - 1, baseRow].toString() ) {
              //hitting the flat L shape to transform into regular L shape
              currentCols = [baseCol + 1, baseCol + 1, baseCol + 1, baseCol + 2];
              currentRows = [baseRow - 2, baseRow - 1, baseRow, baseRow];
            }
            else if (currentCols[3] - currentCols[0] === 2 && currentCols[1] === currentCols[2] && currentRows[0] === currentRows[2]) {
              //horizontal S shape --- doing the opposite of the up facing S shape
              currentCols.unshift(currentCols[0]);
              currentCols.pop();
              currentRows[0] = currentRows[0] - 2;
              currentRows[2] = currentRows[2] - 1;
              currentRows[3] = currentRows[3] + 1;
            }
            else if ( currentCols.slice(1,5).every( (col) => {return col === currentCols[1] && col != currentCols[0];}) && currentRows[1] > currentRows[2]) {
              //upside down L shape to transform into flat L shape
              currentCols[2] = currentCols[2] + 1;
              currentCols[3] = currentCols[3] + 1;
              currentRows[0] = currentRows[0] + 2;
              currentRows[1] = currentRows[1] + 2;
            }
            else if (currentCols[0] + 2 === currentCols[2] && currentRows.slice(0,3).every( (row) => { return row != currentRows[3];})){
              //down facing j shape to regular j shape
              currentCols[2] = currentCols[2] - 1;
              currentCols[3] = currentCols[3] - 1;
              currentRows[0] = currentRows[0] + 1;
              currentRows[1] = currentRows[1] - 1;
            }
            else if (currentCols[2] === currentCols[3] && currentCols[1] > currentCols[0] && currentRows[1] + 1 === currentRows[3]) {
              //flat L shape to transform into regular L shape
              currentCols[0] = currentCols[0] + 1;
              currentCols[2] = currentCols[2] - 1;
              currentRows[0] = currentRows[0] - 2;
              currentRows[1] = currentRows[1] - 1;
              currentRows[2] = currentRows[2] + 1;
            }
            else if (currentCols.slice(0,3).every( (col) => { return col < currentCols[3];}) && currentRows[0] + 2 === currentRows[3] ) {
              //regular L shape to transform into down facing flat L shape
              currentCols[0] = currentCols[0] - 1;
              currentCols[1] = currentCols[1] - 1;
              currentRows[0] = currentRows[0] + 1;
              currentRows[1] = currentRows[1] + 1;
              currentRows[2] = currentRows[2] - 1;
              currentRows[3] = currentRows[3] - 1;

            }
            else if (currentCols.slice(1,4).every( (col) => { return col != currentCols[0];}) && currentRows[1] + 1 === currentRows[2] && currentRows[0] === currentRows[3]) {
              //regular j shape transform to flat j shape
              currentCols[1] = currentCols[1] - 1;
              currentCols[3] = currentCols[3] + 1;
              currentRows[0] = currentRows[0] - 1;
              currentRows[1] = currentRows[1] + 2;
              currentRows[2] = currentRows[2] + 1;
            }
            else if (currentCols[0] === currentCols[1] && currentCols[2] + 1 === currentCols[3] && currentRows.slice(1,4).every( (row) => { return row != currentRows[0];})) {
              currentCols[2] = currentCols[2] - 1;
              currentCols[3] = currentCols[3] - 1;
              currentRows[0] = currentRows[0] - 1;
              currentRows[1] = currentRows[1] - 1;
              currentRows[3] = currentRows[3] - 2;
            }
            else if (currentRows[2] - 2 === currentRows[3] && currentCols.slice(0,3).every((col) => { return col != currentCols[3];})) {
              //upside down j shape to flat down facing j shape
              currentCols[1] = currentCols[1] + 1;
              currentCols[2] = currentCols[2] + 2;
              currentCols[3] = currentCols[3] + 1;
              currentRows[0] = currentRows[0] + 1;
              currentRows[2] = currentRows[2] - 1;
              currentRows[3] = currentRows[3] + 2;
            }
            //wallkicks
            while (currentCols.some((el) => {return el + xShift > 11;})) {
              currentCols = currentCols.map((col) => {return col - 1;});
            }
            //wallkicks
            while (currentCols.some((el) => {return el + xShift < 0;})) {
              currentCols = currentCols.map((col) => {return col + 1;});
            }
            //bottom row kicks
            while (!currentRows.every((el) => {return el < 24;})) {
              currentRows = currentRows.map((row) => {return row - 1;});
            }

            //piece kicks
            while (kicksRight(currentCols, currentRows)) {
              currentCols = currentCols.map((col) => {return col - 1;});
            }
            break;
          default :
            console.log('wrong key');
        }
      });
