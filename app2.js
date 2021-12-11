const express = require("express");
const pool = require("./database");
const cors = require("cors");
const { pull } = require("lodash");
const app = express();
// register the ejs view engine
app.set("view engine", "ejs");
//without this middleware, we cannot use data submitted by forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static("Public"));
app.listen(3000, () => {
    console.log("Server is listening to port 3000");
});
app.get("/", async(req, res) => {
    try {
        console.log("get posts request has arrived");
        const posts = await pool.query("SELECT * FROM posts");
        res.render("posts", { posts: posts.rows });
    } catch (err) {
        console.error(err.message);
    }
});
app.get("/posts", async(req, res) => {
    try {
        console.log("get posts request has arrived");
        const posts = await pool.query("SELECT * FROM posts");
        res.render("posts", { posts: posts.rows });
    } catch (err) {
        console.error(err.message);
    }
});
app.get("/singlepost/:id", async(req, res) => {
    try {
        const id = req.params.id;
        console.log(req.params.id);
        console.log("get a single post request has arrived");
        const posts = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
        res.render("singlepost", { posts: posts.rows[0] });
    } catch (err) {
        console.error(err.message);
    }
});
app.get("/posts/:id", async(req, res) => {
    try {
        const { id } = req.params;
        console.log("get a post request has arrived");
        const Apost = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
        res.json(Apost.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});
app.delete("/posts/:id", async(req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const post = req.body;
        console.log("delete a post request has arrived");
        const deletepost = await pool.query("DELETE FROM posts WHERE id = $1", [
            id,
        ]);
        res.redirect("posts");
    } catch (err) {
        console.error(err.message);
    }
});
app.post("/posts", async(req, res) => {
    try {
        const post = req.body;
        console.log(post);
        const newpost = await pool.query(
            "INSERT INTO posts(title, body) values ($1, $2) RETURNING*", [post.title, post.body]
        );
        res.redirect("posts");
    } catch (err) {
        console.error(err.message);
    }
});
app.get("/create", (req, res) => {
    res.render("create");
});

app.get("/contactus", (req, res) => {
    res.render("contactus");
});

app.post("/posts/:id/like", async(req, res) => {
    try {
        const post = await pool.query("SELECT likes FROM POSTS WHERE id = $1", [
            req.params.id,
        ]);
        const likes = post.rows[0].likes;
        const updatedPost = await pool.query(
            "UPDATE POSTS SET likes = $1 WHERE id = $2", [likes + 1, req.params.id]
        );
        res.json({ message: "ok" });
    } catch (err) {
        res.status(500).json({ error: "Error incrementing likes" });
        console.error(err.message);
    }
});
app.use((req, res) => {
    res.status(404).render("404");
});