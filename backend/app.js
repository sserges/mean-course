const express = require('express');

const app = express();

app.use((req, res, next) => {
  const posts = [
    {
      id: "fadf124211",
      title: "First server-side post",
      content: "This is coming from the server"
    },
    {
      id: "fdcfrgeed",
      title: "Second server-side post",
      content: "This is coming from the server!"
    },
  ];

  return res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});

module.exports = app;
