const { CreateIdentityTokenAddressedTo } = require('replidentity');
const io = require('socket.io-client');
const repl = require('node:repl');

repl.start({
  prompt: '\u001b[36m>\u001b[39m ',
  eval: myEval,
  completer: myCompleter
});

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

function myEval(cmd, context, filename, callback) {
  process.stdout.write(green('haroon') + ": " + cmd)
  callback();
}

const onlineUsers = [
  'haroon',
  '9pfs',
  'joe',
  
]

function myCompleter(line) {
  const hits = onlineUsers.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : onlineUsers, line];
}