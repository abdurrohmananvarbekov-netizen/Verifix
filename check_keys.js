const clientId1 = 'C48A0648F8299A5C52E46873CCB209B1';
const clientSecret1 = 'E0E15DD6A88E175F95A5D9264FC7D4E4875BEABDA1F1E51D3656545505D31AEF252B06AF7EB5665119594913537270594DA8AC43CA7B3671C8E2F1A0B761A104';

const clientId2 = '85D661F8BD5A74003FC1F938387266D3';
const clientSecret2 = '158B27DBE600131FED027B078324AB4A5FE23C4F8CA2EB3F0491A9EA8AF6E5481D9480B92E503B5F082495B255162B8E4AC44004FEAA02DC50E581133A69C9AE';

async function check(name, id, secret) {
    console.log(`Checking ${name}...`);
    try {
        const res = await fetch('https://app.verifix.com/security/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grant_type: 'client_credentials', client_id: id, client_secret: secret, scope: 'read' })
        });
        if(!res.ok) { console.log(name, 'Token error', res.status); return; }
        const { access_token } = await res.json();
        
        const divRes = await fetch('https://app.verifix.com/b/vhr/api/v1/core/division$list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token, 'project_code': 'vhr' },
            body: JSON.stringify({ division_ids: [] })
        });
        if(!divRes.ok) { console.log(name, 'Division error', divRes.status); return; }
        const { data } = await divRes.json();
        console.log(name, 'Divisions:', data.slice(0, 10).map(d => d.name));
    } catch (e) {
        console.log(name, 'Fetch error:', e.message);
    }
}

async function main() {
    await check('Key1 (Old App.jsx)', clientId1, clientSecret1);
    await check('Key2 (New from chat)', clientId2, clientSecret2);
}
main();
