migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wnt46xazzcy12o8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ob2s5wia",
    "name": "totalRon",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wnt46xazzcy12o8")

  // remove
  collection.schema.removeField("ob2s5wia")

  return dao.saveCollection(collection)
})
