/**
 * Browser simulations of the interactive programs in
 * github.com/sagnikkhaze-lgtm/C-practice-fundamentals.
 * Prompts and output text follow the original C source.
 */

export type Session = {
  boot: () => string[];
  send: (line: string) => string[];
  isDone: () => boolean;
};

function makeTrivia(): Session {
  const qs = [
    "Which video game franchise  features a protagonist named Geralt of Riva?",
    "In the avengers(2012) what food do they eat together in the iconic post credit screen? ",
    "what is the primary funtional programming language used to build the core infrastructure of whatsapp? ",
    "which layer of atmosphere lies directly above the troposphere ?",
    "which mountain range seperates europe from asia?",
  ];
  const optn = [
    "A.Elder Scrolls\nB.Dark souls\nC.The witcher\nD.Dragon Age",
    "A.Tacos\nB.Shawarma\nC.Pizza\nD.Chees Burgers",
    "A.Erlang\nB.Rust\nC.C++\nD.Go",
    "A.Mesosphere\nB.Stratosphere\nC.Thermosphere\nD.Exosphere",
    "A.the alps\nB.The Andes\nC.The Ural\nD.The Apalachian",
  ];
  const cg = ["C", "B", "A", "B", "C"];
  let i = 0;
  let score = 0;
  let done = false;

  const ask = () => ["", qs[i] ?? "", optn[i] ?? "", "Enter your Choice : "];

  return {
    boot: () => [
      "\t\t\t G U E S S I N G \t\t G A M E ",
      "RULE : Enter ONLY the OPTION NUMBER/CHARACTER NOT the Entire Option!!",
      "BEST OF LUCK ;) ",
      ...ask(),
    ],
    send: (line) => {
      if (done) return [];
      const ch = (line.trim()[0] ?? "").toUpperCase();
      const out = ch === cg[i] ? ["Damn! Correct :) "] : ["Uh oh! Wrong :( "];
      if (ch === cg[i]) score++;
      i++;
      if (i >= qs.length) {
        done = true;
        return [...out, `Your total Score is = ${score}`];
      }
      return [...out, ...ask()];
    },
    isDone: () => done,
  };
}

function makeGuess(): Session {
  const target = Math.floor(Math.random() * 51) + 50;
  let tries = 1;
  let done = false;
  return {
    boot: () => ["[target hidden for this run — original prints it for debugging]", "Enter your choice : "],
    send: (line) => {
      if (done) return [];
      const ch = Number.parseInt(line.trim(), 10);
      if (Number.isNaN(ch)) return ["Enter your choice : "];
      if (ch === target) {
        done = true;
        return ["good guess !", ` You guessed in ${tries} ties congrats !!!`];
      }
      const diff = Math.abs(ch - target);
      let msg: string;
      if (diff < 10) msg = "uh oh! wrong answer but u are close , try again.. ";
      else if (ch > target) msg = "uh oh! wrong answer ur guess is too high , try again.. ";
      else msg = "uh oh! wrong answer ur guess is too low , try again.. ";
      tries++;
      return [msg, "Enter your choice : "];
    },
    isDone: () => done,
  };
}

function makeMadlibs(): Session {
  const prompts = [
    "Enter a adjective (description) : ",
    "Enter a adjective (description) : ",
    "Enter a adjective (description) : ",
    "Enter a verb (action) : ",
    "Enter a verb (action) : ",
    "Enter a noun (person) : ",
  ];
  const words: string[] = [];
  let done = false;
  return {
    boot: () => [prompts[0] ?? ""],
    send: (line) => {
      if (done) return [];
      words.push(line.trim());
      if (words.length < prompts.length) return [prompts[words.length] ?? ""];
      done = true;
      const [adj1, adj2, adj3, vrb1, vrb2, n] = words;
      return [
        "",
        `today i saw ${n} he was ${vrb1} in a very ${adj1} way.`,
        `He was ${vrb2} in a ${adj2} way which ${adj3} us`,
      ];
    },
    isDone: () => done,
  };
}

function makeCalculator(): Session {
  const chart = [
    "\t\tC H A R T ",
    "1.         +  ",
    "2.         -  ",
    "3.         *  ",
    "4.         /  ",
    "Enter Your choice : ",
  ];
  let stage: "a" | "b" | "op" | "cont" = "a";
  let a = 0;
  let b = 0;
  let total = 0;
  let firstRun = true;
  let done = false;

  return {
    boot: () => ["Enter 1st number : "],
    send: (line) => {
      if (done) return [];
      const v = line.trim();
      if (stage === "a") {
        a = Number.parseFloat(v);
        if (firstRun) {
          stage = "b";
          return ["Enter 2nd number : "];
        }
        b = total;
        stage = "op";
        return chart;
      }
      if (stage === "b") {
        b = Number.parseFloat(v);
        stage = "op";
        return chart;
      }
      if (stage === "op") {
        const ch = Number.parseInt(v, 10);
        const out: string[] = [];
        switch (ch) {
          case 1:
            total = a + b;
            break;
          case 2:
            total = firstRun ? a - b : b - a;
            break;
          case 3:
            total = a * b;
            break;
          case 4: {
            const denom = firstRun ? b : a;
            if (denom === 0) out.push("NA.");
            else total = firstRun ? a / b : b / a;
            break;
          }
          default:
            out.push("wrong choice sir please try again");
        }
        firstRun = false;
        stage = "cont";
        return [...out, "Do u want to continue ? y/n : "];
      }
      // stage === "cont"
      if (v.toLowerCase().startsWith("y")) {
        stage = "a";
        return ["enter number : "];
      }
      done = true;
      return [`Your total is = ${total.toFixed(2)}`];
    },
    isDone: () => done,
  };
}

function makeMath(): Session {
  let done = false;
  return {
    boot: () => ["enter a number to see all math functions : "],
    send: (line) => {
      if (done) return [];
      const x = Number.parseFloat(line.trim());
      if (Number.isNaN(x)) return ["enter a number to see all math functions : "];
      done = true;
      const f = (n: number) => n.toFixed(2);
      return [
        `Square root  : ${f(Math.sqrt(x))}`,
        `Square   : ${f(Math.pow(x, 2))}`,
        `cube  : ${f(Math.pow(x, 3))}`,
        `absolute value   : ${f(Math.abs(x))}`,
        `floor (lower value)  : ${f(Math.floor(x))}`,
        `ceil (upper) value  : ${f(Math.ceil(x))}`,
        `Round off to nearest ${f(Math.round(x))}`,
      ];
    },
    isDone: () => done,
  };
}

export const runners: Record<string, () => Session> = {
  trivia: makeTrivia,
  guess: makeGuess,
  madlibs: makeMadlibs,
  calculator: makeCalculator,
  math: makeMath,
};
