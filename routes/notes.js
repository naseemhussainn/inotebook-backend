const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');


//fetch notes from bd using GET: /api/notes/fetch-all-notes
router.get('/fetch-all-notes',fetchuser,async (req , res)=>{
    try {
        const user = req.user;
        const notesOfUser = await Notes.find({user:user});
        res.json(notesOfUser)
    } catch (error) {
      return res.status(500).json({ errors: 'internal server error occured' }); 
    }

})

//add notes from bd using post: /api/notes/add-notes
router.post('/add-notes',fetchuser,[
    body('title','eneter a valid title min:3').isLength({ min: 3 }),
    body('description','enter a valid description min:5').isLength({ min: 5 }),
],async (req , res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = req.user;
    
        var {title,description,tag} = req.body;
        const notes = await Notes.create({
            user: user,
            title: title,
            description: description,
            tag:tag
        });
        res.json(notes)
    } catch (error) {
      return res.status(500).json({ errors: 'internal server error occured' });
    }

})

//update notes from bd using put: /api/notes/update-notes
router.put('/update-notes/:id',fetchuser,[
    body('title','eneter a valid title min:3').optional().isLength({ min: 3 }),
    body('description','enter a valid description min:5').optional().isLength({ min: 5 }),
],async (req , res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        let newNote = {}
        let {title,description,tag} = req.body;
    
        if(title){newNote.title = title }
        if(description){newNote.description = description }
        if(tag){newNote.tag = tag }
        var user = req.user;
    
        let note = await Notes.findById(req.params.id);
        if(note.user.toString() !== user){ res.status(401).send('invalid request')}
        var options = {
            "returnDocument":"after"
        }
        let updatedNotes = await Notes.findByIdAndUpdate(req.params.id,newNote,options);
        res.json(updatedNotes)
    } catch (error) {
        return res.status(500).json({ errors: 'internal server error occured' });
    }


})

//update notes from bd using delete: /api/notes/delete-notes
router.delete('/delete-notes/:id',fetchuser,async (req , res)=>{

    try {
        var user = req.user;
    
        let note = await Notes.findById(req.params.id);
        if(!note){res.status(401).send('invalid request')}
        if(note.user.toString() !== user){ res.status(401).send('invalid request')}

        let deletedNotes = await Notes.findByIdAndDelete(req.params.id);
        res.json(deletedNotes) 
    } catch (error) {
        return res.status(500).json({ errors: 'internal server error occured' });
    }


})

module.exports = router