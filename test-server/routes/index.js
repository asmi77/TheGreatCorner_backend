var express = require('express');
var router = express.Router();
var Prod = require('../models/prod');

router.get('/', function(req, res, next) {
  res.send('Hello, World!');
});

// *** api routes *** //
router.get('/prod', findAllProd);
router.get('/prod/:id', findProdById);
router.post('/prod', addProd);
router.put('/prod/:id', updateProd);
router.delete('/prod/:id', deleteProd);


// *** get ALL products *** //
function findAllProd(req, res) {
  Prod.find(function(err, prods) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      res.json(prods);
    }
  });
}

// *** get SINGLE products *** //
function findProdById(req, res) {
  Prod.findById(req.params.id, function(err, prods) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      res.json(prods);
    }
  });
}

// *** post ALL products *** //
function addProd(req, res) {
  var newProd = new Prod({
    name: req.body.name,
  });
  newProd.save(function(err) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      res.json({'SUCCESS': newProd});
    }
  });
}

// *** put SINGLE product *** //
function updateProd(req, res) {
  Prod.findById(req.params.id, function(err, prod) {
    prod.name = req.body.name;
    prod.save(function(err) {
      if(err) {
        res.json({'ERROR': err});
      } else {
        res.json({'UPDATED': prod});
      }
    });
  });
}

// *** delete SINGLE product *** //
function deleteProd(req, res) {
  Prod.findById(req.params.id, function(err, prod) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      prod.remove(function(err){
        if(err) {
          res.json({'ERROR': err});
        } else {
          res.json({'REMOVED': prod});
        }
      });
    }
  });
}

module.exports = router;
