const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isloggedin } = require('../lib/auth');

router.get('/add', isloggedin, (req, res) => {
    res.render('links/add');
});

router.post('/add', isloggedin, async(req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link saved successfully');
    res.redirect('/links');
});

router.get('/', isloggedin, async(req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});

router.get('/delete/:id', isloggedin, async(req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Link removed successfully');
    res.redirect('/links');
});

router.get('/edit/:id', isloggedin, async(req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links[0])
    res.render('links/edit', { link: links[0] });
});

router.post('/edit/:id', isloggedin, async(req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool.query('UPDATE links set ? WHERE id=?', [newLink, id]);
    req.flash('success', 'Link updated successfully');
    res.redirect('/links');
});



module.exports = router;