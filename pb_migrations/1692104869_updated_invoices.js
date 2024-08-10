migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wnt46xazzcy12o8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4onjgk6l",
    "name": "currency",
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
    "id": "2krwnvoh",
    "name": "currencyConversionRate",
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
  collection.schema.removeField("4onjgk6l")

  // remove
  collection.schema.removeField("2krwnvoh")

  return dao.saveCollection(collection)
})
