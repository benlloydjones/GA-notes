const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');

const { dbURI } = require('../config/environment');
mongoose.connect(dbURI, { useMongoClient: true });

const Book = require('../models/book');
const Author = require('../models/author');

Book.collection.drop();
Author.collection.drop();

Author.create([{
  firstname: 'George',
  lastname: 'Orwell'
}, {
  firstname: 'F. Scott',
  lastname: 'Fitzgerald'
}, {
  firstname: 'Jane',
  lastname: 'Austen'
}, {
  firstname: 'J. D.',
  lastname: 'Salinger'
}, {
  firstname: 'John',
  lastname: 'Steinbeck'
}])
  .then((authors) => {
    console.log(`${authors.length} authors created!`);

    return Book
      .create([{
        title: 'The Great Gatsby',
        author: authors[1],
        description: 'The Great Gatsby is a 1925 novel written by American author F. Scott Fitzgerald that follows a cast of characters living in the fictional town of West Egg on prosperous Long Island in the summer of 1922.'
      },{
        title: 'Pride and Prejudice',
        author: authors[2],
        description: 'Pride and Prejudice is a novel by Jane Austen, first published in 1813. The story charts the emotional development of the protagonist, Elizabeth Bennet, who learns the error of making hasty judgements and comes to appreciate the difference between the superficial and the essential. The comedy of the writing lies in the depiction of manners, education, and marriage and money in the British Regency.'
      },{
        title: 'The Catcher in the Rye',
        author: authors[3],
        description: 'The Catcher in the Rye is a 1951 novel by J. D. Salinger. A controversial novel originally published for adults, it has since become popular with adolescent readers for its themes of teenage angst and alienation. The novel\'s protagonist Holden Caulfield has become an icon for teenage rebellion. The novel also deals with complex issues of innocence, identity, belonging, loss, and connection.'
      },{
        title: 'Of Mice and Men',
        author: authors[4],
        description: 'Of Mice and Men is a novella written by author John Steinbeck. Published in 1937, it tells the story of George Milton and Lennie Small, two displaced migrant ranch workers, who move from place to place in California in search of new job opportunities during the Great Depression in the United States.'
      }]);
  })
  .then((books) => {
    console.log(`${books.length} books created!`);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
