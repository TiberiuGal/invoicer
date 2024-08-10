migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wnt46xazzcy12o8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "psthuvbi",
    "name": "series",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xszkkbwc",
    "name": "status",
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
  const collection = dao.findCollectionByNameOrId("wnt46xazzcy12o8")

  // remove
  collection.schema.removeField("psthuvbi")

  // remove
  collection.schema.removeField("xszkkbwc")

  return dao.saveCollection(collection)
})
