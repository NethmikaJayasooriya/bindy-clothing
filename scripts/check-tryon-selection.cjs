const assert=require('node:assert/strict'),loader=require('./lib/load-project.cjs');
const original={fetch:global.fetch,Image:global.Image,setTimeout:global.setTimeout,clearTimeout:global.clearTimeout};
let cursor=0,cells=[],effects=[],pendingEffects=[],timers=new Map(),nextTimer=0,requests=[],decodes=[];
const react={
 useState(initial){const i=cursor++;if(!(i in cells))cells[i]=typeof initial==='function'?initial():initial;return [cells[i],v=>{cells[i]=typeof v==='function'?v(cells[i]):v;}];},
 useRef(initial){const i=cursor++;return cells[i]??(cells[i]={current:initial});},
 useEffect(fn,deps){const i=cursor++;const old=effects[i];if(!old||deps.some((d,n)=>d!==old.deps[n]))pendingEffects.push(()=>{old?.cleanup?.();effects[i]={deps,cleanup:fn()};});}
};
global.setTimeout=(fn,ms)=>{const id=++nextTimer;timers.set(id,{fn,ms});return id;};global.clearTimeout=id=>timers.delete(id);
global.fetch=(url,options)=>new Promise(resolve=>requests.push({options,resolve}));
global.Image=class{naturalWidth=880;naturalHeight=1184;decode(){return new Promise((resolve,reject)=>decodes.push({resolve,reject}));}};
const {useTryOn}=loader({react})('@/components/style-studio/useTryOn');
const top={id:'top',image:'/top.webp'},bottom={id:'bottom',image:'/bottom.webp'},other={id:'other',image:'/other.webp'};
function render(t=top,b=bottom){cursor=0;return useTryOn(t,b);}
function flushEffects(){for(const fn of pendingEffects.splice(0))fn();}
function advance(ms){for(const [id,t]of [...timers])if(t.ms===ms){timers.delete(id);t.fn();}}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function reply(t,b,n=0){requests[n].resolve(Response.json({state:'ready',topId:t.id,bottomId:b.id,pairKey:'a'.repeat(64),url:'/images/tryon-v3/'+'a'.repeat(64)+'.webp'}));}
let count=0;const check=(name,fn)=>{fn();count++;console.log('PASS '+name);};
(async()=>{
 render();flushEffects();advance(300);await tick();reply(top,bottom);await tick();
 check('A result stays hidden until its complete image decodes',()=>assert.equal(render().status,'loading'));
 decodes[0].resolve();await tick();check('Only a decoded result becomes visible',()=>assert.equal(render().status,'ready'));
 const switched=render(top,other);
 check('Changing a garment immediately hides the previous outfit, before effects run',()=>{assert.equal(switched.status,'loading');assert.equal(switched.url,'');});
 flushEffects();advance(300);await tick();
 // A mismatched response must not be decoded or displayed even if the network succeeds.
 reply(top,bottom,1);await tick();check('A response for a different bottom is rejected',()=>{assert.equal(render(top,other).status,'unavailable');assert.equal(decodes.length,1);});
 render(top,bottom);flushEffects();advance(300);await tick();
 render(top,other);flushEffects();advance(300);await tick();
 reply(top,other,3);await tick();decodes[1].resolve();await tick();
 reply(top,bottom,2);await tick();
 check('A late response cannot replace a newer selected outfit',()=>{assert.equal(render(top,other).status,'ready');assert.equal(decodes.length,2);assert.equal(requests[2].options.signal.aborted,true);});
 render({...top,image:'/updated.webp'},other);flushEffects();advance(300);await tick();reply(top,other,4);await tick();decodes[2].reject(new Error('broken image'));await tick();
 check('A corrupt image never becomes a fitting preview',()=>{assert.equal(render({...top,image:'/updated.webp'},other).status,'unavailable');assert.equal(render({...top,image:'/updated.webp'},other).url,'');});
 console.log(`${count} asynchronous selection and image decode checks passed.`);
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{for(const e of effects)e?.cleanup?.();Object.assign(global,original);});
