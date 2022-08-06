//spell const correctly
//spell variables correctly

const router=require('express').Router();
const{
    getAllThought,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    DeleteReaction
}=require('../../controllers/thought-controller');

router
    .route('/')
    .get(getAllThought)
    .post(createThought);

router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

router 
    .route('/:thoughtId/reactions')
    .post(createReaction);

router  
    .route('/:thoughtId/reactions/:reactionsId')
    .delete(DeleteReaction);

module.exports=router;