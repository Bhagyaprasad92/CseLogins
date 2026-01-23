const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let b = mongoose.connect("mongodb://localhost:27017/CseDevops");
b.then(() => {
    console.log(`Connection successful to db!`);
});
b.catch(() => {
    console.log("Connection failed!");
});

let loginSchema = new mongoose.Schema(
    {
        user: String,
        password: String,
    },
    { versionkey: false },
);

let loginModel = new mongoose.model("cseCrypt", loginSchema, "cseLogin");

app.get("/", (req, res) => {
    res.send("DB");
});

app.post("/register", async (req, res) => {
    try {
        const { user, password } = req.body;
        const hashpass = await bcrypt.hash(password, 12);

        let newUser = new loginModel({
            user,
            password: hashpass,
        });

        await newUser.save();
        res.status(201).send("User registered successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error Occured!");
    }
});

app.post("/login", async (req, res) => {
    try {
        let { user, password } = req.body;
        const user1 = await loginModel.findOne({ user });
        if (!user1) {
            return res.status(404).send("user not found!");
        }

        const passMatched = await bcrypt.compare(password, user1.password);
        if (passMatched) {
            res.status(200).send("Welcome User!");
        } else {
            res.status(401).send("Invalid credentials!");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("error occured at /login");
    }
});

app.listen(4000, () => {
    console.log(`Server running successfully!`);
});
