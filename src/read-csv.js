import fs from "node:fs";
import { parse } from "csv-parse";

const __dirname = new URL(".", import.meta.url).pathname;
const fileName = "example.csv";
const filePath = `${__dirname}${fileName}`;

async function processCsvFile() {
  const parser = fs.createReadStream(filePath).pipe(parse());
  let isFirstLine = true;

  for await (const record of parser) {
    if (!isFirstLine) {
      const task = {
        title: record[0],
        description: record[1],
      };

      await fetch("http://localhost:3333/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
    } else {
      isFirstLine = false;
    }
  }
}

function getCsvContent() {
  let csv = "title,description\n";

  for (let i = 1; i <= 10; i++) {
    csv += `Task ${i},Descrição da Task ${i.toString().padStart(2, "0")}\n`;
  }

  return csv;
}

async function createCsvFile() {
  fs.access(filePath, async (accessError) => {
    if (accessError) {
      fs.writeFile(filePath, getCsvContent(), async (createError) => {
        if (createError) {
          return;
        } else {
          await processCsvFile();
        }
      });
    } else {
      await processCsvFile();
    }
  });
}

(async () => {
  await createCsvFile();
})();
