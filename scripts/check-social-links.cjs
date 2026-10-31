const assert=require('node:assert/strict'),load=require('./lib/load-project.cjs')({react:{cache:fn=>fn},'@/lib/supabase/server':{getSupabaseAdmin:()=>null}});
const {socialLinks,DEFAULT_SOCIALS,DEFAULT_CONTACT_EMAIL,validSocialUrl}=load('@/lib/social-links'),repo=load('@/lib/server/store-repository'),{applyAction}=load('@/lib/server/store-actions');
const state=repo.seedStore(),links=socialLinks(state.settings);
assert.equal(links.length,4);for(const id of ['instagram','facebook','tiktok'])assert.equal(links.find(l=>l.id===id).href,DEFAULT_SOCIALS[id]);assert.equal(links[3].href,'mailto:'+DEFAULT_CONTACT_EMAIL);
for(const url of ['javascript:alert(1)','https://www.facebook.com.evil.test/profile','https://user:pass@facebook.com/profile','http://facebook.com/profile','https://facebook.com:9000/profile','https://facebook.com///'])assert.equal(validSocialUrl(url,'facebook'),false);
const form={...state.settings,facebook:'https://www.facebook.com/newprofile',tiktok:'https://www.tiktok.com/@newprofile'};applyAction(state,'settings',form);assert.equal(repo.publicStore(state).settings.facebook,form.facebook);assert.equal(socialLinks(state.settings).find(l=>l.id==='tiktok').detail,'@newprofile');
assert.throws(()=>applyAction(state,'settings',{...form,tiktok:'https://example.test/@wrong'}));
assert.equal(socialLinks({instagram:'',facebook:'',tiktok:'',email:''}).length,0);
// Existing admin clients must not erase newly saved Facebook/TikTok profiles.
const oldForm={...form};delete oldForm.facebook;delete oldForm.tiktok;applyAction(state,'settings',oldForm);assert.equal(state.settings.facebook,form.facebook);assert.equal(state.settings.tiktok,form.tiktok);
console.log('Social URL safety, exact destinations, admin persistence and backwards compatibility passed.');
