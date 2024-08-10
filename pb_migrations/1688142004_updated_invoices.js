migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wnt46xazzcy12o8")

  // remove
  collection.schema.removeField("lsetndjv")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qnopt3mq",
    "name": "customerRegcom",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0jkyw6as",
    "name": "customerCui",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lsetndjv",
    "name": "customer",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("qnopt3mq")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0jkyw6as",
    "name": "customerVat",
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
})
