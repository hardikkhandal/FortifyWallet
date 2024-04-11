<!-- YourComponent.svelte -->
<script lang="ts">
  import { slide } from 'svelte/transition';
  import {
    accountChainId,
    connected,
    connectMetamask,
    connectWalletConnect,
    disconnect,
    walletAddress
  } from '$lib/stores/provider';
 // Assuming you have stores for companyName, amount, and description
  import { balanceOnBlock } from '$lib/stores/state';
  import { formatEther } from 'ethers/lib/utils';
  import { contractAddress, contractABI } from '../lib/abis/contracts/contractABI';
  import { selectedOption, transactionID, awaitingTx, errorHandling, connectedAddress } from '../lib/stores/stores';
  import Connect from '../lib/invocations/other/Connect.svelte';
  import Factory from '../lib/abis/contracts/ContractFactory.svelte';
  import WalletInfo from '../lib/invocations/other/WalletInfo.svelte';
  import Nightmode from '../lib/invocations/other/Nightmode.svelte';
  import Guide from '../lib/invocations/other/Needhelp.svelte';
  import Submit from '../lib/invocations/Submit.svelte';
  import Approve from '../lib/invocations/Approve.svelte';
  import Revoke from '../lib/invocations/Revoke.svelte';
  import Execute from '../lib/invocations/Execute.svelte';

  let isExpanded = false;

  function clickHandler() {
    isExpanded = !isExpanded;
    console.log(isExpanded);
  }

 

  let formData = {};
  let formVisible = true;

  // Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();

  // Construct the URL for your server endpoint
  const url = 'http://localhost:3000/api/submit-form'; // Assuming your server is running on localhost:3000

  // Create the options object for the fetch request
  const options = {
    method: 'POST', // Assuming you want to send the data via POST request
    headers: {
      'Content-Type': 'application/json', // Assuming you're sending JSON data
    },
    body: JSON.stringify(formData), // Convert formData object to JSON string
  };

  // Make the fetch request
  fetch(url, options)
    .then(response => {
      if(response.ok){
        formVisible = false; 
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle successful response here if needed
      console.log('Form data sent successfully');
    })
    .catch(error => {
      // Handle errors here
      console.error('Error in sending form data:', error);
    });
}

  </script>

<main class="">

  {#if !connected}
  <div class="max-w-full flex justify-between mr-2 mt-2">
    <div class='flex flex-wrap'>
      <Connect></Connect>
      <div class=""> <!-- Add reactivity s:mt-2-->
        <Factory></Factory>
      </div>
    </div>
    <div>
      <Nightmode></Nightmode>
    </div>
  </div>
  {/if}
  {#if connected}
  <div class="max-w-full flex justify-between  mt-2">
    <div class='flex flex-wrap'>
      <Connect></Connect>
      <div class=""> <!-- Add reactivity s:mt-2-->
        <Factory></Factory>
      </div>
      {#if $contractAddress}
      <div>
        <WalletInfo></WalletInfo>
      </div>
      {/if}
    </div>
    <div class='mr-2'>
      <Nightmode></Nightmode>
    </div>
  </div>
  {/if}


{#if formVisible}
<form on:submit={handleSubmit}>
  <label>
    Company Name:
    <input type="text" bind:value={formData.companyName} />
  </label>
  <label>
    Amount:
    <input type="number" bind:value={formData.amount} />
  </label>
  <label>
    Message:
    <textarea bind:value={formData.description}></textarea>
  </label>
  <button type="submit">Submit</button>
</form>
{/if}

  <div class="flex mx-auto w-full justify-center py-10 px-4 h-2/4 -mb-3">
    <div class="max-w-md w-full space-y-8 ">
      <div>
        <img src='./multisig-logo.png' class="mx-auto h-12 w-auto" alt="logo">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">multi-sig.wallet</h2>

        {#if $transactionID}
        <p class="text-center text-sm text-green-500 mt-2">
          {`Last logged transaction ID: ${$transactionID}`}
        </p>
        {/if}
      </div>

      {#if $selectedOption==='Submit'} 
      <Submit></Submit>

      {:else if $selectedOption==='Approve'} 
      <Approve></Approve>

      {:else if $selectedOption==='Revoke'}

      <Revoke></Revoke>

      {:else if $selectedOption==='Execute'} 
      <Execute></Execute>

      {/if}

      
    </div>
  </div>
</main>

<style>
    form{
      padding:3vh;
    }
    main{
      padding: 20vh;
    }
  /* Style the form container */
  .form-container {
    max-width: 400px; /* Adjust as needed */
    padding: 20px;
    border: 2px solid black; /* Black border */
    border-radius: 8px; /* Optional: Rounded corners */
    background-color: white; /* Optional: Set background color */
  }

  /* Style form elements */
  label {
    display: block;
    margin-bottom: 10px;
  }

  input,
  textarea,
  button {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 2px solid black; /* Black border */
    border-radius: 4px; /* Optional: Rounded corners */
    box-sizing: border-box;
  }

  textarea {
    resize: vertical; /* Allow vertical resizing of textarea */
  }

	.form{
		padding:3vh;
		margin-left:50px;
	}
  button {
    background-color: #4caf50; /* Green background color */
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #45a049; /* Darker green on hover */
  }
  
</style>
