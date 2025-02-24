const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models/Index');


// Get all the tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product}],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve tags', error: err.message});
  }
});

// Get a tag by ID
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!tagData) {
      return res.status(404).json({ message: 'No tag foind with this ID'});
    }
    
    res.status(200).json(tagData);
  } catch (err){
    res.status(500).json({ message: 'Failed to retrieve tag', error: err.message});
  }
});

// Post a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json({ message: 'Invalid tag data', error: err.message});
  }
});

// Put update tag
router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updatedTag = await Tag.update(req.body, {
      where: {id: req.params.id},
    });
    if(!updatedTag[0]) {
      return res.status(404).json({ message: 'No tag found with this ID'});
    }

    res.status(200).json({ message: 'Tag updated successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update tag data', error: err.message});
  }
});


// Delete a tag
router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deletedTag = await Tag.destroy({
      where: {id: req.params.id},
    });

    if (!deletedTag) {
      return res.status(404).json({ message: 'No tag found with this ID'});
    }

    res.status(200).json({ message: 'Tag deleted successfully'});
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete tag', error: err.message});
  }
});

module.exports = router;