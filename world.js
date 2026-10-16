(function(){
const hero=document.getElementById('hero'),PI=Math.PI,mob=matchMedia('(hover:none)').matches;
try{
const cv=document.getElementById('c');
const gl=cv&& (cv.getContext('webgl',{alpha:false})||cv.getContext('experimental-webgl',{alpha:false}));
if(!gl)throw new Error('WebGL is unavailable');
const R=new THREE.WebGLRenderer({canvas:cv,context:gl,antialias:!mob});
R.setPixelRatio(Math.min(devicePixelRatio,2));R.shadowMap.enabled=!mob;R.shadowMap.type=THREE.PCFSoftShadowMap;
R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.15;
const S=new THREE.Scene();S.fog=new THREE.FogExp2(0x0a1424,.011);
const cam=new THREE.PerspectiveCamera(60,1,.1,500);
const sky=new THREE.Mesh(new THREE.SphereGeometry(320,24,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying float h;void main(){vec3 a=vec3(.09,.2,.36),b=vec3(.015,.03,.09);vec3 c=mix(a,b,smoothstep(0.,.6,h));c+=vec3(.25,.55,.7)*smoothstep(.12,0.,abs(h))*.4;gl_FragColor=vec4(c,1.);}'}));S.add(sky);
const sp0=[];for(let i=0;i<700;i++){const a=Math.random()*2*PI,y=.1+Math.random()*.9,r=Math.sqrt(1-y*y)*300;sp0.push(Math.sin(a)*r,y*300,Math.cos(a)*r)}
const sgm=new THREE.BufferGeometry();sgm.setAttribute('position',new THREE.Float32BufferAttribute(sp0,3));S.add(new THREE.Points(sgm,new THREE.PointsMaterial({color:0xdff6ff,size:1.4,fog:false,sizeAttenuation:false})));
const moon=new THREE.Mesh(new THREE.SphereGeometry(14,24,16),new THREE.MeshBasicMaterial({color:0xe6f7ff,fog:false}));moon.position.set(-150,110,-220);S.add(moon);
S.add(new THREE.HemisphereLight(0x8fc4ff,0x10213A,.75));
const sun=new THREE.DirectionalLight(0xbfdcff,1.1);sun.castShadow=!mob;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=sc.bottom=-55;sc.right=sc.top=55;sc.far=160;sun.shadow.bias=-.0004;S.add(sun,sun.target);
const mats={};const M=(c,o)=>{const k=c+JSON.stringify(o||0);return mats[k]||(mats[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.55,metalness:.3},o)))};
let cur=null;const G=(c,i)=>{const m=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:i,roughness:.4});m.bi=i;if(cur)cur.push(m);return m};
const sh=o=>{o.castShadow=o.receiveShadow=true;return o};
const bx=(w,h,d,m,x,y,z,p)=>{const o=sh(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m));o.position.set(x,y,z);(p||S).add(o);return o};
const cy=(rt,rb,h,m,x,y,z,p,s)=>{const o=sh(new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,s||20),m));o.position.set(x,y,z);(p||S).add(o);return o};
const to=(r,t,m,x,y,z,p,rx)=>{const o=new THREE.Mesh(new THREE.TorusGeometry(r,t,8,40),m);o.position.set(x,y,z);o.rotation.x=rx==null?PI/2:rx;(p||S).add(o);return o};
const tex=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t};
const spin=[],fl=[],leds=[],pulse=[];
// ground + scenery
const gnd=new THREE.Mesh(new THREE.PlaneGeometry(700,700),new THREE.MeshStandardMaterial({color:0x0c1a2e,roughness:1}));gnd.rotation.x=-PI/2;gnd.receiveShadow=true;S.add(gnd);
const gr=new THREE.GridHelper(200,50,0x1c3a66,0x11243f);gr.position.y=.01;S.add(gr);
for(let i=0;i<18;i++){const a=i/18*2*PI+Math.random()*.2,r=150+Math.random()*60,s=22+Math.random()*30;const m=new THREE.Mesh(new THREE.ConeGeometry(s,s*(1+Math.random()*.8),6),new THREE.MeshStandardMaterial({color:0x0e2342,roughness:1,flatShading:true,emissive:0x0a1a33}));m.position.set(Math.sin(a)*r,s*.4,Math.cos(a)*r);S.add(m)}
// roads
const asp=M(0x1a2438,{roughness:.9,metalness:0}),edge=new THREE.MeshBasicMaterial({color:0x67DDF5});
const flat=(g,m,y)=>{const o=new THREE.Mesh(g,m);o.rotation.x=-PI/2;o.position.y=y;o.receiveShadow=true;S.add(o);return o};
flat(new THREE.CircleGeometry(12,48),asp,.03);flat(new THREE.RingGeometry(11.6,12,48),edge,.05);flat(new THREE.RingGeometry(24,30,72),asp,.03);flat(new THREE.RingGeometry(23.8,24.15,72),edge,.05);flat(new THREE.RingGeometry(29.85,30.2,72),edge,.05);
const plz=tex(512,512,(c,w,h)=>{c.fillStyle='#10213A';c.fillRect(0,0,w,h);c.strokeStyle='#4F8CFF';c.lineWidth=6;c.beginPath();c.arc(256,256,230,0,7);c.stroke();c.fillStyle='#F4F7FF';c.font='700 74px sans-serif';c.textAlign='center';c.fillText('RAHUL',256,250);c.fillStyle='#67DDF5';c.fillText('SHARMA',256,330)});
flat(new THREE.CircleGeometry(10.5,48),new THREE.MeshBasicMaterial({map:plz}),.06);
// ramps
const RP=[];function ramp(a,r,rot,L,P,h,w){const x=Math.sin(a)*r,z=Math.cos(a)*r,g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;S.add(g);const la=Math.atan2(h,L),Lr=Math.hypot(L,h);
const rm=bx(w,.5,Lr,M(0x4F8CFF,{emissive:0x1d3f80,emissiveIntensity:.6}),0,h/2-.15,L/2,g);rm.rotation.x=-la;bx(w,h,P,M(0x1b2f52),0,h/2,L+P/2,g);bx(w+.3,.15,P+.3,G(0x67DDF5,1),0,h+.05,L+P/2,g);RP.push({x,z,rot,L,P,h,w})}
const da=i=>i/7*2*PI+PI;ramp(da(0)+PI/7,27,da(0)+PI/7+PI/2,9,6,2.2,6);ramp(da(4)+PI/7,27,da(4)+PI/7+PI/2,9,6,2.2,6);
function hAt(px,pz){let y=0;for(const q of RP){const dx=px-q.x,dz=pz-q.z,s=Math.sin(q.rot),c=Math.cos(q.rot),u=dx*s+dz*c,v=dx*c-dz*s;if(Math.abs(v)<q.w/2){if(u>=0&&u<q.L)y=Math.max(y,q.h*u/q.L);else if(u>=q.L&&u<q.L+q.P)y=Math.max(y,q.h)}}return y}
// destinations
const leM=c=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:1.5}),dk=M(0x10213A),mid=M(0x1b2f52);
const D=[
{k:'proj',i:0,l:'RapidKV',c:0x4F8CFF,h:13,b(g){cy(6,6.5,.8,mid,0,.4,0,g,8);for(let i=0;i<5;i++){bx(6,1.8,5,M(i%2?0x142a4c:0x1c3866),0,1.7+i*2,0,g);bx(6.2,.15,5.2,G(0x67DDF5,1.2),0,2.7+i*2,0,g);for(let j=0;j<6;j++)leds.push(bx(.5,.25,.1,leM(j%3?0x4F8CFF:0x67DDF5),-2.2+j*.88,1.7+i*2,2.55,g))}
spin.push([to(4,.12,G(0x67DDF5,1.5),0,12,0,g),'z',.03],[to(3,.1,G(0x4F8CFF,1.5),0,13,0,g,PI/3),'y',-.04]);const co=cy(.5,.5,2.4,G(0x67DDF5,1.8),0,12.5,0,g,10);fl.push([co,12.5,0])}},
{k:'proj',i:1,l:'Shopora',c:0x67DDF5,h:9,b(g){bx(11,5.5,7,M(0x1c3866),0,2.75,-1,g);bx(9,3,.2,G(0x2a7fb0,.7),0,2.4,2.55,g);bx(1.6,3,.25,G(0x67DDF5,.9),3.6,1.6,2.6,g);
for(let i=0;i<6;i++){const a=bx(1.8,.2,3.4,M(i%2?0x4F8CFF:0xF4F7FF),-4.5+i*1.8,4.3,3.4,g);a.rotation.x=.35}
bx(9,1.5,.35,G(0x67DDF5,1),0,6.5,2.4,g);[[-6,.8,3],[-7.2,.8,1.8],[-6.4,2.1,2.6],[6.5,.8,4]].forEach(p=>bx(1.4,1.4,1.4,M(0x2c5aa8),p[0],p[1],p[2],g));
const bag=bx(1.6,1.8,.9,G(0x4F8CFF,1),0,9.5,0,g);fl.push([bag,9.5,1]);spin.push([bag,'y',.02])}},
{k:'proj',i:2,l:'PlayHub',c:0x4F8CFF,h:13,b(g){const pt=tex(512,288,(c,w,h)=>{const q=c.createLinearGradient(0,0,w,h);q.addColorStop(0,'#10213A');q.addColorStop(1,'#4F8CFF');c.fillStyle=q;c.fillRect(0,0,w,h);c.fillStyle='#F4F7FF';c.beginPath();c.moveTo(210,90);c.lineTo(210,200);c.lineTo(310,145);c.fill()});
bx(14,8,.6,new THREE.MeshBasicMaterial({map:pt}),0,8.5,-1,g);bx(14.6,8.6,.4,G(0x67DDF5,.8),0,8.5,-1.4,g);[-5,5].forEach(x=>cy(.3,.3,5,mid,x,2.5,-1.4,g));
for(let r=0;r<3;r++)for(let s=-3;s<=3;s++)bx(1.3,.8+r*.2,1,M(r%2?0x2c5aa8:0x1c3866),s*1.6,.4+r*.5,3+r*2,g);
[-8.5,8.5].forEach(x=>{bx(1.6,2.6,1.4,dk,x,1.3,0,g);const c=new THREE.Mesh(new THREE.ConeGeometry(2.2,9,16,1,true),new THREE.MeshBasicMaterial({color:0x67DDF5,transparent:true,opacity:.12,side:2,depthWrite:false}));c.position.set(x,6.6,0);g.add(c)})}},
{k:'projects',l:'All projects',c:0x67DDF5,h:9,b(g){cy(7,7.5,.7,mid,0,.35,0,g,24);for(let i=0;i<8;i++){const a=i/8*2*PI;cy(.35,.35,6,M(0xcfe6ff),Math.sin(a)*6,3.6,Math.cos(a)*6,g,10)}
to(6,.25,G(0x67DDF5,1.2),0,6.8,0,g);const ic=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7),G(0x4F8CFF,1.4));ic.position.y=4;g.add(ic);spin.push([ic,'y',.02]);fl.push([ic,4,0]);
for(let i=0;i<5;i++){const m=bx(.9,.9,.9,G(i%2?0x67DDF5:0x4F8CFF,1.1),0,0,0,g);m.userData.o=[i/5*2*PI];spin.push([m,'orb',.015])}}},
{k:'skills',l:'Skills',c:0x67DDF5,h:17,b(g){cy(7,8,.6,mid,0,.3,0,g,6);cy(3,4,15,M(0x1c3866),0,8,0,g,6);[4,8,12].forEach((y,i)=>spin.push([to(5+i*.4,.15,G(i%2?0x4F8CFF:0x67DDF5,1.4),0,y,0,g),'z',.02*(i%2?-1:1)]));
const bc=new THREE.Mesh(new THREE.SphereGeometry(1.5,16,12),G(0x67DDF5,2));bc.position.y=16.5;g.add(bc);fl.push([bc,16.5,0])}},
{k:'about',l:'About',c:0x4F8CFF,h:9,b(g){bx(9,4.5,7,M(0x1c3866),0,2.25,0,g);const rf=cy(0,7,3.2,M(0x2c5aa8),0,6.1,0,g,4);rf.rotation.y=PI/4;rf.scale.set(1.15,1,.9);bx(1.4,2.6,.2,G(0x67DDF5,1),0,1.3,3.55,g);[-3,3].forEach(x=>bx(1.6,1.6,.2,G(0x67DDF5,.9),x,2.6,3.55,g));bx(1,3,1,mid,3,6.4,-1,g)}},
{k:'contact',l:'Contact',c:0x67DDF5,h:19,b(g){cy(6,6.5,.6,mid,0,.3,0,g,10);cy(.3,.55,17,M(0xcfe6ff),0,9,0,g,10);for(let i=0;i<3;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(1.5,16,8,0,2*PI,0,PI/2),G(0x67DDF5,.5));d.position.set(Math.sin(i*2.1)*1.4,10+i*2.2,Math.cos(i*2.1)*1.4);d.rotation.x=PI/2-.5;d.rotation.z=i;g.add(d)}
bx(1.4,1.8,1.1,G(0x4F8CFF,1),4,.9,3,g);for(let i=0;i<3;i++){const r=to(2,.08,new THREE.MeshBasicMaterial({color:0x67DDF5,transparent:true}),0,18,0,g);pulse.push([r,i/3])}}}];
D.forEach((d,i)=>{const a=da(i),x=Math.sin(a)*46,z=Math.cos(a)*46,g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=Math.atan2(-x,-z);g.userData.d=d;S.add(g);cur=d.em=[];d.b(g);cur=null;Object.assign(d,{x,z,g,r:8,a});
const len=Math.hypot(x,z)-6,rd=new THREE.Mesh(new THREE.PlaneGeometry(6,len),asp);rd.rotation.x=-PI/2;rd.rotation.z=-a;rd.rotation.order='YXZ';rd.rotation.set(-PI/2,a,0);rd.position.set(Math.sin(a)*(len/2),.025,Math.cos(a)*(len/2));rd.receiveShadow=true;S.add(rd);
const pad=flat(new THREE.CircleGeometry(9,32),asp,.03);pad.position.x=x;pad.position.z=z;const rg=flat(new THREE.RingGeometry(8.4,9,40),new THREE.MeshBasicMaterial({color:d.c,transparent:true,opacity:.6}),.06);rg.position.set(x,.06,z);d.rg=rg;
const sg=tex(256,96,(c,w,h)=>{c.fillStyle='#10213A';c.fillRect(0,0,w,h);c.strokeStyle='#67DDF5';c.lineWidth=5;c.strokeRect(4,4,w-8,h-8);c.fillStyle='#F4F7FF';c.font='700 34px sans-serif';c.textAlign='center';c.fillText(d.l,w/2,60)});
const sn=new THREE.Group(),sx=Math.sin(a)*34+Math.cos(a)*5,sz=Math.cos(a)*34-Math.sin(a)*5;sn.position.set(sx,0,sz);sn.rotation.y=a+PI;S.add(sn);cy(.12,.12,3,M(0xcfe6ff),0,1.5,0,sn,6);const pl=new THREE.Mesh(new THREE.PlaneGeometry(3.2,1.2),new THREE.MeshBasicMaterial({map:sg,side:2}));pl.position.y=3.3;sn.add(pl)});
// trees, skyline, lamps, turbines, drones
const nT=mob?70:150,tm=new THREE.InstancedMesh(new THREE.ConeGeometry(1.6,4.2,7),new THREE.MeshStandardMaterial({roughness:.8,flatShading:true}),nT),tk=new THREE.InstancedMesh(new THREE.CylinderGeometry(.2,.3,1.4,6),M(0x2a3550),nT),dm=new THREE.Object3D(),tc=new THREE.Color();
let n=0;for(let t=0;t<900&&n<nT;t++){const a=Math.random()*2*PI,r=18+Math.random()*92,x=Math.sin(a)*r,z=Math.cos(a)*r;if(r>20&&r<33)continue;if(r<14)continue;let ok=1;for(const d of D){const dd=Math.hypot(x-d.x,z-d.z);if(dd<15)ok=0;if(r>8){let df=Math.abs(((a-d.a+PI)%(2*PI)+2*PI)%(2*PI)-PI);if(df*r<5)ok=0}}for(const q of RP)if(Math.hypot(x-q.x,z-q.z)<13)ok=0;if(!ok)continue;const s=.8+Math.random()*.9;
dm.position.set(x,2.1*s+1,z);dm.scale.set(s,s,s);dm.rotation.y=Math.random()*6;dm.updateMatrix();tm.setMatrixAt(n,dm.matrix);tm.setColorAt(n,tc.setHex([0x1d6b8f,0x2a7fb0,0x174f7a,0x2b5fb0][n%4]));dm.position.y=.7*s;dm.updateMatrix();tk.setMatrixAt(n,dm.matrix);n++}
tm.count=tk.count=n;tm.castShadow=true;S.add(tm,tk);
const wt=tex(64,64,(c,w,h)=>{c.fillStyle='#0d1b33';c.fillRect(0,0,w,h);for(let i=0;i<40;i++){c.fillStyle=Math.random()>.4?'#67DDF5':'#4F8CFF';c.fillRect(Math.floor(Math.random()*8)*8+2,Math.floor(Math.random()*8)*8+2,4,4)}});
const bm=new THREE.MeshStandardMaterial({color:0x223a66,map:wt,emissive:0xffffff,emissiveMap:wt,emissiveIntensity:.6});
for(let i=0;i<30;i++){const a=i/30*2*PI+Math.random()*.1,r=88+Math.random()*30,h=12+Math.random()*34;bx(8+Math.random()*6,h,8+Math.random()*6,bm,Math.sin(a)*r,h/2,Math.cos(a)*r)}
const lp=new THREE.MeshBasicMaterial({color:0xcfefff});for(let i=0;i<16;i++){const a=i/16*2*PI,x=Math.sin(a)*32,z=Math.cos(a)*32;cy(.1,.12,4,M(0xcfe6ff),x,2,z,null,6);const l=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),lp);l.position.set(x,4.1,z);S.add(l)}
const tb=[];for(let i=0;i<4;i++){const a=.5+i*1.6,x=Math.sin(a)*70,z=Math.cos(a)*70,g=new THREE.Group();g.position.set(x,0,z);S.add(g);cy(.3,.6,16,M(0xdfeaff),0,8,0,g,8);const rt=new THREE.Group();rt.position.set(0,16,.6);g.add(rt);for(let b=0;b<3;b++){const bl=bx(.3,7,.1,M(0xffffff),0,3.5,0,rt);const w=new THREE.Group();w.rotation.z=b*2.1;S.add(w);rt.add(bl);bl.position.set(0,0,0);bl.geometry.translate(0,3.5,0);bl.rotation.z=b*2.1}spin.push([rt,'z',.05])}
const dr=[];for(let i=0;i<4;i++){const d=new THREE.Group();bx(1,.4,1,M(0xdfeaff),0,0,0,d);[[-.6,-.6],[.6,-.6],[-.6,.6],[.6,.6]].forEach(p=>cy(.4,.4,.05,G(0x67DDF5,2),p[0],.3,p[1],d));S.add(d);dr.push(d)}
// car
const car=new THREE.Group(),body=new THREE.Group();car.rotation.order='YXZ';car.add(body);S.add(car);
const cm=new THREE.MeshPhysicalMaterial({color:0x4F8CFF,metalness:.75,roughness:.25,clearcoat:1,clearcoatRoughness:.1,envMapIntensity:1.4});
bx(2.1,.7,4,cm,0,.85,0,body);bx(1.9,.35,1.4,cm,0,1.1,1.55,body).rotation.x=.12;const cb=bx(1.7,.65,1.9,M(0x0b2a4a,{metalness:.9,roughness:.1,emissive:0x1a4a7a,emissiveIntensity:.4}),0,1.5,-.2,body);bx(2.1,.12,.5,M(0xF4F7FF),0,1.35,-2.05,body);
[-.7,.7].forEach(x=>{bx(.4,.2,.1,G(0xF4F7FF,2.5),x,.95,2.02,body);bx(.4,.2,.1,G(0xff3355,1.2),x,.95,-2.02,body)});
const un=new THREE.Mesh(new THREE.PlaneGeometry(2,4),new THREE.MeshBasicMaterial({color:0x67DDF5,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}));un.rotation.x=-PI/2;un.position.y=.1;car.add(un);
const wh=[];[[-1.15,1.25,1],[1.15,1.25,1],[-1.15,-1.25,0],[1.15,-1.25,0]].forEach(p=>{const pv=new THREE.Group(),sp=new THREE.Group();pv.position.set(p[0],.5,p[1]);pv.add(sp);const t=sh(new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.45,18),M(0x05080f,{roughness:.9})));t.rotation.z=PI/2;sp.add(t);const rm=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.47,6),G(0x67DDF5,.8));rm.rotation.z=PI/2;sp.add(rm);car.add(pv);wh.push({pv,sp,f:p[2]})});
const hl=new THREE.PointLight(0x9fe8ff,1.4,16);hl.position.set(0,1,3.5);car.add(hl);
const envTarget=new THREE.WebGLCubeRenderTarget(128,{generateMipmaps:true,minFilter:THREE.LinearMipmapLinearFilter});
const cc=new THREE.CubeCamera(1,600,envTarget);S.add(cc);cc.update(R,S);cm.envMap=envTarget.texture;
car.position.set(0,0,8);car.rotation.y=PI;
// input
const K={},kn={arrowup:'w',arrowdown:'s',arrowleft:'a',arrowright:'d'};
addEventListener('keydown',e=>{const k=kn[e.key.toLowerCase()]||e.key.toLowerCase();K[k]=1;if([' ','arrowup','arrowdown'].includes(e.key.toLowerCase())&&!isOpen)e.preventDefault();if(k==='e'&&near&&!isOpen&&!hero.classList.contains('off')===false)show(near.k,near.i)});
addEventListener('keyup',e=>{delete K[kn[e.key.toLowerCase()]||e.key.toLowerCase()]});
document.querySelectorAll('#dp button,#touchActions button[data-k]').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();K[k]=1});['pointerup','pointerleave','pointercancel'].forEach(v=>b.addEventListener(v,()=>delete K[k]))});
const pr=document.getElementById('prompt');pr.onclick=()=>near&&show(near.k,near.i);
document.getElementById('touchInteract').onclick=()=>near&&!isOpen&&show(near.k,near.i);
D.forEach(d=>{d.el=document.createElement('div');d.el.className='lb';d.el.textContent=d.l;d.el.onclick=()=>show(d.k,d.i);document.body.appendChild(d.el)});
const ray=new THREE.Raycaster(),mp=new THREE.Vector2();let near=null,hov=null,sel=null;
cv.addEventListener('pointermove',e=>{mp.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(mp,cam);const h=ray.intersectObjects(D.map(d=>d.g),true)[0];hov=null;if(h){let o=h.object;while(o&&!o.userData.d)o=o.parent;hov=o&&o.userData.d}cv.style.cursor=hov?'pointer':''});
cv.addEventListener('click',()=>{if(hov&&!isOpen&&hero.classList.contains('off'))show(hov.k,hov.i)});
function rs(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}rs();addEventListener('resize',rs);
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,clk=new THREE.Clock(),vv=new THREE.Vector3(),look=new THREE.Vector3(0,2,0),tg=new THREE.Vector3();
let T=0,spd=0,hd=PI,st=0,pt=0;cam.position.set(0,14,40);
function loop(){requestAnimationFrame(loop);const dt=Math.min(clk.getDelta(),.05)*60;T+=dt/60;
const heroOn=!hero.classList.contains('off'),live=!isOpen&&!heroOn;
if(live){if(K.w)spd+=.016*dt*(spd<0?2.5:1);else if(K.s)spd-=(spd>0?.03:.012)*dt;else spd*=Math.pow(.985,dt);if(K[' '])spd*=Math.pow(.9,dt);spd=Math.max(-.22,Math.min(K.shift?.8:.52,spd));st+=(((K.a?1:0)-(K.d?1:0))*.5-st)*Math.min(1,.15*dt)}else{spd*=Math.pow(.9,dt);st*=.9}
hd+=st*spd*.06*dt;const fx=Math.sin(hd),fz=Math.cos(hd);let x=car.position.x+fx*spd*dt,z=car.position.z+fz*spd*dt;
D.forEach(d=>{const dx=x-d.x,dz=z-d.z,q=Math.hypot(dx,dz);if(q<d.r){x=d.x+dx/q*d.r;z=d.z+dz/q*d.r;spd*=.6}});const q=Math.hypot(x,z);if(q>100){x*=100/q;z*=100/q;spd*=.7}
car.position.x=x;car.position.z=z;car.position.y+=(hAt(x,z)-car.position.y)*Math.min(1,.35*dt);
const pc=Math.atan2(hAt(x+fx*1.8,z+fz*1.8)-hAt(x-fx*1.8,z-fz*1.8),3.6);pt+=(pc-pt)*.2;car.rotation.y=hd;car.rotation.x=-pt;body.rotation.z=st*spd*.3;body.rotation.x=-(K.w?1:0)*.015+(K.s||K[' ']?.03:0);
wh.forEach(w=>{w.sp.rotation.x+=spd*dt/.5;if(w.f)w.pv.rotation.y=st*.55});
sun.position.set(x+30,55,z+20);sun.target.position.set(x,0,z);
// world animation
if(!rm){spin.forEach(s=>{const m=s[0];if(s[1]==='orb'){const a=m.userData.o[0]+=s[2]*dt;m.position.set(Math.sin(a)*3.2,4+Math.sin(T*2+a)*.6,Math.cos(a)*3.2);m.rotation.y=a}else m.rotation[s[1]]+=s[2]*dt});fl.forEach(f=>f[0].position.y=f[1]+Math.sin(T*1.6+f[2])*.35);
leds.forEach((l,i)=>l.material.emissiveIntensity=Math.sin(T*7+i*1.7)>0?1.8:.25);
pulse.forEach(p=>{const f=(T*.5+p[1])%1;p[0].scale.setScalar(1+f*5);p[0].material.opacity=.8*(1-f)});
dr.forEach((d,i)=>{const a=T*.25+i*1.57,r=38+i*4;d.position.set(Math.sin(a)*r,16+Math.sin(T+i)*2,Math.cos(a)*r);d.rotation.y=-a})}
near=near;let nn=null,nearestDistance=Infinity;
D.forEach(d=>{const dist=Math.hypot(d.x-x,d.z-z),on=dist<d.r+7;if(on&&!isOpen&&dist<nearestDistance){nn=d;nearestDistance=dist}const k=(on||hov===d)?2:1;d.em.forEach(m=>m.emissiveIntensity+=(m.bi*k-m.emissiveIntensity)*.12);d.rg.material.opacity=on?.6+Math.sin(T*6)*.3:.45;d.rg.scale.setScalar(on?1+Math.sin(T*5)*.03:1);
vv.set(d.x,d.h+3,d.z).project(cam);const vis=vv.z<1&&Math.abs(vv.x)<1.1&&dist<75&&!isOpen&&!heroOn;d.el.style.display=vis?'block':'none';d.el.style.left=(vv.x*.5+.5)*innerWidth+'px';d.el.style.top=(-vv.y*.5+.5)*innerHeight+'px';d.el.style.borderColor=on?'#67DDF5':'';d.el.style.background=on?'#0e3a5a':''});
if(!isOpen)near=nn;if(isOpen&&!sel)sel=near;if(!isOpen)sel=null;
pr.style.display=near&&live?'block':'none';if(near)pr.textContent='Press E or click to explore.';
const f=Math.min(1,.07*dt);
if(heroOn){const a=T*.12;tg.set(Math.sin(a)*30,13,Math.cos(a)*30);vv.set(0,3,0)}
else if(isOpen&&sel){const l=Math.hypot(sel.x,sel.z);tg.set(sel.x-sel.x/l*20+Math.cos(sel.a)*7,sel.h*.5+6,sel.z-sel.z/l*20-Math.sin(sel.a)*7);vv.set(sel.x,sel.h*.55,sel.z)}
else{const dd=10+Math.abs(spd)*8;tg.set(x-fx*dd,5+Math.abs(spd)*3,z-fz*dd);vv.set(x+fx*4,1.6,z+fz*4)}
cam.position.lerp(tg,f);look.lerp(vv,Math.min(1,.12*dt));cam.lookAt(look);cam.fov+=((60+Math.abs(spd)*24)-cam.fov)*.06;cam.updateProjectionMatrix();
R.render(S,cam)}
loop();
}catch(err){console.error(err);const h=document.getElementById('help');h.textContent='3D unavailable on this device. Use the menu above.';h.style.display='block'}
})();
