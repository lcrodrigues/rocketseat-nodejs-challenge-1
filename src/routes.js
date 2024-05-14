import { randomUUID } from "crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import path from "path";

let tasks = [];

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
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

      tasks.push(task);

      return res.writeHead(201).end();
    },
  },

  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;
      const index = tasks.findIndex((item) => item.id === id);

      if (index > -1) {
        const { title, description } = req.body;
        tasks[index] = {
          ...tasks[index],
          title,
          description,
          updated_at: Date.now(),
        };
      }

      return res.writeHead(204).end();
    },
  },

  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;
      const index = tasks.findIndex((item) => item.id === id);

      if (index > -1) {
        tasks.splice(index, 1);
      }

      return res.writeHead(204).end();
    },
  },

  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: async (req, res) => {
      const { id } = req.params;
      const index = tasks.findIndex((item) => item.id === id);

      if (index > -1) {
        tasks[index].completed_at = Date.now();
        tasks[index].updated_at = Date.now();
      }

      return res.writeHead(204).end();
    },
  },
];
