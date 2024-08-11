<script lang="ts">
  import type { Invoice, InvoiceItem, Supplier } from "../lib/invoice";
  import FormElementView from "./FormElementView.svelte";

  export let invoice: Invoice;
  export let view;

  export let supplier: Supplier;
  const invoiceDate = new Date(invoice.date).toLocaleDateString();
  const i = new Date(invoice.periodStart).toLocaleDateString();
  const e = new Date(invoice.periodEnd).toLocaleDateString();
</script>

<div>
  <div class="invoice-view">
    <div class="m-5">
      <div class="row justify-content-center">
        <h3 class="col-sm-12">
          {#if view == "proforma"}
            Proforma {invoice.series} / {invoice.proforma}
          {:else}
            Factura (Invoice) {invoice.series} / {invoice.num}
          {/if}
        </h3>
        <div class="col-sm-11 gx-50">
          <FormElementView
            label="Serie (Series)"
            type="text"
            value={invoice.series}
          />
          {#if view == "proforma"}
            <FormElementView
              label="Numar (Number)"
              type="text"
              value={invoice.proforma}
            />
          {:else}
            <FormElementView
              label="Numar (Number)"
              type="text"
              value={invoice.num}
            />
          {/if}
          <FormElementView
            label="Data (Date)"
            type="text"
            value={invoiceDate}
          />
          {#if invoice.template == "hcl"}
            <FormElementView
              label="Perioada (Period)"
              type="text"
              value={` from ${i} to ${e}`}
            />
            <FormElementView
              label="SAP Code"
              type="text"
              value={supplier.sap}
            />
          {/if}
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6 card">
        <div class="card-header">Furnizor (Supplier)</div>
        <div class="card-body">
          <FormElementView
            label="Nume (Name)"
            type="text"
            value={supplier.name}
          />
          <FormElementView label="CUI (VAT)" type="text" value={supplier.cui} />
          <FormElementView
            label="Nr. Reg. Com."
            type="text"
            value={supplier.nrregcom}
          />
          <FormElementView
            label="Adresa (Address)"
            type="text"
            value={supplier.address}
          />
          <FormElementView
            label="Banca (Bank)"
            type="text"
            value={supplier.bank}
          />
          <FormElementView
            label="IBAN"
            type="text"
            value={supplier.iban[invoice.currency]}
          />
          {#if invoice.currency != "RON"}
            <FormElementView label="SWIFT" type="text" value={supplier.swift} />
          {/if}
        </div>
      </div>
      <div class="col-sm-6 card">
        <div class="card-header">Client (Customer):</div>
        <div class="card-body">
          <FormElementView
            label="Nume (Name)"
            type="text"
            value={invoice.customerName}
          />
          <FormElementView
            label="CUI (VAT)"
            type="text"
            value={invoice.customerCui}
          />
          <FormElementView
            label="Nr. Reg. Com."
            type="text"
            value={invoice.customerRegcom}
          />
          <FormElementView
            label="Adresa (Address)"
            type="text"
            value={invoice.customerAddress}
          />
          <FormElementView
            label="Banca (Bank)"
            type="text"
            value={invoice.customerBank}
          />
          <FormElementView
            label="IBAN"
            type="text"
            value={invoice.customerIban}
          />
        </div>
      </div>
    </div>
    <hr />
    <div class="row">
      <table class="table-responsive mx-5 col-sm-11">
        <thead>
          <tr class="thead-light">
            <th>Element (Item)</th>
            <th class="text-center">Canitate (Quantity)</th>
            <th class="text-center">UM (UM)</th>
            <th class="text-end">Pret (Price)</th>
            <th class="text-end">Valoare (Amount)</th>
            {#if invoice.vatPercent != 0}
              <th class="text-end">TVA (VAT)</th>
            {/if}
          </tr>
        </thead>
        <tbody>
          {#if invoice.items}
            {#each invoice.items as item}
              <tr>
                <td>{item.name}</td>
                <td class="text-center">{item.quantity}</td>
                <td class="text-center">{item.um}</td>
                <td class="text-end"
                  >{item.price.toFixed(2)} <span> {invoice.currency}</span></td
                >
                <td class="text-end"
                  >{item.amount.toFixed(2)} <span>{invoice.currency}</span></td
                >
                {#if invoice.vatPercent != 0}
                  <td class="text-end"
                    >{item.vat.toFixed(2)} <span>{invoice.currency}</span>
                    <br />
                    <span class="fst-italic"
                      >({invoice.vatPercent.toFixed(2)}%)</span
                    ></td
                  >
                {/if}
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
    <hr />
    {#if invoice.template == "itteams"}
      <div class="row mt-5">
        <div class="col-sm-6">
          <div>
            <FormElementView
              label="Curs Valutar"
              type="text"
              value="1 USD = {invoice.currencyConversionRate.toFixed(4)} RON"
            />
          </div>
        </div>
      </div>
    {/if}
    <div class="row mt-5">
      <div class="col-sm-6">
        <div>
          <FormElementView label="Issued By" type="text" value="Tiberiu Gal" />
          <FormElementView label="CNP" type="text" value="1780702191320" />
        </div>
      </div>
      <div class="col-sm-6">
        {#if invoice.currency != "RON"}
          <FormElementView
            label="Total"
            type="text"
            value={`${invoice.total.toFixed(2)} ${invoice.currency}`}
          />
          <FormElementView
            label="Total"
            type="text"
            value={`${invoice.totalRon.toFixed(2)} RON`}
          />
          <span
            >ConversionRate 1 RON = {invoice.currencyConversionRate.toFixed(4)}
            {invoice.currency}</span
          >
        {:else}
          <FormElementView
            label="Total"
            type="text"
            value={`${invoice.total.toFixed(2)} RON`}
          />
          {#if invoice.vatPercent != 0}
            <FormElementView
              label="TVA"
              type="text"
              value={`${invoice.vat.toFixed(2)} RON`}
            />
            <FormElementView
              label="Total cu TVA"
              type="text"
              value={`${invoice.totalWithVAT.toFixed(2)} RON`}
            />
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .card-header {
    padding-left: 50px;
  }
  .thead-light {
    background: #f6f9fc;
    color: #8898aa;
    font-size: 0.65rem !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    line-height: 2rem !important;
  }
  .thead-light th {
    padding-left: 10px;
    padding-right: 10px;
  }
  .invoice-view {
    font-family: "Courier New", Courier, monospace;
  }
  .invoice-view tbody td {
    padding: 3px 10px;
  }
</style>
