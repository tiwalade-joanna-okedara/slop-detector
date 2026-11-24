// Rules are plain data so anyone can add their own pet hates.
const SLOP_RULES = [
  {id:'dash', label:'Em or en dash', cls:'dash', re:/[—–]/g, tip:'Use a comma, full stop or colon instead.'},
  {id:'filler', label:'Filler phrase', cls:'claim', re:/\b(in today'?s (fast-paced|digital|ever-changing) (world|landscape)|it'?s (worth noting|important to note) that|at the end of the day|when it comes to|in order to|needless to say|the fact that)\b/gi, tip:'Cut it. The sentence usually works without it.'},
  {id:'hype', label:'Hype word', cls:'claim', re:/\b(revolutioni[sz]e|game[- ]chang(er|ing)|cutting[- ]edge|seamless(ly)?|unlock(s|ing)? (the )?(power|potential)|leverag(e|es|ing)|synerg(y|ies)|robust|delve|elevate|supercharge|best[- ]in[- ]class|world[- ]class|next[- ]level|holistic)\b/gi, tip:'Say what it actually does, in plain words.'},
  {id:'vague', label:'Unsupported claim', cls:'claim', re:/\b(studies show|research (shows|suggests)|experts (say|agree)|many (people|businesses|companies)|countless|it is (widely )?known|everyone knows)\b/gi, tip:'Name the study, the expert or the number, or remove it.'},
  {id:'stat', label:'Number with no source', cls:'claim', re:/\b\d{1,3}(\.\d+)?\s?%(?![^<]*\])/g, tip:'Check there is a source next to this number.'},
  {id:'triplet', label:'AI-style closer', cls:'claim', re:/\b(in conclusion|in summary|to sum up|ultimately|overall),/gi, tip:'End on the point, not on a recap label.'},
  {id:'hedge', label:'Hedge', cls:'claim', re:/\b(very|really|quite|extremely|incredibly|truly|basically|actually|literally)\b/gi, tip:'Usually adds nothing. Try deleting it.'}
];
function scanSlop(text){
  const hits=[];
  for(const r of SLOP_RULES){r.re.lastIndex=0;let m;while((m=r.re.exec(text))){hits.push({rule:r.id,label:r.label,cls:r.cls,tip:r.tip,start:m.index,end:m.index+m[0].length,match:m[0]});if(m[0].length===0)r.re.lastIndex++;}}
  hits.sort((a,b)=>a.start-b.start||b.end-a.end);
  const clean=[];let last=-1;for(const h of hits){if(h.start>=last){clean.push(h);last=h.end;}}
  const words=(text.match(/\b\w+\b/g)||[]).length;
  const score=words?Math.max(0,Math.round(100-clean.length/words*1000)):100;
  return {hits:clean,words,score};
}
if(typeof module!=='undefined')module.exports={scanSlop,SLOP_RULES};
