const { CreateIdentityTokenAddressedTo } = require('replidentity');
const io = require('socket.io-client');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

let socket;

function green(string) {
  return `\u001b[32m${string}\u001b[39m`;
}

function replitTeam(string) {
  return '\u001b[90m' + string + '\u001b[39m'
}

function siteMod(string) {
  return '\u001b[38;5;216m' + string + '\u001b[39m'
}

function replitRep(string) {
  return '\u001b[38;5;132m' + string + '\u001b[39m'
}

function chat() {
  rl.question("\u001b[36m>\u001b[39m ", (string) => {
    socket.emit('chat', string, () => {});
    chat();
  });
}

const muted = false;

async function main() {
	let audience = 'b1a8f82a-2a60-4013-aff3-267156f9fc3e';
	const identityToken  = await CreateIdentityTokenAddressedTo(audience);

	socket = io('https://hyperchat-v2-server.haroon.repl.co', {
    transports: ["polling", "websocket"],
    extraHeaders: {
      "X-Repl-Identity": identityToken,
    }
  })

  socket.on('auth_error', (err) => {
    console.log(`There was an authorization error trying to connect with the server: ${'\u001b[31m' + err + '\u001b[39m'}`);

    if (err == "AuthorizationError: You're banned from HyperChat v2.") {
      process.exit(0);
    }
  });
  
  socket.on('auth_success', (data) => {
    const colour = data.isAdmin ? replitTeam : (data.isMod ? siteMod : (data.isRep ? replitRep : green));
    
    console.log(`Successfully connected to the server as: ${colour(`${data.username} (${data.id})`)}!`);

    chat();
  });

  socket.on('chat', (msg) => {
    console.log(`\n${msg}`)
  })
}

if (process.env.REPL_IDENTITY) {
  main();
} else {
  // red text that tells the user to login with replit
  console.log('\u001b[31m' + "Please login with Replit to use HyperChat v2!" + '\u001b[39m')
}