const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
  res.render('index', {header: 'ManytoMany with CallBack-ORM-MVC-Promise'});
});

module.exports = router;
