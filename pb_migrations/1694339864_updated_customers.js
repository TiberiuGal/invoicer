migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dog3wm9dkxps7id")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dog3wm9dkxps7id")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
