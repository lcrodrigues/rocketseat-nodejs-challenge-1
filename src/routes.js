import { randomUUID } from "crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";

// TODO: check for title and description in POST and PUT (for POST must have both and for PUT at least one to be a valid edition)
// TODO: add CSV

const database = new Database();
const tableName = "tasks";

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const tasks = database.select(tableName);
      return res.end(JSON.stringify(tasks));
    },
  },

  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      database.insert(tableName, task);
      return res.writeHead(201).end();
    },
  },

  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      const updatedTask = {
        title,
        description,
        updated_at: Date.now(),
      };

      database.update(tableName, id, updatedTask);

      return res.writeHead(204).end();
    },
  },

  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;
      database.delete(tableName, id);

      return res.writeHead(204).end();
    },
  },

  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: async (req, res) => {
      const { id } = req.params;
      database.update(tableName, id, {
        completed_at: Date.now(),
        updated_at: Date.now(),
      });

      return res.writeHead(204).end();
    },
  },
];
