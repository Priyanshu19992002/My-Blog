const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/cblog', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MONGO CONNECTED!!");
})
    .catch((err) => {
        console.log("ERROR !! MONGO CONNECTION ERROR !!");
        console.log(err);
    })


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const commentSchema = new mongoose.Schema({
    title: String,
    image: { type: String, default: 'defaultimg.jpg' },
    description: String,
    created: { type: Date, default: Date.now },
    author: String
});

const blogs = mongoose.model('blogs', commentSchema);

app.get('/', (req, res) => {
    res.redirect('/blog');
})

app.get('/blog', async (req, res) => {
    const items = await blogs.find({});
    res.render('index', { items });
})

app.get('/blog/new', (req, res) => {
    res.render('new');
})

app.post('/blog', async (req, res) => {
    const newBlog = new blogs(req.body);
    await newBlog.save();
    res.redirect('/blog');
})

app.get('/blog/:id', async (req, res) => {
    const { id } = req.params;
    const blog = await blogs.findById(id);
    res.render('show', { blog });
})

app.get('/blog/:id/edit', async (req, res) => {
    const { id } = req.params;
    const blog = await blogs.findById(id);
    res.render('edit', { blog });
})

app.put('/blog/:id', async (req, res) => {
    const { id } = req.params;
    const updatedBlog = await blogs.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/blog/${updatedBlog._id}`);
})

app.delete('/blog/:id', async (req, res) => {
    const { id } = req.params;
    const deletedblog = await blogs.findByIdAndDelete(id);
    res.redirect('/blog');
})


app.listen(3000, () => {
    console.log("Server Working at 3000!!");
})