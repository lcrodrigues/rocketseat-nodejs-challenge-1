import { randomUUID } from "crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { Database } from "./database.js";

const database = new Database();
const tableName = "tasks";

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: async (_, res) => {
      const tasks = database.select(tableName);
      return res.end(JSON.stringify(tasks));
    },
  },

  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const { title, description } = req.body ?? {};

      if (title && description) {
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
      } else {
        return res.writeHead(400).end();
      }
    },
  },

  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params ?? {};
      const { title, description } = req.body ?? {};
      const itemExists = database.itemExists(tableName, id);

      if (!itemExists) {
        return res.writeHead(404).end("Task not found!");
      }

      if (title || description) {
        let updatedTask = {
          updated_at: Date.now(),
        };

        if (title) {
          updatedTask = { ...updatedTask, title };
        }

        if (description) {
          updatedTask = { ...updatedTask, description };
        }

        database.update(tableName, id, updatedTask);
        return res.writeHead(204).end();
      } else {
        return res.writeHead(400).end();
      }
    },
  },

  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;
      const itemExists = database.itemExists(tableName, id);

      if (!itemExists) {
        return res.writeHead(404).end("Task not found!");
      }

      database.delete(tableName, id);
      return res.writeHead(204).end();
    },
  },

  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: async (req, res) => {
      const { id } = req.params;
      const itemExists = database.itemExists(tableName, id);

      if (!itemExists) {
        return res.writeHead(404).end("Task not found!");
      }

      database.update(tableName, id, {
        completed_at: Date.now(),
        updated_at: Date.now(),
      });

      return res.writeHead(204).end();
    },
  },
];
