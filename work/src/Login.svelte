<script lang="ts">
  import { currentUser, pb } from "./lib/pocketbase";

  let username: string;
  let password: string;

  async function login() {
    await pb.collection("users").authWithPassword(username, password);
  }

  async function signUp() {
    try {
      const userData = {
        username,
        password,
        passwordConfirm: password,
      };
      const createUser = await pb.collection("users").create(userData);
      await login();
    } catch (err) {
      console.error(err);
    }
  }

  function signOut() {
    pb.authStore.clear();
  }
</script>

{#if $currentUser}
  <p>
    Signed in as {$currentUser.username}
    <button on:click={signOut}>logout</button>
  </p>
{:else}
  <form on:submit|preventDefault>
    <input bind:value={username} type="text" placeholder="username" />
    <input bind:value={password} type="password" />
    <br />
    <button on:click={signUp}>Signup</button>
    <button on:click={login}> Login </button>
  </form>
{/if}
