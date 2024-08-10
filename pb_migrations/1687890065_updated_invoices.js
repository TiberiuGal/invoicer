migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wnt46xazzcy12o8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "16e6yfie",
    "name": "customerName",
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
    "id": "fzcpubhp",
    "name": "customerAddress",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ckiev4bt",
    "name": "customerBank",
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
    "id": "vgnzcneh",
    "name": "customerIban",
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
    "id": "nkyqoalm",
    "name": "total",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "f8cga1xb",
    "name": "periodStart",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ywhr3aoa",
    "name": "periodEnd",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "behkvyja",
    "name": "customerEmail",
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
    "id": "alm3qume",
    "name": "customerPhone",
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
    "id": "j2sv5due",
    "name": "customerId",
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
  collection.schema.removeField("16e6yfie")

  // remove
  collection.schema.removeField("fzcpubhp")

  // remove
  collection.schema.removeField("0jkyw6as")

  // remove
  collection.schema.removeField("ckiev4bt")

  // remove
  collection.schema.removeField("vgnzcneh")

  // remove
  collection.schema.removeField("nkyqoalm")

  // remove
  collection.schema.removeField("f8cga1xb")

  // remove
  collection.schema.removeField("ywhr3aoa")

  // remove
  collection.schema.removeField("behkvyja")

  // remove
  collection.schema.removeField("alm3qume")

  // remove
  collection.schema.removeField("j2sv5due")

  return dao.saveCollection(collection)
})
