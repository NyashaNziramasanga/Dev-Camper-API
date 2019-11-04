const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Show all Bootcamps' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ success: true, message: `Show Bootcamps ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.status(201).json({ success: true, message: 'Create new bootcamp' });
});

router.put('/:id', (req, res) => {
  res.status(201).json({ success: true, message: `Update Bootcamps ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ success: true, message: `Delete Bootcamps ${req.params.id}` });
});

module.exports = router;
