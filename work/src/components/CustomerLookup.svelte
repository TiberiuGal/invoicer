<script lang="ts">

  import {
    faMagnifyingGlass
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";

import { createEventDispatcher } from 'svelte';

export let name="lookup";
export let label="lookup";
let inputValue;
let placeholder = "lookup customer"
export let className: string = "";
export let filteredCustomers = [];
export let customers = [];
const dispatch = createEventDispatcher();

function onInputLookup() {
    filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(inputValue.toLowerCase()) );
}

let hiLiteIndex = null;
//$: console.log(hiLiteIndex);	
$: hiLitedCountry = filteredCustomers[hiLiteIndex]; 	
	
const navigateList = (e) => {
	if (e.key === "ArrowDown" && hiLiteIndex <= filteredCustomers.length-1) {
		hiLiteIndex === null ? hiLiteIndex = 0 : hiLiteIndex += 1
	} else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
		hiLiteIndex === 0 ? hiLiteIndex = filteredCustomers.length-1 : hiLiteIndex -= 1
	} else if (e.key === "Enter") {
		setInputVal(filteredCustomers[hiLiteIndex]);
	} else {
		return;
	}
} 
const setInputVal = (customer) => {
	filteredCustomers = [];
	hiLiteIndex = null;
    dispatch('selected_customer', {
			data: customer
	});
}	


</script>


<style>
    #autocomplete-items-list {
         border: 1px solid gray;
         box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
    }
    li.autocomplete-items {
        list-style: none;
      border-bottom: 1px solid #d4d4d4;
      z-index: 99;
      /*position the autocomplete items to be the same width as the container:*/
      top: 100%;
      left: 0;
      right: 0;
        padding: 10px;
      cursor: pointer;
      background-color: #fff;
    }
    
    li.autocomplete-items:hover {
      /*when hovering an item:*/
      background-color: #81921f;
        color: white;
    }
    
    li.autocomplete-items:active {
      /*when navigating through the items using the arrow keys:*/
      background-color: DodgerBlue !important;
      color: #ffffff;
    }	
        
    .autocomplete-active {
      /*when navigating through the items using the arrow keys:*/
      background-color: DodgerBlue !important;
      color: #ffffff;
    }
    .input-group-text{
        font-size: 35px;
        box-sizing: initial;
    }
</style>

<svelte:window on:keydown={navigateList} />

<div class="form-group row">
  <label class="col-sm-3 col-form-label" for={name}>{label}</label>
  <div class="col-sm-9">
    <div class="input-group">
        <div class="input-group-prepend">
            <Fa icon={faMagnifyingGlass} class="input-group-text" />
          </div>
          <input class="form-control {className}" {name} bind:value={inputValue} type="text" on:input={onInputLookup} {placeholder} />

    </div> 
      {#if filteredCustomers.length > 0}
      <ul id="autocomplete-items-list">
          {#each filteredCustomers as customer, i}
              <li class="autocomplete-items" class:autocomplete-active={i === hiLiteIndex} on:click={() => setInputVal(customer)}>{@html customer.name}</li>
          {/each}			
      </ul>
  {/if}
    </div>

 
</div>