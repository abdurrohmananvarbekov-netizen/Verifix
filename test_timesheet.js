const clientId = '85D661F8BD5A74003FC1F938387266D3';
const clientSecret = '158B27DBE600131FED027B078324AB4A5FE23C4F8CA2EB3F0491A9EA8AF6E5481D9480B92E503B5F082495B255162B8E4AC44004FEAA02DC50E581133A69C9AE';

async function fetchTimesheet() {
    try {
        const res = await fetch('https://app.verifix.com/security/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret, scope: 'read' })
        });
        const { access_token } = await res.json();
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dd = String(yesterday.getDate()).padStart(2, '0');
        const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
        const formattedDate = `${dd}.${mm}.${yesterday.getFullYear()}`;
        console.log("Date:", formattedDate);
        
        const tsRes = await fetch('https://app.verifix.com/b/vhr/api/v1/core/timesheet$export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token, 'project_code': 'vhr' },
            body: JSON.stringify({
                period_begin_date: formattedDate,
                period_end_date: formattedDate,
                division_ids: [],
                employee_ids: []
            })
        });
        
        if(!tsRes.ok) { console.log('Timesheet error', tsRes.status); return; }
        const data = await tsRes.json();
        console.log(`Found ${data.data?.length || 0} employees.`);
        
        if (data.data?.length > 0) {
            const sample = data.data.slice(0, 5).map(e => ({
                name: e.employee_name,
                days: e.days
            }));
            console.log(JSON.stringify(sample, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}
fetchTimesheet();
