<script lang="ts">
  export let label: string;
  export let type: string = "text";
  export let value: string;
  export let name: string;
  export let className: string = "";
  export let ops = [];
</script>

<div class="form-group row">
  <label class="col-sm-3 col-form-label" for={name}>{label}</label>
  <div class="col-sm-9">
    {#if type == "checkbox"}
      <input type="checkbox" {name} bind:checked={value} />
    {:else if type == "select"}
      <select class="form-control {className} " {name} bind:value>
        {#each ops as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    {:else if type == "date"}
      <input class="form-control {className}" {name} type="date" bind:value />
      {value}
    {:else if type == "number"}
      <input class="form-control {className}" {name} type="number" bind:value />
    {:else}
      <input class="form-control {className}" {name} type="text" bind:value />
    {/if}
  </div>
</div>
