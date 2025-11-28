import esbuild from 'esbuild'
;(async()=>{ console.log('Optimizing...'); await esbuild.build({ entryPoints:['src/client/main.tsx'], bundle:true, minify:true, outfile:'dist/optimized.js' }); console.log('done') })()
