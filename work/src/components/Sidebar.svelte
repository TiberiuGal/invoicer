<script lang="ts">
  import {
    faCogs,
    faDashboard,
    faEnvelopeOpen,
    faFileCircleExclamation,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";
  import { Link } from "svelte-routing";

  export let siteName = "Site Name";
</script>

<div class="aside-inner">
  <nav class="sidebar">
    <ul class="sidebar-nav">
      <li class="nav-heading"><span>{siteName}</span></li>
      <li>
        <Link to="/" title="Dashboard">
          <Fa icon={faDashboard} /> <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/config"><Fa icon={faCogs} /> <span>Configurare</span></Link>
      </li>
      <li>
        <Link to="/templates"
          ><Fa icon={faEnvelopeOpen} /> <span>Emailuri</span></Link
        >
      </li>

      <li class="nav-heading"><span>Invoices</span></li>
      <li>
        <Link to="/invoices" title="ecom"
          ><Fa icon={faFileCircleExclamation} /> <span>Invoices</span>
        </Link>
      </li>
    </ul>
  </nav>
</div>
