const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

require("./db/mongoose"); // insures that the file runs and so db is connected
const User = require("./models/user");
const Task = require("./models/task");
app.use(express.json()); // automatically parses json into objects so we can use them

app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      console.log("User Added");
      res.status(201).send(user);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.get("/users", (req, res) => {
  User.find({}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(data);
  });
});
app.get("/users/:id", (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).send(data);
  });
});
app.patch("/users/:id", (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((item) => allowedUpdates.includes(item));
  if (!isValidUpdate) return res.status(400).send("invalid update");
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { runValidators: true, new: true },
    (err, data) => {
      if (err) {
        return res.status(400).send(err);
      }
      if (!data) {
        return res.status(404).send("User Not Found");
      }
      res.send(data);
    }
  );
});
app.delete("tasks/:id", (req, res) => {
  Task.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!data) {
      return res.status(404).send("User Not Found");
    }
    res.send(data);
  });
});

app.delete("users/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!data) {
      return res.status(404).send("User Not Found");
    }
    res.send(data);
  });
});

// ---------------------------------------------------------------------------------------------------

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.get("/tasks", (req, res) => {
  Task.find({}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(data);
  });
});

app.get("/tasks/:id", (req, res) => {
  Task.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(data);
  });
});

app.patch("/tasks/:id", (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((item) => allowedUpdates.includes(item));
  if (!isValidUpdate) return res.status(400).send("invalid update");
  Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { runValidators: true, new: true },
    (err, data) => {
      if (err) {
        return res.status(400).send(err);
      }
      if (!data) {
        return res.status(404).send("Task Not Found");
      }
      res.send(data);
    }
  );
});
app.delete("tasks/:id", (req, res) => {
  Task.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!data) {
      return res.status(404).send("Task Not Found");
    }
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
