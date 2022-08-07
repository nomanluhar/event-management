module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    await db.collection('events').updateOne({eventname: 'EVENT UPDATE'}, {$set: {blacklisted: true}});
  },

  async down(db, client) {
    await db.collection('events').updateOne({eventname: 'Event 1'}, {$set: {stars: 0}});
  }
};
