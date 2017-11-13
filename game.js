
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
      var anchorCol = 0;
      const colors = ["#F7DC6F","#2471A3", "#2ECC71", "#EB984E", "#AF7AC5", "#D5DBDB", "#784212"];
      var currentColor = "#F7DC6F";
      //in block positions, xPos key points to an array of yPos's
      const blockPositions = {0: [25], 1: [25],  2: [25], 3: [25], 4: [25], 5: [25], 6: [25], 7: [25], 8: [25], 9:[25], 10: [25], 11: [25]};

      sinkBlocks = (delay, cols,  rows, color) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(score, canvas.width/2, canvas.height/2);
        currentCols = cols;
        currentRows = rows;
        //checks if any of the blocks touch the stacked blocks
          cols.forEach( (col, idx) => {
            if (blockPositions[col + xShift].slice(-1)[0] === rows[idx] + 1) {
              toggle =  true;
            }
          });

          //creates new block if current block gets stacked
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
          console.log(rowHolder);
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
            switch (Math.floor(Math.random() * 2)) {

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
            }
          }

          toggle = false;
          xShift = 0;


          currentColor = colors[Math.floor(Math.random() * colors.length)];
          return sinkBlocks(200, cols, rows, currentColor);
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
          setTimeout( () => {
            sinkBlocks(delay, currentCols, currentRows.map((row) => { return row + 1;}))
          }, delay);



      };

      document.addEventListener('DOMContentLoaded', () => {
        sinkBlocks(200, cols, rows, currentColor);
      });


      //key movements
      document.addEventListener('keypress', (e) => {
        switch(e.key) {
          case "d" :
            if (currentCols.every((currentCol) => {
              return currentCol + xShift < 11;
              // && blockPositions[currentCol + xShift + 1].every( (row) => {return row != currentRows[idx] })
            })) {
              console.log("d pressed!");
              xShift = xShift + 1;
            }
            break
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
            if (currentRows.every((row) => {return row === currentRows[0]}) && currentCols.slice(1,5).every((col) => {return col != currentCols[0];})) {
              //special case for flat I bar
              //make all the columns the same to keep it vertical, make rows increment
              for (let i=0; i < 4; i++) {
                currentCols[i] = currentCols[0];
                currentRows[i] = currentRows[0] + i;
              }
            }
            else if (currentCols[0] === currentCols[1] && currentCols[2] === currentCols[3] && currentCols[0] != currentCols[2]) {
              //up facing S shape
                console.log('hitting here 1')
              currentCols.shift();
              currentCols.push(currentCols.slice(-1)[0] + 1);
              currentRows[0] = currentRows[0] + 2;
              currentRows[2] = currentRows[2] + 1;
              currentRows[3] = currentRows[3] - 1;
            }
            else if ( currentRows.slice(1,5).every((row) => {return row != currentRows[0];}) &&  currentCols.every((col) => {return col === currentCols[0]})) {
              //special case for vertical I bar

              for (let i=0; i < 4; i++) {
                currentRows[i] = currentRows[0];
                currentCols[i] = currentCols[0] + i;
              }
            }
            else if (currentCols[3] - currentCols[0] === 2 && currentCols[1] === currentCols[2] && currentRows[0] === currentRows[2]) {
              //horizontal S shape --- doing the opposite of the up facing S shape
                console.log('hitting here 2')
              currentCols.unshift(currentCols[0]);
              currentCols.pop();
              currentRows[0] = currentRows[0] - 2;
              currentRows[2] = currentRows[2] - 1;
              currentRows[3] = currentRows[3] + 1;
            }
            else if ( currentCols.slice(1,5).every( (col) => {return col === currentCols[1] && col != currentCols[0];}) && currentRows[1] > currentRows[2]) {
              //upside down L shape to transform into flat L shape
              console.log('hitting here 3')
              currentCols[2] = currentCols[2] + 1;
              currentCols[3] = currentCols[3] + 1;
              currentRows[0] = currentRows[0] + 2;
              currentRows[1] = currentRows[1] + 2;
            }
            else if (currentCols[0] + 2 === currentCols[2] && currentRows.slice(0,3).every( (row) => { return row != currentRows[3]})){
              //down facing j shape to regular j shape
              console.log('hitting here')
              currentCols[2] = currentCols[2] - 1;
              currentCols[3] = currentCols[3] - 1;
              currentRows[0] = currentRows[0] + 1;
              currentRows[1] = currentRows[1] - 1;
            }
            else if (currentCols[2] === currentCols[3] && currentCols[1] > currentCols[0]) {
              //flat L shape to transform into regular L shape
                console.log('hitting here 4')
              currentCols[0] = currentCols[0] + 1;
              currentCols[2] = currentCols[2] - 1;
              currentRows[0] = currentRows[0] - 2;
              currentRows[1] = currentRows[1] - 1;
              currentRows[2] = currentRows[2] + 1;
            }
            else if (currentCols.slice(0,4).every( (col) => { return col != currentCols[3];}) ) {
              //regular L shape to transform into down facing flat L shape
                console.log('hitting here 5')
              currentCols[0] = currentCols[0] - 1;
              currentCols[1] = currentCols[1] - 1;
              currentRows[0] = currentRows[0] + 1;
              currentRows[1] = currentRows[1] + 1;
              currentRows[2] = currentRows[2] - 1;
              currentRows[3] = currentRows[3] - 1;

            }
            else if (currentCols.slice(1,4).every( (col) => { return col != currentCols[0];}) && currentRows[1] + 1 === currentRows[2] && currentRows[0] === currentRows[3]) {
              //regular j shape transform to flat j shape
                console.log('hitting here 6')
              currentCols[1] = currentCols[1] - 1;
              currentCols[3] = currentCols[3] + 1;
              currentRows[0] = currentRows[0] - 1;
              currentRows[1] = currentRows[1] + 2;
              currentRows[2] = currentRows[2] + 1;
            }
            else if (currentCols[0] === currentCols[1] && currentCols[2] + 1 === currentCols[3] && currentRows.slice(1,4).every( (row) => { return row != currentRows[0];})) {
                console.log('hitting here 7')
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
            break;
          default :
            console.log('wrong key');
        }
      });
