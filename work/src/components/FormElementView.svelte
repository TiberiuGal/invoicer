<script lang="ts">
  export let label: string;
  export let type: string;
  export let value: string;
</script>

<div class="form-group row col-form-label">
  <strong class="col-sm-5 text-end">{label}</strong>
  {#if type == "checkbox"}
    <span class="col-sm-7 text-start"> <input type="checkbox" checked={value} disabled /> </span>
  {:else}
    <span class="col-sm-7 text-start"> {value} </span>
  {/if}
</div>
