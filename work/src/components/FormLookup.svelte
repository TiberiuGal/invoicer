<script lang="ts"> 
  export let inputValue = '';
  export let filterData;
  let searchInput;



</script>
<div>
<input id="lookup-input" 
					 type="text" 
					 placeholder="lookup"
		 			 bind:this={searchInput}
					 bind:value={inputValue} 
					 on:input={filterData}>
  </div>


