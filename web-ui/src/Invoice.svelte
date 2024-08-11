<script lang="ts">
  import { pb } from "./lib/pocketbase";
  import type { Invoice, Supplier } from "./lib/invoice";
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import InvoiceView from "./components/InvoiceView.svelte";
  import InvoiceEdit from "./components/InvoiceEdit.svelte";
  import Fa from "svelte-fa/src/fa.svelte";
  import { jsPDF } from "jspdf";
  import {
    faCancel,
    faArrowLeft,
    faPrint,
    faHardDrive,
    faPlusCircle,
    faSave,
    faTrashAlt,
    faEdit,
    faFileCode,
  } from "@fortawesome/free-solid-svg-icons";

  export let id = "";

  let supplier: Supplier;
  export let view = "view";
  let loaded = false;
  let invoice;
  let initialInvoice;
  let customers;
  onMount(async () => {
    let supplierConfig = await pb
      .collection("config")
      .getList(0, 1, { filter: 'slug="invoice_supplier"' });
    if (supplierConfig.items.length != 1) throw new Error("no supplier config");
    supplier = supplierConfig.items[0].data;

    invoice = await pb.collection("invoices").getOne(id);
    invoice.date = formatDate(invoice.date);
    console.log("date ", invoice.date);
    initialInvoice = JSON.parse(JSON.stringify(invoice));
    customers = (await pb.collection("customers").getList()).items;

    loaded = true;
  });

  function changeView(newView: string) {
    view = newView;
  }
  function formatDate(inDate: string): string {
    return inDate.split(" ")[0];
  }
  function downloadPDF() {
    generatePDF(function (doc) {
      doc.save(`invoice-${invoice.num}.pdf`);
    });
  }
  function uploadPDF() {
    generatePDF(function (doc) {
      let docData = doc.output();
      let invoiceDate = new Date(invoice.date);
      let invoiceMonth = invoiceDate.getMonth() + 1;
      let invoiceYear = invoiceDate.getFullYear();
      if (invoiceMonth < 10) {
        invoiceMonth = "0" + invoiceMonth;
      }

      pb.send("upload", {
        method: "POST",
        body: JSON.stringify({
          name: "invoice-" + invoice.num + ".pdf",
          id: invoice.id,
          file: docData,
          month: `${invoiceMonth}.${invoiceYear}`,
        }),
      });
    });
  }
  function generatePDF(cb) {
    let doc = new jsPDF();
    var elem: HTMLElement = document.querySelector(".invoice-view");
    //        doc.addFont("courier", "courier", "normal");
    //      doc.setFont("courier");

    doc.html(elem, {
      callback: cb,
      x: 6,
      y: 6,
      width: 200,
      windowWidth: 1000,
    });
  }
  function onSaveInvoice() {
    invoice.date = formatDate(invoice.date);
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
</script>

<div>
  {#if !loaded}
    <p>loading...</p>
  {:else}
    <div class="card card-default">
      <div class="card-header">
        Factura {invoice.series} - {invoice.num}

        <div class="text-end" />
      </div>

      <div class="card card-body">
        {#if view == "edit"}
          <InvoiceEdit {invoice} {supplier} {customers} {view} {changeView} />
        {:else}
          <InvoiceView {invoice} {supplier} {view} {changeView} />
        {/if}

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
            <button class="btn btn-success" on:click={downloadPDF}>
              <Fa icon={faPrint} /> download pdf
            </button>
            <button class="btn btn-success" on:click={uploadPDF}>
              <Fa icon={faHardDrive} /> upload to gDrive
            </button>

            {#if view != "view"}
              <button
                class="btn btn-primary"
                on:click={() => changeView("view")}
              >
                <Fa icon={faFileCode} />
                view
              </button>
            {/if}
            {#if view != "edit"}
              <button
                class="btn btn-primary"
                on:click={() => changeView("edit")}
              >
                <Fa icon={faEdit} />
                edit
              </button>
            {/if}

            {#if view != "proforma"}
              <button
                class="btn btn-primary"
                on:click={() => changeView("proforma")}
              >
                <Fa icon={faFileCode} />
                proforma
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
