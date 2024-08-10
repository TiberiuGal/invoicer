migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dog3wm9dkxps7id")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6fmmqy9x",
    "name": "template",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dog3wm9dkxps7id")

  // remove
  collection.schema.removeField("6fmmqy9x")

  return dao.saveCollection(collection)
})
