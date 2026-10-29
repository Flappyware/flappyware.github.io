import assert from 'node:assert/strict';
import worker from './contact-worker.mjs';

const sent = [];
const limiter = {limit: async () => ({success:true})};
const env = {CONTACT_LIMIT:limiter,GLOBAL_LIMIT:limiter,EMAIL:{send:async msg=>sent.push(msg)}};
const valid = {name:'Test Visitor',email:'test@example.com',message:'A test inquiry.',company:'Test',services:['AI and HPC infrastructure'],source:'Search'};
const request = (payload, origin='https://flappyware.com') => new Request('https://worker.example/',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(payload)});
let r = await worker.fetch(request(valid),env);
assert.equal(r.status,200);
assert.equal(sent.length,1);
assert.equal(sent[0].to,'brandon@flappyware.com');
assert.equal(sent[0].replyTo,'test@example.com');
assert.match(sent[0].text,/AI and HPC infrastructure/);
r = await worker.fetch(request({...valid,email:'invalid'}),env);
assert.equal(r.status,400);
r = await worker.fetch(request({...valid,website:'bot'}),env);
assert.equal(r.status,400);
r = await worker.fetch(request(valid,'https://example.com'),env);
assert.equal(r.status,403);
r = await worker.fetch(request(valid),{...env,CONTACT_LIMIT:{limit:async()=>({success:false})}});
assert.equal(r.status,429);
r = await worker.fetch(request(valid),{...env,EMAIL:{send:async()=>{throw new Error('delivery');}}});
assert.equal(r.status,503);
assert.equal(sent.length,1);
console.log('Contact handler checks passed.');

