<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import Login from './Login.svelte'
  import Home from './Home.svelte'
  import Invoice from './Invoice.svelte'
  import InvoiceList from './InvoiceList.svelte'
  import About from './About.svelte'
  import HeaderBar from './components/HeaderBar.svelte'
  import Sidebar from './components/Sidebar.svelte'

   import {Router, Link, Route} from 'svelte-routing'
  import {currentUser} from './lib/pocketbase';
 export let url= window.location.pathname;
  

</script>

<main>
  {#if !($currentUser)} 
    <Login />
  {/if}

  {#if ($currentUser)}
 


    <Router {url} >
      <div class="wrapper">
        <header class="topnavbar-wrapper">
          <HeaderBar />

        </header>
        <aside class="aside-container">
          <Sidebar />
        </aside>
        <section class="section-container">
          <div class="content-wrapper">
          
        <Route path="/invoices/:id" component={Invoice} />
        <Route path="/invoices" component={InvoiceList} />
        <Route path="/about" component={About} />
        <Route path="/"><Home /></Route>

        </div>
        </section>
      </div>
  </Router>

  {/if}


  
</main>
