<script lang="ts">
  import type { Invoice, InvoiceItem, Supplier } from "../lib/invoice";
  import FormElement from "./FormElement.svelte";
  import { faPlusCircle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";
  import CustomerLookup from "./CustomerLookup.svelte";

  let currencies = [
    { value: "EUR", label: "Euro" },
    { value: "RON", label: "Ron" },
    { value: "USD", label: "Usd" },
  ];

  export let view;
  export let changeView;
  export let invoice: Invoice;
  export let supplier: Supplier;
  export let customers;

  function saveItem(i: number) {
    let item = invoice.items[i];
    console.log("saving item", item);
    item.amount = Math.round(item.quantity * item.price * 100) / 100;
    item.vat = Math.round(item.amount * invoice.vatPercent) / 100;
    invoice.dirty += 1;
    invoice.total = invoice.items.reduce((r, i) => r + i.amount, 0);
    invoice.vat = invoice.items.reduce((r, i) => r + i.vat, 0);
    invoice.totalRon =
      Math.round(invoice.total * (1 / invoice.currencyConversionRate) * 100) /
      100;
    invoice.totalWithVAT = invoice.total + invoice.vat;
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
      vat: 0,
    });
    invoice.dirty++;
  }

  function handleCustomerSelect(event) {
    const nc = event.detail.data;
    invoice.customerName = nc.name;
    invoice.customerCui = nc.cui;
    invoice.customerAddress = nc.address;
    invoice.customerRegcom = nc.regcom;
    invoice.customerBank = nc.bank;
    invoice.customerIban = nc.iban;
    invoice.customerId = nc.id;
    invoice.template = nc.template;
  }
</script>

<div>
  <div class="row">
    <div class="card">
      <div class="card-header bg-info">Header</div>

      <div class="card-body bg-light">
        <div class="row justify-content-around">
          <div class="col-sm-4">
            <FormElement
              label="Series"
              bind:value={invoice.series}
              type="string"
              name="invoiceSeries"
            />
            <FormElement
              label="Number"
              bind:value={invoice.num}
              type="string"
              name="invoiceNum"
            />
            <FormElement
              label="Date"
              bind:value={invoice.date}
              type="date"
              name="invoiceDate"
            />

            <FormElement
              label="TVA"
              bind:value={invoice.vatPercent}
              type="select"
              name="invoiceVatPercent"
              ops={[
                { value: 0, label: "0%" },
                { value: 19, label: "19%" },
              ]}
            />
            {#if invoice.template == "hcl"}
              <FormElement
                label="Period Start"
                bind:value={invoice.periodStart}
                type="date"
                name="invoicePeriodStart"
              />
              <FormElement
                label="Period End"
                bind:value={invoice.periodEnd}
                type="date"
                name="invoicePeriodEnd"
              />
            {/if}
          </div>

          <div class="col-sm-4">
            <FormElement
              label="Currency"
              bind:value={invoice.currency}
              type="select"
              name="invoiceCurrency"
              ops={currencies}
            />
            <FormElement
              label="Conversion Rate"
              bind:value={invoice.currencyConversionRate}
              type="number"
              name="currencyConversionRate"
            />
            <FormElement
              label="Total Ron"
              bind:value={invoice.totalRon}
              type="number"
              name="totalRon"
            />
            <FormElement
              label="TVA Total"
              bind:value={invoice.vat}
              type="number"
              name="invoiceVat"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="card">
      <div class="card-header bg-info">Client</div>
      <div class="card-body bg-light">
        <div class="row justify-content-around">
          <div class="col-sm-10">
            <CustomerLookup
              label="Client Lookup"
              {customers}
              on:selected_customer={handleCustomerSelect}
            />
            <FormElement
              label="Nume"
              bind:value={invoice.customerName}
              name="customerName"
            />
            <FormElement
              label="CUI"
              bind:value={invoice.customerCui}
              name="customerCui"
            />
            <FormElement
              label="Nr. Reg. Com."
              bind:value={invoice.customerRegcom}
              name="customerNrRegCom"
            />
            <FormElement
              label="Adresa"
              bind:value={invoice.customerAddress}
              name="customerAddress"
            />
            <FormElement
              label="Banca"
              bind:value={invoice.customerBank}
              name="customerBank"
            />
            <FormElement
              label="IBAN"
              bind:value={invoice.customerIban}
              name="customerIban"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-content-around">
    <div class="card">
      <div class="card-header bg-info">Items</div>
      <div class="card-body bg-light">
        <table class="table table-striped table-hover">
          <thead class="thead-light">
            <tr>
              <th style="width: 50%;">Element</th>
              <th>Cantitate</th>
              <th>UM</th>
              <th>Pret</th>
              <th>Valoare</th>
              {#if invoice.vatPercent != 0}
                <th>TVA</th>
              {/if}
              <th
                ><button class="btn btn-link" on:click={newItem}
                  ><Fa icon={faPlusCircle} /> add</button
                ></th
              >
            </tr>
          </thead>
          <tbody class="border border-white">
            {#each invoice.items as item, i}
              <tr class="border border-white">
                <td
                  ><input
                    class="form-control"
                    type="text"
                    bind:value={item.name}
                  /></td
                >
                <td
                  ><input
                    class="form-control"
                    type="number"
                    step=".01"
                    bind:value={item.quantity}
                    on:change={() => saveItem(i)}
                  /></td
                >
                <td
                  ><input
                    class="form-control"
                    type="text"
                    bind:value={item.um}
                  /></td
                >
                <td
                  ><input
                    class="form-control"
                    type="number"
                    step=".01"
                    bind:value={item.price}
                    on:change={() => saveItem(i)}
                  /></td
                >
                <td>{item.amount}</td>
                {#if invoice.vatPercent != 0}
                  <td>{item.vat}</td>
                {/if}
                <td>
                  <button class="btn btn-danger" on:click={() => deleteItem(i)}
                    ><Fa icon={faTrashAlt} /></button
                  >
                </td>
              </tr>
            {/each}
          </tbody>
          <tfoot class="border border-light">
            <tr class="px-5">
              <td colspan="4" class="text-end p-5">Total</td>
              <td colspan="2" class="p-5">{invoice.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</div>
