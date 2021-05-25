'use strict';

const Category = require('../models/category');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shada');

const categories = [
    new Category({
        _id: "5f5d24f46699fa2c6420b4c7",
        imagePath: "",
        name: "articulos  gas",
        description: "articulos  gas"
    }),
    new Category({    
        _id: "5f5d2985b06dc83194ce665d",
        imagePath: "",
        name: "articulos de ferreteria",
        description: "articulos de ferreteria"    
    }),
    new Category({    
        _id: "5f5d2c18b06dc83194ce665e",
        imagePath: "",
        name: "articulos de instalacion",
        description: "articulos de instalacion"    
    }),
    new Category({    
        _id: "5f5d2e3eb06dc83194ce665f",
        imagePath: "",
        name: "articulos de riego",
        description: "articulos de riego"    
    }),
    new Category({    
        _id: "5f5d2fcab06dc83194ce6660",
        imagePath: "",
        name: "cabezales",
        description: "cabezales"    
    }),
    new Category({    
        _id: "5f5d3047b06dc83194ce6661",
        imagePath: "",
        name: "Canillas y valvulas",
        description: "Canillas y valvulas"
    }),
    new Category({    
        _id: "5f5d305eb06dc83194ce6662",
        imagePath: "",
        name: "gomas varias",
        description: "gomas varias"
    }),
    new Category({    
        _id: "5f5d307db06dc83194ce6663",
        imagePath: "",
        name: "griferias y repuestos",
        description: "griferias y repuestos"    
    }),
    new Category({    
        _id: "5f5d308cb06dc83194ce6664",
        imagePath: "",
        name: "hogar y camping",
        description: "hogar y camping"
    }),
    new Category({    
        _id: "5f5d309eb06dc83194ce6665",
        imagePath: "",
        name: "productos quimicos y sellantes",
        description: "productos quimicos y sellantes"
    }),
    new Category({    
        _id: "5f5d30b8b06dc83194ce6666",
        imagePath: "",
        name: "repuestos mochilas",
        description: "repuestos mochilas"    
    }),
    new Category({    
        _id: "5f5d317cb06dc83194ce6667",
        imagePath: "",
        name: "repuestos artefactos de gas",
        description: "repuestos artefactos de gas"    
    }),

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
