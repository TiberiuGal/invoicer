<script lang="ts">
  import { Link } from "svelte-routing";
  import { pb } from "./lib/pocketbase";
  let invoices = [];
  import { onMount } from "svelte";
  import {
    faCirclePlus,
    faEye,
    faPlugCirclePlus,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";

  onMount(async () => {
    await loadInvoices();
  });

  function loadInvoices() {
    pb.collection("invoices")
      .getList(1, 10, { sort: "-num" })
      .then((res) => {
        invoices = res.items;
      });
  }
  function formatDate(inDate: string): string {
    let d = new Date(inDate);
    return d.toLocaleDateString();
  }
  function newInvoice() {
    pb.collection("config")
      .getList(0, 1, { filter: 'slug="invoice_config"' })
      .then((res) => {
        if (res.items.length != 1) throw new Error("no invoice config");
        const ic = res.items[0].data;
        const icId = res.items[0].id;
        let invoiceNum = String(ic.next);
        pb.collection("invoices")
          .create({
            series: ic.series,
            items: [],
            num: invoiceNum.padStart(4, "0"),
            currency: "RON",
            currencyConversionRate: 1,
          })
          .then((res) => {
            let invoiceId = res.id;
            ic.next = ic.next + 1;
            pb.collection("config")
              .update(icId, { data: ic })
              .then((res) => {
                window.location.href = "/invoices/" + invoiceId;
              });
          });
      });
  }

  function deleteInvoice(invoiceId) {
    console.log("deleting", invoiceId);
    pb.collection("invoices")
      .delete(invoiceId)
      .then((res) => {
        console.log("deleted", res);
        loadInvoices();
      });
  }
</script>

<div>
  <div class="card card-default">
    <div class="card-header">
      Lista Facturi
      <div class="text-end">
        <button on:click={newInvoice} class="btn btn-primary">
          <Fa icon={faCirclePlus} /> Factura Noua
        </button>
      </div>
    </div>
    <div class="card-body">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Total</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {#each invoices as invoice}
            <tr id="tr-{invoice.id}">
              <td
                ><Link to="/invoices/{invoice.id}"
                  >{invoice.series} / {invoice.num}</Link
                ></td
              >
              <td>{invoice.customerName}</td>
              <td>{invoice.total}</td>
              <td>{invoice.currency}</td>
              <td>{formatDate(invoice.date)}</td>
              <td>
                <div class="btn-group">
                  <Link to="/invoices/{invoice.id}"
                    ><button class="btn btn-primary">
                      <Fa icon={faEye} /> View</button
                    ></Link
                  >
                  <button
                    class="btn btn-sm btn-danger"
                    on:click={() => deleteInvoice(invoice.id)}>Delete</button
                  >
                </div>
              </td></tr
            >
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
