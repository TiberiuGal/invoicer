<script lang="ts">
  import type { Invoice, InvoiceItem } from "../lib/invoice";
  import { Link } from "svelte-routing";
  import FormElement from "./FormElement.svelte";
  import { pb } from "../lib/pocketbase";
  import {
    faCancel,
    faArrowLeft,
    faPlusCircle,
    faSave,
    faTrashAlt,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";
  import { onMount } from "svelte";
  import CustomerLookup from "./CustomerLookup.svelte";

  let currencies = [
    { value: "EUR", label: "Euro" },
    { value: "RON", label: "Ron" },
    { value: "USD", label: "Usd" },
  ];

  export let invoice: Invoice;
  let initialInvoice;
  let customers = [];
  onMount(async () => {
    initialInvoice = JSON.parse(JSON.stringify(invoice));
    const res = await pb.collection("customers").getList();
    customers = res.items;
  });

  function onSaveInvoice() {
    pb.collection("invoices")
      .update(invoice.id, invoice)
      .then((res) => {
        console.log("updated", res);
      });
    if (invoice.customerId == "") {
      pb.collection("customers")
        .create({
          name: invoice.customerName,
          cui: invoice.customerCui,
          address: invoice.customerAddress,
          regcom: invoice.customerRegcom,
          bank: invoice.customerBank,
          iban: invoice.customerIban,
        })
        .then((res) => {
          invoice.customerId = res.id;
          pb.collection("invoices")
            .update(invoice.id, invoice)
            .then((res) => {
              console.log("updated", res);
            });
        });
    }
  }
  function resetInvoice() {
    console.log("resetting invoice", initialInvoice, invoice);
    invoice = JSON.parse(JSON.stringify(initialInvoice));
  }

  function saveItem(i: number) {
    let item = invoice.items[i];
    console.log("saving item", item);
    item.amount = Math.round(item.quantity * item.price * 100) / 100;
    invoice.dirty += 1;
    invoice.total = invoice.items.reduce((r, i) => r + i.amount, 0);
    invoice.totalRon =
      Math.round(invoice.total * invoice.currencyConversionRate * 100) / 100;
  }
  function deleteItem(i: number) {
    invoice.items.splice(i, 1);
    invoice.dirty += 1;
    invoice.total = invoice.items.reduce((r, i) => r + i.amount, 0);
    invoice.totalRon =
      Math.round(invoice.total * invoice.currencyConversionRate * 100) / 100;
  }
  function newItem() {
    invoice.items.push({
      name: "",
      quantity: 1,
      um: "",
      price: 0,
      amount: 0,
      invoiceId: invoice.id,
      id: "",
    });
    invoice.dirty++;
  }
  //$: console.log( invoice);

  function handleCustomerSelect(event) {
    const nc = event.detail.data;
    invoice.customerName = nc.name;
    invoice.customerCui = nc.cui;
    invoice.customerAddress = nc.address;
    invoice.customerRegcom = nc.regcom;
    invoice.customerBank = nc.bank;
    invoice.customerIban = nc.iban;
    invoice.customerId = nc.id;
  }
</script>

<div>
  {invoice.series} - {invoice.num}

  <div class="row">
    <div class="card">
      <div class="card-header">Header</div>
    </div>
    <div class="card-body">
      <FormElement
        label="Date"
        bind:value={invoice.date}
        type="date"
        name="invoiceDate" />
    </div>
  </div>
  <div class="row">
    <div class="card">
      <div class="card-header">Client</div>
      <div class="card-body">
        <CustomerLookup
          label="Client Lookup"
          {customers}
          on:selected_customer={handleCustomerSelect} />
        <FormElement
          label="Nume"
          bind:value={invoice.customerName}
          name="customerName" />
        <FormElement
          label="CUI"
          bind:value={invoice.customerCui}
          name="customerCui" />
        <FormElement
          label="Nr. Reg. Com."
          bind:value={invoice.customerRegcom}
          name="customerNrRegCom" />
        <FormElement
          label="Adresa"
          bind:value={invoice.customerAddress}
          name="customerAddress" />
        <FormElement
          label="Banca"
          bind:value={invoice.customerBank}
          name="customerBank" />
        <FormElement
          label="IBAN"
          bind:value={invoice.customerIban}
          name="customerIban" />
      </div>
    </div>
  </div>
  <div class="row">
    <div class="card">
      <div class="card-header">Options</div>
    </div>
    <div class="card-body">
      <FormElement
        label="Currency"
        bind:value={invoice.currency}
        type="select"
        name="invoiceCurrency"
        ops={currencies} />
      <FormElement
        label="Conversion Rate"
        bind:value={invoice.currencyConversionRate}
        type="number"
        name="currencyConversionRate" />
      <FormElement
        label="Total Ron"
        bind:value={invoice.totalRon}
        type="number"
        name="totalRon" />
    </div>
  </div>
  <div class="row">
    <table>
      <thead>
        <tr>
          <th>Element</th>
          <th>Cantitate</th>
          <th>UM</th>
          <th>Pret</th>
          <th>Valoare</th>
          <th
            ><button class="btn btn-link" on:click={newItem}
              ><Fa icon={faPlusCircle} /> add</button
            ></th>
        </tr>
      </thead>
      <tbody>
        {#each invoice.items as item, i}
          <tr>
            <td><input type="text" bind:value={item.name} /></td>
            <td
              ><input
                type="number"
                step=".01"
                bind:value={item.quantity}
                on:change={() => saveItem(i)} /></td>
            <td><input type="text" bind:value={item.um} /></td>
            <td
              ><input
                type="number"
                step=".01"
                bind:value={item.price}
                on:change={() => saveItem(i)} /></td>
            <td>{item.amount}</td>
            <td
              ><button class="btn btn-danger" on:click={() => deleteItem(i)}
                ><Fa icon={faTrashAlt} /></button
              ></td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr class="px-5">
          <td colspan="4" class="text-end p-5">Total</td>
          <td colspan="2" class="p-5">{invoice.total}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div class="row m-5">
    <div class="text-end px-5">
      <Link class="btn btn-secondary" to="/invoices">
        <Fa icon={faArrowLeft} /> list invoices
      </Link>

      <button class="btn btn-warning" on:click={resetInvoice}>
        <Fa icon={faCancel} /> reset
      </button>
      <button class="btn btn-success" on:click={onSaveInvoice}>
        <Fa icon={faSave} /> save
      </button>
    </div>
  </div>
</div>
