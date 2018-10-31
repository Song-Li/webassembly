function loadWebAssembly(filename, imports) {
  imports = imports || {};
  imports.env = imports.env || {};
  imports.env.memoryBase = imports.env.memoryBase || 0;
  imports.env.tableBase = imports.env.tableBase || 0;
  if (!imports.env.memory) {
    // the number of pages, 64K per page
    imports.env.memory = new WebAssembly.Memory({ initial: 256 });
  }
  if (!imports.env.table) {
    imports.env.table = new WebAssembly.Table({ initial: 0, 
      element: 'anyfunc' });
  }
  return [fetch(filename)
    .then(response => response.arrayBuffer())
    .then(buffer => WebAssembly.compile(buffer))
    .then(module => {
      return new WebAssembly.Instance(module, imports);
    }), imports];
}

var [wasmInstance, imports] = loadWebAssembly("./matrix.wasm");
wasmInstance.then(instance => {
  var bufferPtr = instance.exports.__Z12getBufferPtrv();
  var opMatrixPtr = instance.exports.__Z14getOpMatrixPtrv();
  var resPtr = instance.exports.__Z9getResPtrv()
  console.log(instance.exports);
  console.log(bufferPtr);
  console.log(opMatrixPtr);
  console.log(resPtr);
  var bufferLength = 16384;
  var buffer = new Float32Array(imports.env.memory.buffer, bufferPtr, bufferLength);
  var opMatrix = new Float32Array(imports.env.memory.buffer, opMatrixPtr, 16);
  for (var i = 0; i < buffer.length; i++) {
    buffer[i] = i;
    opMatrix[i] = i;
  }
  var t0 = performance.now();
  var resLength = instance.exports.__Z6matMuliii(0, bufferLength, 16);
  var t1 = performance.now();
  var res = new Float32Array(imports.env.memory.buffer, resPtr, resLength);
  console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
  console.log('buffer', buffer);
  console.log('opMatrix', opMatrix);
  console.log('res', res);
});
