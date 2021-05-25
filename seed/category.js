'use strict';

const Category = require('../models/category');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shada');

const categories = [
    new Category({
        _id: "5deaf37fbc842d3b2b6f1768",
        imagePath: "aguagas.jpg",
        name: "Agua y Gas",
        description:"Artículos de Agua y Gas"
    }),
      new Category({
        _id: "5deaf37fbc842d3b2b6f1769",
        imagePath: "cabezales.jpg",
        name: "Cabezales y Accesorios",
        description:"Artículos Cabezales y Accesorio"
    }),
        new Category({
        _id: "5deaf37fbc842d3b2b6f176a",
        imagePath: "bronce.jpg",
        name: "Accesorios de Bronce",
        description:"Artículos de Bronce"
    }),
        new Category({
        _id:"5deaf37fbc842d3b2b6f176b",
        imagePath: "gas.jpg",
        name: "Repuestos Artefactos de Gas",
        description:"Gas"
   }),
    new Category({
        _id:"5deaf37fbc842d3b2b6f176c",
        imagePath: "perillas.jpg",
        name: "Perillas",
        description:"perillas"
    }),
    new Category({
        _id:"5deaf37fbc842d3b2b6f176d",
        imagePath: "diafragma.jpg",
        name: "Diafragmas de Calefón",
        description:"Calefón"
    }),
    new Category({
        _id:"5deaf37fbc842d3b2b6f176e",
        imagePath: "hogar.jpg",
        name: "Hogar y Camping",
        description:"Hogar y Camping"
    }),
    new Category({
        _id:"5deaf37fbc842d3b2b6f176f",
        imagePath: "riego.jpg",
        name: "Artículos de Riego",
        description:"riego"
    })
    
    
    ]

let done = 0;

for (let i = 0; i < categories.length; i++) {
    categories[i].save((err, result) => {
        done++;
        if (done === categories.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
