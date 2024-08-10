<script lang="ts">
  import type { Invoice, InvoiceItem } from "../lib/invoice";
  import FormElementView from "./FormElementView.svelte";
  import Fa from 'svelte-fa/src/fa.svelte'
  import {  faArrowLeft, faPrint} from "@fortawesome/free-solid-svg-icons";
  import { jsPDF } from "jspdf";
  import { Link } from "svelte-routing";

  export let invoice: Invoice;

  const sapCode = 52198767;

  export let supplier = {
    name: "Nolang SRL",
    address: "Str. Antonin Ciolan, nr 46, Cluj-Napoca, Romania",
    cui: "48281466",
    nrregcom: "J12/2459/2023",
    bank: "BT",
    iban: { RON: "RO123INGB1234567890123456", USD: "RO46BTRLUSDCRT0673789101" },
    swift: "BTRLRO22",
    sap: "52198767",
  };

  const invoiceDate = new Date(invoice.date).toLocaleDateString();
  const i = new Date(invoice.periodStart).toLocaleDateString();
  const e = new Date(invoice.periodEnd).toLocaleDateString();

  function generatePDF() {
    let doc = new jsPDF();
    var elem: HTMLElement = document.querySelector(".invoice-view");
    //        doc.addFont("courier", "courier", "normal");
    //      doc.setFont("courier");
    
    doc.html(elem, {
      callback: function (doc) {
        doc.save(`invoice-${invoice.num}.pdf`);
      },
      x: 6,
      y: 6,
      width: 200,
      windowWidth: 1000,
    });
  }
</script>

<div>

  <div class="invoice-view">
    <div class="m-5">
      <div class="row justify-content-center">
        <h3 class="col-sm-12">Factura (Invoice) {invoice.series} / {invoice.num}</h3>
        <div class="col-sm-11 gx-50">
          <FormElementView label="Serie (Series)" type="text" value={invoice.series} />
          <FormElementView label="Numar (Number)" type="text" value={invoice.num} />
          <FormElementView label="Data (Date)" type="text" value={invoiceDate} />
          {#if invoice.template == "hcl"}
            <FormElementView label="Perioada (Period)" type="text" value={` from ${i} to ${e}`} />
            <FormElementView label="SAP Code" type="text" value={supplier.sap} />
          {/if}
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6 card">
        <div class="card-header">Furnizor (Supplier)</div>
        <div class="card-body">
          <FormElementView label="Nume (Name)" type="text" value={supplier.name} />
          <FormElementView label="CUI (VAT)" type="text" value={supplier.cui} />
          <FormElementView label="Nr. Reg. Com." type="text" value={supplier.nrregcom} />
          <FormElementView label="Adresa (Address)" type="text" value={supplier.address} />
          <FormElementView label="Banca (Bank)" type="text" value={supplier.bank} />          
          <FormElementView label="IBAN" type="text" value={supplier.iban[invoice.currency]} />
          {#if invoice.currency != 'RON'}
          <FormElementView label="SWIFT" type="text" value={supplier.swift} />          
          
          {/if}
        </div>
      </div>
      <div class="col-sm-6 card">
        <div class="card-header">Client (Customer):</div>
        <div class="card-body">
          <FormElementView label="Nume (Name)" type="text" value={invoice.customerName} />
          <FormElementView label="CUI (VAT)" type="text" value={invoice.customerCui} />
          <FormElementView label="Nr. Reg. Com." type="text" value={invoice.customerRegcom} />
          <FormElementView label="Adresa (Address)" type="text" value={invoice.customerAddress} />
          <FormElementView label="Banca (Bank)" type="text" value={invoice.customerBank} />
          <FormElementView label="IBAN" type="text" value={invoice.customerIban} />
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
          </tr>
        </thead>
        <tbody>
          {#if invoice.items}
            {#each invoice.items as item}
              <tr>
                <td>{item.name}</td>
                <td class="text-center">{item.quantity}</td>
                <td class="text-center">{item.um}</td>
                <td class="text-end">{item.price.toFixed(2)} <span> {invoice.currency}</span></td>
                <td class="text-end">{item.amount.toFixed(2)} <span>{invoice.currency}</span></td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
    <hr />
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
            type="text"  value={`${invoice.total.toFixed(2)} ${invoice.currency}`}
          />
          <FormElementView label="Total" type="text" value={`${invoice.totalRon.toFixed(2)} RON`} />
          <span>ConversionRate 1 RON = {invoice.currencyConversionRate.toFixed(4)} {invoice.currency}</span>
        {:else}
          <FormElementView label="Total" type="text" value={`${invoice.total.toFixed(2)} RON`} />
        {/if}
      </div>
    </div>

  </div>
  <div class="row m-5">
    <div class="text-end px-5">
        <Link class="btn btn-secondary" to="/invoices">
            <Fa icon={faArrowLeft} /> list invoices</Link>
            
            <button class="btn btn-primary" on:click={generatePDF}>
              <Fa icon={faPrint}/> print to pdf
            </button>

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
