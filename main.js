// const prompt = require("prompt-sync")({ sigint: true });
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
const mapNum = 20;
const lineNum = 15;
class Field {
  constructor(lines) {
    this.lines = lines;
    this.playerPos = { x: 0, y: 0 };
    this.currentState = [];
    this.finish = false;
    this.direction = "";
    this.continue = false;
    this.maxX = lines[0].length;
    this.maxY = lines.length;
    // this.count = count;
  }

  clamp(num, max) {
    return num <= 0 ? 0 : num >= max ? max : num;
  }

  print() {
    const { x, y } = this.playerPos;

    let newLines = this.lines.map((e, id) => {
      return e.map((el, idx) => {
        if (el === hat || el === hole) {
          if (this.continue) {
            this.continue = false;
            return pathCharacter;
          }
          return el;
        }
        return idx === x && y === id ? pathCharacter : fieldCharacter;
      });
    });

    // console.log("new line", newLines);
    process.stdout.write("\n");
    newLines.forEach(line => {
      process.stdout.write("\n" + line.join(""));
    });
    this.lines = newLines;
  }
  play() {
    if (this.finish) return;
    // while()
    this.print();
    this.prompt();
    process.stdin.on("data", input => {
      if (input !== "") {
        const dir = input.toString();
        this.direction = dir;
        this.move();
      }
    });
  }
  checkMove({ x, y }) {
    const item = this.lines.find((e, id) => id === y).find((e, id) => id === x);
    if (item === fieldCharacter || item === pathCharacter) {
      return true;
    } else if (item === hole) {
      let change = Math.floor(Math.random() * 100);
      if (change <= 50) {
        process.stdout.write("\n you fall into hole ! game over. ");
        process.exit();
      } else {
        this.continue = true;
        return true;
      }
    } else if (item === hat) {
      process.stdout.write("\n hat found! you win. ");
      process.exit();
    }
  }
  move() {
    let newPos = {};
    const { x, y } = this.playerPos;
    let canMove;
    switch (this.direction) {
      case "a":
        newPos = { x: this.clamp(x - 1, this.maxX), y: y };
        canMove = this.checkMove({ ...newPos });

        break;
      case "d":
        newPos = { x: this.clamp(x + 1, this.maxX), y: y };
        canMove = this.checkMove({ ...newPos });

        break;
      case "s":
        newPos = { x: x, y: this.clamp(y + 1, this.maxY) };
        canMove = this.checkMove({ ...newPos });

        break;
      case "w":
        newPos = { x: x, y: this.clamp(y - 1, this.maxY) };
        canMove = this.checkMove({ ...newPos });

        break;

      default:
        newPos = this.playerPos;

        process.stdout.write("Please choose correct direction w,a,s,d");
    }

    if (canMove) {
      this.playerPos = newPos;

      this.print();
    }

    // console.log(this.playerPos);
  }

  prompt() {
    process.stdout.write("\n which direction you want to go ? w,a,s,d : ");
  }
}

const generateLines = () => {
  let result = [];
  let randId = Math.floor(Math.random() * (mapNum - 1));
  for (let index = 0; index < lineNum; index++) {
    let line;
    line = Array.from({ length: mapNum }, (e, id) => {
      let rand = Math.floor(Math.random() * 100);
      if (index === lineNum - 2) {
        if (id === randId) return hat;
      } else if (index === 0) {
        if (id === 0) {
          return pathCharacter;
        }
      }
      if (rand < 100 && rand > 60) return fieldCharacter;
      if (rand < 30) return hole;
    });

    result.push(line);
  }

  return result;
};
const lines = generateLines();
const field = new Field([...lines]);
// const field = new Field(3);
field.play();
