module.exports = {
	port: process.env.PORT || 3003,
    db: process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/storedb'
}