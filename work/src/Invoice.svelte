<script lang="ts">
  import { Link } from "svelte-routing";
  import { pb } from "./lib/pocketbase";
  import { jsPDF } from "jspdf";
  import type {Invoice} from "./lib/invoice";
import { onMount } from "svelte";
  import InvoiceView from "./components/InvoiceView.svelte";
  import InvoiceEdit from "./components/InvoiceEdit.svelte";
  import Fa from 'svelte-fa/src/fa.svelte'
import { faCaretDown, faCaretUp, faArrowLeft, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons/index'


  export let id = "";


  let invoicePromise = pb.collection("invoices").getOne(id);
  let supplier: any;
  let view = "edit";
  

  onMount(async () => {
    let supplierConfig = await pb.collection("config").getList(0, 1, {filter:'slug="invoice_supplier"'});
    if (supplierConfig.items.length != 1) throw new Error("no supplier config");
    supplier = supplierConfig.items[0].data;
    
   
  });

  function setstatus( status) {
    console.log("setting status", status);
   view = status;
/*
    const ur = pb.collection("invoices").update(invoice.id, invoice);
    ur.then((res) => {
      console.log("updated", res);
      // invoice = res;
    }).catch((err) => {
      console.log("error", err);
    });
    */
  }

  //$: console.log("inv updated", invoice);

 
</script>

<div>
  {#await invoicePromise}
    <p>loading...</p>
  {:then invoice}
  <div class="card card-default">
    <div class="card-header">
      Factura {invoice.series} - {invoice.num}

      <div class="text-end">
        
        
        <button class="btn btn-primary" on:click={() => setstatus( view == "view"? "edit" : "view")}>
          {#if view == "view"}
            <Fa icon={faEdit} />
          {:else}
            <Fa icon={faSearch} />
          {/if}
          {view == "view" ? "edit" : "view"}
        </button>
        
      </div>
    </div>

    <div class="card card-body">
      {#if view == "view"}
        <InvoiceView {invoice} {supplier} />
      {:else}
        <InvoiceEdit {invoice} />
      {/if}
    </div>
  </div>
  {:catch error}
    <p>error: {error.message}</p>
  
    
  {/await}
    
</div>
