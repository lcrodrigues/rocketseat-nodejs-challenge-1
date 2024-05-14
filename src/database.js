import fs from "node:fs/promises";

const databasePath = new URL("../tasks-db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  select(table) {
    let data = this.#database[table] ?? [];
    return data;
  }

  update(table, id, data) {
    const index = this.#database[table].findIndex((task) => task.id === id);

    if (index > -1) {
      const previousData = this.#database[table][index];
      this.#database[table][index] = {
        ...previousData,
        ...data,
      };

      this.#persist();
    }
  }

  delete(table, id) {
    const index = this.#database[table].findIndex((task) => task.id === id);

    if (index > -1) {
      this.#database[table].splice(index, 1);
      this.#persist();
    }
  }

  itemExists(table, id) {
    const index = this.#database[table].findIndex((task) => task.id === id);

    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }
}
