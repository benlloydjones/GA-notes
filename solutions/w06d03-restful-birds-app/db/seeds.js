const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const { dbURI } = require('../config/environment');
const Bird = require('../models/bird');
const Category = require('../models/category');

mongoose.connect(dbURI);

Bird.collection.drop();
Category.collection.drop();

Category
  .create([{
    name: 'big'
  },{
    name: 'small'
  }])
  .then((categories) => {
    console.log(`${categories.length} categories created`);

    Bird
      .create([{
        name: 'Barn Owl',
        latinName: 'Tyto alba',
        family: 'Tytonidae',
        image: 'https://www.rspb.org.uk/Images/barnowl_tcm9-18232.jpg?width=530&crop=(34,244,962,766)',
        category: categories[0]
      },{
        name: 'Blue Tit',
        latinName: 'Cyanistes caeruleus',
        family: 'Paridae',
        image: 'https://www.rspb.org.uk/Images/blue_tit_master_tcm9-17216.jpg?width=530&crop=(0,162,800,612)',
        category: categories[1]
      },{
        name: 'Chaffinch',
        latinName: 'Fringilla coelebs',
        family: 'Fringillidae',
        image: 'https://www.rspb.org.uk/Images/chaff_tcm9-17518.jpg?width=530&crop=(176,374,1128,910)',
        category: categories[0]
      },{
        name: 'Robin',
        latinName: 'Erithacus rubecula',
        family: 'Turdidae',
        image: 'https://www.rspb.org.uk/Images/robin_master_tcm9-17658.jpg?width=530&crop=(444,478,1248,930)',
        category: categories[1]
      },{
        name: 'Hen Harrier',
        latinName: 'Circus cyaneus',
        family: 'Accipitridae',
        image: 'https://www.rspb.org.uk/Images/henha_tcm9-17738.jpg?width=530&crop=(188,512,1900,1476)',
        category: categories[0]
      },{
        name: 'Swallow',
        latinName: 'Hirundo rustica',
        family: 'Hirundinidae',
        image: 'https://www.rspb.org.uk/Images/swallow_tcm9-18469.jpg?width=530&crop=(44,262,948,770)',
        category: categories[1]
      },{
        name: 'Swift',
        latinName: 'Apus apus',
        family: 'Apodidae',
        image: 'https://www.rspb.org.uk/Images/swift_tcm9-16743.jpg?width=530&crop=(76,312,1092,884)',
        category: categories[0]
      },{
        name: 'House Martin',
        latinName: 'Delichon urbica',
        family: 'Hirundinidae',
        image: 'https://www.rspb.org.uk/Images/houma_tcm9-16747.jpg?width=530&crop=(52,492,1892,1528)',
        category: categories[0]
      },{
        name: 'Jackdaw',
        latinName: 'Corvus monedula',
        family: 'Corvidae',
        image: 'https://www.rspb.org.uk/Images/jackdaw_tcm9-18298.jpg?width=530&crop=(78,240,982,748)',
        category: categories[0]
      },{
        name: 'Wood Warbler',
        latinName: 'Phylloscopus sibilatrix',
        family: 'Sylviidae',
        image: 'https://www.rspb.org.uk/Images/woodwarbler_tcm9-17218.jpg?width=530&crop=(424,602,1206,1042)',
        category: categories[0]
      },{
        name: 'Chiffchaff',
        latinName: 'Phylloscopus collybita',
        family: 'Sylviidae',
        image: 'https://www.rspb.org.uk/Images/chiffchaff_master_tcm9-16749.jpg?width=530&crop=(226,354,1060,824)',
        category: categories[0]
      },{
        name: 'Pheasant',
        latinName: 'Phasianus colchicus',
        family: 'Phasianidae',
        image: 'https://www.rspb.org.uk/Images/pheas_tcm9-18415.jpg?width=530&crop=(384,576,1578,1248)',
        category: categories[0]
      }])
      .then(birds => console.log(`${birds.length} birds created!`))
      .catch(err => console.log(err))
      .finally(() => mongoose.connection.close());
  });
